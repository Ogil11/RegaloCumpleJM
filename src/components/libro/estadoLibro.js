import { createContext, useContext, useMemo } from "react";
import { tema } from "../../styles/tema";

/**
 * react-pageflip congela los hijos que le pasamos (usamos
 * renderOnlyPageLengthChange para que no reinicie el libro en cada
 * render). Por eso las páginas NO reciben el estado por props: lo leen
 * de este contexto, que sí atraviesa los hijos congelados.
 * El proveedor está en contexto.jsx.
 */
export const LibroContexto = createContext(null);

export function useLibro() {
  return (
    useContext(LibroContexto) ?? {
      paginaActual: 0,
      orientacion: "landscape",
      total: 0,
      acciones: null,
    }
  );
}

/**
 * Estado de UNA página respecto a la que se está leyendo.
 *  - visible: está en pantalla ahora mismo.
 *  - cerca:   está lo bastante cerca para cargar fotos y videos.
 *  - lado:    'izq' | 'der' | 'unica', para la sombra del pliegue.
 */
export function useEstadoPagina(indice) {
  const { paginaActual, orientacion, total } = useLibro();

  return useMemo(() => {
    const retrato = orientacion === "portrait";
    const enPantalla = retrato ? [paginaActual] : [paginaActual, paginaActual + 1];
    const distancia = Math.min(...enPantalla.map((p) => Math.abs(indice - p)));

    let lado = "unica";
    if (!retrato && indice > 0 && indice < total - 1) {
      lado = indice % 2 === 1 ? "izq" : "der";
    }

    return {
      visible: enPantalla.includes(indice),
      cerca: distancia <= tema.libro.radioCarga,
      distancia,
      lado,
      retrato,
    };
  }, [indice, paginaActual, orientacion, total]);
}
