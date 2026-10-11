import pareja from "../../content/pareja.json";
import datos from "../../content/juegos.json";

/**
 * Todo lo que usan los juegos sale de aqui:
 * - el contenido (preguntas, fotos, retos, vales...) de src/content/juegos.json
 * - los textos de botones y avisos de pareja.json -> textosInterfaz.juegos
 */
export const textosJuegos = pareja.textosInterfaz?.juegos ?? {};
export const listaJuegos = Array.isArray(datos.juegos) ? datos.juegos : [];
export const rutasSonidos = datos.sonidos ?? {};

/** Copia de la lista en orden aleatorio (Fisher-Yates). */
export function barajar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Un elemento al azar, o undefined si la lista esta vacia. */
export function alAzar(lista) {
  if (!lista?.length) return undefined;
  return lista[Math.floor(Math.random() * lista.length)];
}
