import optimizadas from "virtual:imagenes-optimizadas";

/**
 * Versiones .webp que plugins/imagenes.js crea al construir:
 * "/fotos/a.jpg" -> [480, 960, 1600]. En `npm run dev` va vacio y se
 * usa la foto original.
 */
function anchosDe(src) {
  return (src && optimizadas[src]) || null;
}

function variante(src, ancho) {
  return src.replace(/\.[^./]+$/, "") + `-${ancho}.webp`;
}

/**
 * La version mas liviana que tenga al menos `ancho` px (para fondos CSS,
 * posters de video y precargas). Si no hay versiones, la original.
 */
export function urlOptimizada(src, ancho = 960) {
  const anchos = anchosDe(src);
  if (!anchos) return src;
  return variante(src, anchos.find((a) => a >= ancho) ?? anchos.at(-1));
}

/**
 * <img> que, en la version publicada, sirve .webp del tamano justo
 * segun la pantalla (srcset + sizes). Acepta las mismas props que <img>.
 * - sizes: cuanto ocupa la foto en pantalla, por ejemplo "50vw" o "160px".
 */
export default function Imagen({ src, sizes = "100vw", ...props }) {
  const anchos = anchosDe(src);
  // `src` va al final: loading="lazy" y srcSet deben estar puestos antes
  // de que el navegador empiece a descargar.
  if (!anchos) return <img {...props} src={src} />;
  return (
    <img
      {...props}
      sizes={sizes}
      srcSet={anchos.map((a) => `${variante(src, a)} ${a}w`).join(", ")}
      src={src}
    />
  );
}
