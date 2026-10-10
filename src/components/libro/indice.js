/**
 * Entradas del índice desplegable. Salen de libro.json:
 * cualquier pagina con el campo "indice" aparece aqui.
 * Las paginas de tipo "separador" se marcan como capitulo.
 */
export function entradasIndice(paginas) {
  return paginas
    .map((p, i) => ({
      indice: i,
      etiqueta: p.indice || (p.tipo === "separador" ? p.titulo : null),
      capitulo: p.tipo === "separador",
    }))
    .filter((e) => Boolean(e.etiqueta));
}
