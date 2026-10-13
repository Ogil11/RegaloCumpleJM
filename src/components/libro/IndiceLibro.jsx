import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { textos } from "./textos";

/** Indice desplegable. Las entradas las arma entradasIndice() de indice.js. */
export default function IndiceLibro({ entradas, paginaActual, onIr }) {
  const [abierto, setAbierto] = useState(false);
  const cajaRef = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    const fuera = (e) => {
      if (cajaRef.current && !cajaRef.current.contains(e.target)) setAbierto(false);
    };
    const escape = (e) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", escape);
    };
  }, [abierto]);

  if (entradas.length === 0) return null;

  return (
    <div className="relative" ref={cajaRef}>
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-haspopup="menu"
        className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--lib-dorado)]/40 bg-[var(--lib-papel)]/85 px-3 py-2 text-xs font-medium text-[var(--lib-tinta)] shadow-sm transition hover:bg-[var(--lib-papel)]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
        </svg>
        {textos.indice}
      </button>

      <AnimatePresence>
        {abierto ? (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute bottom-full left-0 z-50 mb-2 max-h-[50vh] w-64 overflow-y-auto rounded-xl border border-[var(--lib-dorado)]/35 bg-[var(--lib-papel)] p-1.5 shadow-xl"
          >
            {entradas.map((e) => {
              const activa = e.indice === paginaActual;
              return (
                <li key={e.indice} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onIr(e.indice);
                      setAbierto(false);
                    }}
                    className={`flex w-full items-baseline justify-between gap-3 rounded-lg px-3 py-2 text-left transition ${
                      activa
                        ? "bg-[var(--lib-rosa-claro)] text-[var(--lib-tinta)]"
                        : "hover:bg-[var(--lib-rosa-claro)]/50"
                    }`}
                  >
                    <span
                      className={`${
                        e.capitulo
                          ? "lib-titulo text-[13px] font-semibold"
                          : "lib-cuerpo pl-3 text-[12px]"
                      } text-[var(--lib-tinta)]`}
                    >
                      {e.etiqueta}
                    </span>
                    <span className="lib-titulo shrink-0 text-[10px] text-[var(--lib-tinta-suave)]">
                      {e.indice}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
