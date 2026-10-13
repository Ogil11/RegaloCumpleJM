import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Chips fijos arriba para saltar entre las secciones de una pagina.
 * - secciones: lista de { id, etiqueta }. `id` es el id del <section>.
 * Marca solo la seccion que se esta viendo.
 */
export default function BarraSecciones({ secciones, etiqueta }) {
  const reducir = useReducedMotion();
  const [activa, setActiva] = useState(secciones[0]?.id);

  useEffect(() => {
    const elementos = secciones.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!elementos.length) return undefined;
    // Cuenta como "activa" la seccion que cruza la mitad de la pantalla.
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) setActiva(entrada.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    elementos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, [secciones]);

  const saltar = (id) => {
    setActiva(id);
    document.getElementById(id)?.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav
      aria-label={etiqueta}
      className="sticky top-16 z-30 mx-auto flex w-fit gap-1 rounded-full border border-[var(--lib-dorado)]/30 bg-[var(--lib-papel)]/85 p-1 shadow-sm backdrop-blur-sm md:top-3"
    >
      {secciones.map((s) => {
        const esActiva = s.id === activa;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => saltar(s.id)}
            aria-current={esActiva ? "true" : undefined}
            className={`relative min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--lib-rosa)] ${
              esActiva ? "text-[var(--lib-texto-tapa)]" : "text-[var(--lib-tinta-suave)] hover:text-[var(--lib-tinta)]"
            }`}
          >
            {esActiva ? (
              <motion.span
                layoutId="chip-activo"
                className="absolute inset-0 rounded-full bg-[var(--lib-tapa)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : null}
            <span className="relative">{s.etiqueta}</span>
          </button>
        );
      })}
    </nav>
  );
}
