import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import datos from "../../content/timeline.json";
import Lightbox from "../comun/Lightbox";
import { normalizarFoto, textosHistoria as t } from "../comun/textosHistoria";
import Hito from "./Hito";
import { leerFecha } from "./fechas";

/**
 * Linea de tiempo de src/content/timeline.json.
 * Los momentos se ordenan por fecha. La linea se "dibuja" a medida que
 * se baja, y cada foto abre el visor a pantalla completa.
 */
export default function LineaTiempo() {
  const momentos = useMemo(() => prepararMomentos(datos.momentos ?? []), []);
  const contenedor = useRef(null);
  const [visor, setVisor] = useState({ fotos: [], indice: null });

  // 0 cuando el inicio de la lista llega a 3/4 de la pantalla, 1 cuando llega el final.
  const { scrollYProgress } = useScroll({ target: contenedor, offset: ["start 75%", "end 75%"] });
  const trazo = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  const cerrar = useCallback(() => setVisor((v) => ({ ...v, indice: null })), []);
  const cambiar = useCallback((indice) => setVisor((v) => ({ ...v, indice })), []);

  if (!momentos.length) {
    return <p className="lib-mano text-center text-xl text-[var(--lib-tinta-suave)]">{t.sinMomentos}</p>;
  }

  return (
    <div ref={contenedor} className="relative">
      {/* Carril de la linea y el trazo que se dibuja */}
      <div
        aria-hidden="true"
        className="absolute bottom-12 left-5 top-3 w-[3px] -translate-x-1/2 rounded-full bg-[var(--lib-dorado-claro)]/45 md:left-1/2"
      >
        <motion.div
          className="h-full w-full origin-top rounded-full bg-gradient-to-b from-[var(--lib-rosa)] via-[var(--lib-tapa-clara)] to-[var(--lib-dorado)]"
          style={{ scaleY: trazo }}
        />
      </div>

      <ol className="relative">
        {momentos.map(({ momento, fecha }, i) => (
          <Hito
            key={momento.id ?? i}
            momento={momento}
            fecha={fecha}
            posicion={i}
            onAbrirFoto={(indice) =>
              setVisor({
                fotos: momento.fotos.map((f) => ({ ...f, pie: f.pie || momento.titulo })),
                indice,
              })
            }
          />
        ))}
      </ol>

      <Lightbox items={visor.fotos} indice={visor.indice} onCambiar={cambiar} onCerrar={cerrar} />
    </div>
  );
}

/** Junta foto/fotos en una sola lista y ordena por fecha (sin fecha, al final). */
function prepararMomentos(lista) {
  return lista
    .map((m, orden) => {
      const sueltas = Array.isArray(m.fotos) ? m.fotos : [];
      const crudas = sueltas.length ? sueltas : m.foto ? [{ src: m.foto, alt: m.alt, pie: m.pie }] : [];
      const fotos = crudas.map((f) => normalizarFoto(f, m.titulo)).filter(Boolean);
      return { momento: { ...m, fotos }, fecha: leerFecha(m.fecha), orden };
    })
    .sort((a, b) => {
      if (a.fecha && b.fecha) return a.fecha - b.fecha || a.orden - b.orden;
      if (a.fecha) return -1;
      if (b.fecha) return 1;
      return a.orden - b.orden;
    });
}
