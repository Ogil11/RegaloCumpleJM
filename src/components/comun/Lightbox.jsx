import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import FotoSegura from "./FotoSegura";
import { rellenar, textosHistoria as t } from "./textosHistoria";

/**
 * Visor de fotos a pantalla completa.
 * - items: lista de { src, alt, pie }.
 * - indice: foto abierta, o null si el visor esta cerrado.
 * - onCambiar(nuevoIndice) y onCerrar() los maneja quien lo usa.
 * Navega con flechas, teclado (← → ESC) y deslizando con el dedo.
 */
export default function Lightbox({ items, indice, onCambiar, onCerrar }) {
  const abierto = indice != null && items.length > 0;
  return createPortal(
    <AnimatePresence>
      {abierto ? (
        <Visor key="visor" items={items} indice={indice} onCambiar={onCambiar} onCerrar={onCerrar} />
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

const DESLIZ_MINIMO = 60;

function Visor({ items, indice, onCambiar, onCerrar }) {
  const reducir = useReducedMotion();
  const [direccion, setDireccion] = useState(0);
  const botonCerrar = useRef(null);
  const total = items.length;
  const foto = items[Math.min(indice, total - 1)];
  const varias = total > 1;

  const ir = useCallback(
    (paso) => {
      if (total < 2) return;
      setDireccion(paso);
      onCambiar((indice + paso + total) % total);
    },
    [indice, total, onCambiar]
  );

  // Teclado: ESC cierra, flechas navegan.
  useEffect(() => {
    const alPulsar = (e) => {
      if (e.key === "Escape") onCerrar();
      else if (e.key === "ArrowRight") ir(1);
      else if (e.key === "ArrowLeft") ir(-1);
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [ir, onCerrar]);

  // Bloquea el scroll de fondo y devuelve el foco al cerrar.
  useEffect(() => {
    const anterior = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    botonCerrar.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      if (anterior instanceof HTMLElement) anterior.focus({ preventScroll: true });
    };
  }, []);

  const desplazamiento = reducir ? 0 : 90;
  const variantes = {
    entra: (d) => ({ opacity: 0, x: d * desplazamiento }),
    centro: { opacity: 1, x: 0 },
    sale: (d) => ({ opacity: 0, x: -d * desplazamiento }),
  };

  const botonClase =
    "flex h-11 w-11 items-center justify-center rounded-full bg-[var(--lib-papel)]/15 text-[var(--lib-texto-tapa)] ring-1 ring-[var(--lib-texto-tapa)]/25 backdrop-blur-sm transition hover:bg-[var(--lib-papel)]/30 focus-visible:outline-2 focus-visible:outline-[var(--lib-dorado-claro)]";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={t.visor}
      className="hist-visor fixed inset-0 z-[60] flex flex-col items-center justify-center px-4 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onCerrar}
    >
      <button
        ref={botonCerrar}
        type="button"
        aria-label={t.cerrar}
        title={t.cerrar}
        onClick={onCerrar}
        className={`${botonClase} absolute right-3 top-3`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      {varias ? (
        <p className="lib-titulo absolute left-1/2 top-5 -translate-x-1/2 text-sm tracking-widest text-[var(--lib-texto-tapa)]/80">
          {rellenar(t.fotoDeTotal, { actual: indice + 1, total })}
        </p>
      ) : null}

      <AnimatePresence initial={false} custom={direccion} mode="popLayout">
        <motion.figure
          key={indice}
          custom={direccion}
          variants={variantes}
          initial="entra"
          animate="centro"
          exit="sale"
          transition={{ duration: 0.3, ease: "easeOut" }}
          drag={varias ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_, info) => {
            if (info.offset.x < -DESLIZ_MINIMO || info.velocity.x < -500) ir(1);
            else if (info.offset.x > DESLIZ_MINIMO || info.velocity.x > 500) ir(-1);
          }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-w-full touch-pan-y flex-col items-center gap-3"
        >
          <FotoSegura src={foto.src} alt={foto.alt || foto.pie} modo="contener" />
          {foto.pie ? (
            <figcaption className="lib-mano max-w-xl text-balance text-center text-2xl leading-tight text-[var(--lib-texto-tapa)]">
              {foto.pie}
            </figcaption>
          ) : null}
        </motion.figure>
      </AnimatePresence>

      {varias ? (
        <>
          <button
            type="button"
            aria-label={t.fotoAnterior}
            title={t.fotoAnterior}
            onClick={(e) => {
              e.stopPropagation();
              ir(-1);
            }}
            className={`${botonClase} absolute bottom-4 left-4 sm:bottom-auto sm:left-5 sm:top-1/2 sm:-translate-y-1/2`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={t.fotoSiguiente}
            title={t.fotoSiguiente}
            onClick={(e) => {
              e.stopPropagation();
              ir(1);
            }}
            className={`${botonClase} absolute bottom-4 right-4 sm:bottom-auto sm:right-5 sm:top-1/2 sm:-translate-y-1/2`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      ) : null}
    </motion.div>
  );
}
