/** Parte un texto en parrafos. En el JSON se separan con una linea en blanco. */
export function parrafos(texto) {
  if (!texto) return [];
  return String(texto)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Convierte los saltos de linea simples en <br> dentro de un parrafo. */
export function lineas(texto) {
  if (!texto) return [];
  return String(texto).split("\n");
}

/** Numero de pagina que se imprime en la hoja (la portada es la 0). */
export function numeroPagina(indice) {
  return indice;
}
