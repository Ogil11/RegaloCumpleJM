import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { tema } from "../src/styles/tema.js";
import { normalizarClave, PREFIJO_HUELLA } from "../src/components/comun/clave.js";

/**
 * Lo que sale de src/content/pareja.json y no puede esperar a que cargue
 * la app (WhatsApp, Instagram y los buscadores no ejecutan JavaScript):
 *
 * - Titulo, descripcion y vista previa al compartir el enlace (Open
 *   Graph), desde pareja.json -> metadatos.
 * - Al construir: og-imagen.jpg (1200x630) a partir de metadatos.imagen
 *   y apple-touch-icon.png a partir de public/favicon.svg.
 * - claveAcceso: en la version publicada se guarda solo su huella
 *   (SHA-256), no la respuesta escrita tal cual.
 */

const ARCHIVO_PAREJA = "src/content/pareja.json";
const OG = { ancho: 1200, alto: 630, archivo: "og-imagen.jpg" };

function escapar(texto = "") {
  return String(texto).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Direccion publica del sitio: pareja.json, o la que dan Netlify / Vercel al construir. */
function urlSitio(metadatos) {
  const propia = metadatos.urlSitio || process.env.URL || "";
  if (propia) return propia.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : "";
}

export default function datosPareja() {
  let config;
  const leer = () => JSON.parse(readFileSync(path.resolve(config.root, ARCHIVO_PAREJA), "utf8"));
  const enPublic = (ruta) => (ruta ? path.join(config.publicDir, ...ruta.split("/").filter(Boolean)) : "");

  return {
    name: "regalo:pareja",
    enforce: "pre",

    configResolved(c) {
      config = c;
    },

    /* Clave de acceso: al construir se cambia por su huella. En
       `npm run dev` se deja igual para poder probar desde el celular
       por la red local (ahi el navegador no deja calcular huellas). */
    transform(codigo, id) {
      if (config.command !== "build" || !id.replace(/\\/g, "/").endsWith(ARCHIVO_PAREJA)) return null;
      const datos = JSON.parse(codigo);
      if (!datos.claveAcceso) return null;
      const huella = createHash("sha256").update(normalizarClave(datos.claveAcceso)).digest("hex");
      datos.claveAcceso = PREFIJO_HUELLA + huella;
      return { code: JSON.stringify(datos), map: null };
    },

    transformIndexHtml(html) {
      const pareja = leer();
      const m = pareja.metadatos ?? {};
      const titulo = m.titulo || pareja.nombre || "";
      const descripcion = m.descripcion || pareja.frase || "";
      const construir = config.command === "build";
      const base = construir ? urlSitio(m) : "";

      const imagenOrigen = m.imagen || pareja.fotoPortada;
      const hayImagen = Boolean(imagenOrigen) && existsSync(enPublic(imagenOrigen));
      const imagen = hayImagen ? (construir ? `${base}/${OG.archivo}` : imagenOrigen) : "";

      const meta = (atributos) => ({ tag: "meta", attrs: atributos, injectTo: "head" });
      const etiquetas = [
        meta({ name: "description", content: descripcion }),
        meta({ name: "theme-color", content: tema.colores.fondo }),
        meta({ property: "og:type", content: "website" }),
        meta({ property: "og:locale", content: (pareja.textosInterfaz?.historia?.idiomaFechas || "es").replace("-", "_") }),
        meta({ property: "og:title", content: titulo }),
        meta({ property: "og:description", content: descripcion }),
        meta({ name: "twitter:card", content: imagen ? "summary_large_image" : "summary" }),
        meta({ name: "twitter:title", content: titulo }),
        meta({ name: "twitter:description", content: descripcion }),
      ];
      if (base) etiquetas.push(meta({ property: "og:url", content: base + "/" }));
      if (imagen) {
        etiquetas.push(meta({ property: "og:image", content: imagen }), meta({ name: "twitter:image", content: imagen }));
        if (m.imagenAlt || pareja.fotoPortadaAlt) {
          etiquetas.push(meta({ property: "og:image:alt", content: m.imagenAlt || pareja.fotoPortadaAlt }));
        }
        if (construir) {
          etiquetas.push(
            meta({ property: "og:image:width", content: String(OG.ancho) }),
            meta({ property: "og:image:height", content: String(OG.alto) })
          );
        }
      }
      if (construir) {
        etiquetas.push({ tag: "link", attrs: { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }, injectTo: "head" });
      }

      return {
        html: html.replace(/<title>.*?<\/title>/s, `<title>${escapar(titulo)}</title>`),
        tags: etiquetas,
      };
    },

    async writeBundle() {
      let sharp;
      try {
        sharp = (await import("sharp")).default;
      } catch {
        return; // plugins/imagenes.js ya avisa que falta sharp
      }
      const salida = path.resolve(config.root, config.build.outDir);
      const pareja = leer();
      const imagenOrigen = pareja.metadatos?.imagen || pareja.fotoPortada;

      if (imagenOrigen && existsSync(enPublic(imagenOrigen))) {
        const datos = await sharp(enPublic(imagenOrigen))
          .rotate()
          .resize(OG.ancho, OG.alto, { fit: "cover", position: "attention" })
          .jpeg({ quality: 82, mozjpeg: true })
          .toBuffer();
        await writeFile(path.join(salida, OG.archivo), datos);
      } else if (imagenOrigen) {
        // Aviso informativo (no es un error): pasa mientras sigan las fotos de ejemplo.
        config.logger.info(`\n  Vista previa al compartir: falta public${imagenOrigen}; el enlace se compartira sin foto.`);
      }

      // Si ya hay un apple-touch-icon.png en public/ (por ejemplo dibujado a
      // partir de un emoji, que el servidor no sabe pintar), se usa ese.
      const favicon = path.join(config.publicDir, "favicon.svg");
      const iconoPropio = existsSync(path.join(config.publicDir, "apple-touch-icon.png"));
      if (existsSync(favicon) && !iconoPropio) {
        // Fondo solido: iOS no admite transparencia en el icono.
        const icono = await sharp(favicon, { density: 600 }).resize(140, 140).png().toBuffer();
        const datos = await sharp({ create: { width: 180, height: 180, channels: 4, background: tema.colores.papel } })
          .composite([{ input: icono, gravity: "center" }])
          .png()
          .toBuffer();
        await writeFile(path.join(salida, "apple-touch-icon.png"), datos);
      }
    },
  };
}
