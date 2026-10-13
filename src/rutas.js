import { lazy } from "react";

/**
 * Cada pantalla se descarga solo cuando hace falta (un archivo .js por
 * ruta). `precargar` la pide antes, por ejemplo al acercar el dedo a su
 * tarjeta, para que al tocarla ya este lista.
 */
const cargadores = {
  "/juegos": () => import("./pages/Juegos"),
  "/historia": () => import("./pages/Historia"),
  "/libro": () => import("./pages/Libro"),
};

export const Juegos = lazy(cargadores["/juegos"]);
export const Historia = lazy(cargadores["/historia"]);
export const Libro = lazy(cargadores["/libro"]);
export const NoEncontrada = lazy(() => import("./pages/NoEncontrada"));

export function precargar(ruta) {
  cargadores[ruta]?.().catch(() => {
    /* sin red: se reintenta al navegar */
  });
}

/** Precarga todas las pantallas cuando el navegador esta desocupado. */
export function precargarTodasLuego() {
  const pedir = () => Object.keys(cargadores).forEach(precargar);
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(pedir, { timeout: 4000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(pedir, 2500);
  return () => window.clearTimeout(id);
}
