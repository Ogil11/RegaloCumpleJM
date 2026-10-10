import pareja from "../../content/pareja.json";

/**
 * Textos de botones y avisos de la pagina Nuestra historia (contador,
 * visor de fotos, avisos de REEMPLAZAR...).
 * Se editan en src/content/pareja.json -> textosInterfaz.historia.
 */
export const textosHistoria = pareja.textosInterfaz?.historia ?? {};

/** Cambia {clave} por su valor: rellenar("{actual} de {total}", { actual: 1, total: 3 }). */
export function rellenar(plantilla = "", valores = {}) {
  return plantilla.replace(/\{(\w+)\}/g, (todo, clave) => (clave in valores ? String(valores[clave]) : todo));
}

/** Pasa "/fotos/a.jpg" o { src, alt, pie } a { src, alt, pie }. */
export function normalizarFoto(foto, altPorDefecto = "") {
  if (!foto) return null;
  if (typeof foto === "string") return { src: foto, alt: altPorDefecto, pie: "" };
  return { src: foto.src || "", alt: foto.alt || altPorDefecto, pie: foto.pie || "" };
}
