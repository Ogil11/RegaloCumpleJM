import { useMemo } from "react";
import { LibroContexto } from "./estadoLibro";

/**
 * Reparte a todas las páginas qué hoja se está leyendo.
 * Los hooks para leerlo (useLibro, useEstadoPagina) están en estadoLibro.js.
 */
export function ProveedorLibro({ paginaActual, orientacion, total, acciones, children }) {
  const valor = useMemo(
    () => ({ paginaActual, orientacion, total, acciones }),
    [paginaActual, orientacion, total, acciones]
  );
  return <LibroContexto.Provider value={valor}>{children}</LibroContexto.Provider>;
}
