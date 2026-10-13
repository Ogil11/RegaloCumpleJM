/**
 * Deja la clave de acceso comparable: minusculas, sin tildes y solo
 * letras y numeros. Asi "2023-01-01", "2023/01/01" y "20230101" valen
 * igual, y "Mi Amor" es lo mismo que "mi amor".
 * Lo usan la pantalla de acceso y plugins/pareja.js (no tiene imports
 * para que Node tambien lo pueda cargar).
 */
export function normalizarClave(texto = "") {
  return String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Prefijo de una clave ya convertida en huella al construir. */
export const PREFIJO_HUELLA = "sha256:";
