import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Optimiza las fotos de public/ al construir (npm run build).
 *
 * Por cada .jpg/.jpeg/.png de public/ crea versiones .webp en varios
 * anchos dentro de dist/ (foto-480.webp, foto-960.webp, foto-1600.webp)
 * y recomprime el .jpg original si es muy grande. Los archivos de
 * public/ NO se tocan: los JSON siguen apuntando a /fotos/foto.jpg.
 *
 * La app sabe qué versiones existen por el modulo virtual
 * "virtual:imagenes-optimizadas" (ver src/components/comun/Imagen.jsx).
 * En `npm run dev` ese modulo va vacio y se usan las fotos originales.
 *
 * Las versiones ya hechas se guardan en node_modules/.cache/imagenes,
 * asi solo se procesan las fotos nuevas o cambiadas.
 */

export const ANCHOS = [480, 960, 1600];
const ANCHO_MAX_ORIGINAL = 2000;
const EXTENSIONES = new Set([".jpg", ".jpeg", ".png"]);
const MODULO = "virtual:imagenes-optimizadas";
const MODULO_RESUELTO = "\0" + MODULO;

/** "/fotos/a.jpg" + 960 -> "/fotos/a-960.webp". Igual que en el navegador. */
export function rutaVariante(ruta, ancho) {
  return ruta.replace(/\.[^./]+$/, "") + `-${ancho}.webp`;
}

async function listarImagenes(dir, base = dir) {
  if (!existsSync(dir)) return [];
  const salida = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const completo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) salida.push(...(await listarImagenes(completo, base)));
    else if (EXTENSIONES.has(path.extname(entrada.name).toLowerCase()) && !entrada.name.startsWith("apple-touch-icon")) {
      salida.push({ completo, ruta: "/" + path.relative(base, completo).split(path.sep).join("/") });
    }
  }
  return salida;
}

export default function imagenesOptimizadas() {
  let config;
  let sharp = null;
  // ruta publica -> { completo, anchos: [...] }
  let mapa = new Map();

  return {
    name: "regalo:imagenes-optimizadas",

    configResolved(c) {
      config = c;
    },

    async buildStart() {
      mapa = new Map();
      if (config.command !== "build") return;
      try {
        sharp = (await import("sharp")).default;
      } catch {
        this.warn("No se encontró 'sharp': las fotos se publican sin optimizar. Corre npm install.");
        return;
      }
      for (const img of await listarImagenes(config.publicDir)) {
        try {
          const { width } = await sharp(img.completo).metadata();
          if (!width) continue;
          const anchos = ANCHOS.filter((a) => a < width);
          // La version mas grande nunca supera la foto original.
          anchos.push(Math.min(width, ANCHOS.at(-1)));
          mapa.set(img.ruta, { completo: img.completo, anchos: [...new Set(anchos)].sort((a, b) => a - b) });
        } catch {
          this.warn(`No se pudo leer ${img.ruta}; se publica tal cual.`);
        }
      }
    },

    resolveId(id) {
      return id === MODULO ? MODULO_RESUELTO : null;
    },

    load(id) {
      if (id !== MODULO_RESUELTO) return null;
      const datos = Object.fromEntries([...mapa].map(([ruta, { anchos }]) => [ruta, anchos]));
      return `export default ${JSON.stringify(datos)};`;
    },

    async writeBundle() {
      if (!sharp || mapa.size === 0) return;
      const salida = path.resolve(config.root, config.build.outDir);
      const cache = path.resolve(config.root, "node_modules/.cache/imagenes");
      await mkdir(cache, { recursive: true });

      let hechas = 0;
      for (const [ruta, { completo, anchos }] of mapa) {
        const original = await readFile(completo);
        const huella = createHash("sha1").update(original).digest("hex").slice(0, 16);
        const destinoBase = path.join(salida, ...ruta.split("/"));
        await mkdir(path.dirname(destinoBase), { recursive: true });

        const trabajos = anchos.map((ancho) => ({
          destino: path.join(salida, ...rutaVariante(ruta, ancho).split("/")),
          enCache: path.join(cache, `${huella}-${ancho}.webp`),
          crear: () => sharp(original).rotate().resize({ width: ancho, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer(),
        }));

        // El .jpg original tambien se aligera (solo en dist/), por si algun
        // navegador no entiende .webp. Se queda el mas liviano de los dos.
        if (/\.jpe?g$/i.test(ruta)) {
          trabajos.push({
            destino: destinoBase,
            enCache: path.join(cache, `${huella}-original.jpg`),
            crear: async () => {
              const nuevo = await sharp(original)
                .rotate()
                .resize({ width: ANCHO_MAX_ORIGINAL, withoutEnlargement: true })
                .jpeg({ quality: 82, mozjpeg: true })
                .toBuffer();
              return nuevo.length < original.length ? nuevo : original;
            },
          });
        }

        for (const trabajo of trabajos) {
          let datos;
          if (existsSync(trabajo.enCache)) datos = await readFile(trabajo.enCache);
          else {
            datos = await trabajo.crear();
            await writeFile(trabajo.enCache, datos);
            hechas += 1;
          }
          await writeFile(trabajo.destino, datos);
        }
      }
      config.logger.info(`\n  Fotos optimizadas: ${mapa.size} (${hechas} versiones nuevas, el resto desde la cache)`);
    },
  };
}

