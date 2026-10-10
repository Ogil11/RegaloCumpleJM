import { useCallback, useMemo, useState } from "react";
import datos from "../../content/collage.json";
import Lightbox from "../comun/Lightbox";
import { normalizarFoto, textosHistoria as t } from "../comun/textosHistoria";
import FotoCollage from "./FotoCollage";
import { PROPORCION_CORAZON, posicionesCorazon } from "./posicionesCorazon";

/* "tamano" de cada foto en collage.json -> celdas que ocupa en el mosaico. */
const TAMANOS = {
  normal: "",
  ancha: "col-span-2",
  alta: "row-span-2",
  grande: "col-span-2 row-span-2",
};

/**
 * Collage de src/content/collage.json.
 * Mosaico de fotos de distintos tamanos o, con "formaCorazon": true,
 * las fotos colocadas formando un corazon. Cada foto abre el visor.
 */
export default function Collage() {
  const fotos = useMemo(
    () =>
      (datos.fotos ?? [])
        .map((f) => {
          const base = normalizarFoto(f);
          return base ? { ...f, ...base } : null;
        })
        .filter(Boolean),
    []
  );
  const [abierta, setAbierta] = useState(null);
  const cerrar = useCallback(() => setAbierta(null), []);

  if (!fotos.length) {
    return <p className="lib-mano text-center text-xl text-[var(--lib-tinta-suave)]">{t.sinFotos}</p>;
  }

  return (
    <>
      {datos.formaCorazon ? (
        <Corazon fotos={fotos} texto={datos.textoCentro} onAbrir={setAbierta} />
      ) : (
        <div className="grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-4 p-1 sm:auto-rows-[180px] sm:grid-cols-3 sm:gap-6 lg:auto-rows-[200px] lg:grid-cols-4">
          {fotos.map((foto, i) => (
            <FotoCollage
              key={foto.id ?? i}
              foto={foto}
              posicion={i}
              className={TAMANOS[foto.tamano] ?? ""}
              onAbrir={() => setAbierta(i)}
            />
          ))}
        </div>
      )}

      <Lightbox items={fotos} indice={abierta} onCambiar={setAbierta} onCerrar={cerrar} />
    </>
  );
}

/** Las fotos sobre el contorno de un corazon, con un texto opcional en medio. */
function Corazon({ fotos, texto, onAbrir }) {
  const { tamano, puntos, centro } = useMemo(() => posicionesCorazon(fotos.length), [fotos.length]);

  return (
    <div className="relative mx-auto w-full max-w-[680px]" style={{ aspectRatio: PROPORCION_CORAZON }}>
      {texto && centro ? (
        <p
          className="lib-mano pointer-events-none absolute z-10 w-[44%] -translate-x-1/2 -translate-y-1/2 text-balance text-center text-xl leading-tight text-[var(--lib-tapa)] sm:text-4xl"
          style={{ left: `${centro.x}%`, top: `${centro.y}%` }}
        >
          {texto}
        </p>
      ) : null}

      {fotos.map((foto, i) => (
        <FotoCollage
          key={foto.id ?? i}
          foto={foto}
          posicion={i}
          compacto
          className="absolute! aspect-square -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${puntos[i].x}%`, top: `${puntos[i].y}%`, width: `${tamano}%` }}
          onAbrir={() => onAbrir(i)}
        />
      ))}
    </div>
  );
}
