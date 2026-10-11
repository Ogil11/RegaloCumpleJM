import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { rellenar } from "../comun/textosHistoria";
import { Corazon, Filigrana } from "../libro/Adornos";
import Celebracion from "./Celebracion";
import { textosJuegos } from "./datosJuegos";
import { Marcador, Marcadores, SinContenido } from "./PiezasJuego";
import { useSonido } from "./sonidos";

const t = textosJuegos.cartas ?? {};

function leerAbiertas(clave) {
  try {
    const lista = JSON.parse(localStorage.getItem(clave) ?? "[]");
    return new Set(Array.isArray(lista) ? lista : []);
  } catch {
    return new Set();
  }
}

/**
 * Cartas para abrir: sobres de juegos.json -> cartas. Al tocar uno se
 * abre la solapa, sale la carta y se lee el mensaje, poema o vale.
 * Los sobres ya abiertos se recuerdan en este navegador.
 */
export default function Cartas({ juego }) {
  const cartas = (juego.cartas ?? []).filter((c) => c?.texto || c?.titulo);
  const clave = `juegos:cartas:${juego.id}`;
  const { reproducir } = useSonido();
  const [abiertas, setAbiertas] = useState(() => leerAbiertas(clave));
  const [actual, setActual] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify([...abiertas]));
    } catch {
      /* sin almacenamiento: solo se recuerda mientras la pagina esta abierta */
    }
  }, [abiertas, clave]);

  if (!cartas.length) return <SinContenido />;

  const abrir = (i) => {
    reproducir("abrir");
    setActual(i);
    setAbiertas((s) => new Set(s).add(i));
  };

  return (
    <div>
      <p className="lib-mano mb-3 text-center text-xl text-[var(--lib-tinta-suave)]">{t.ayuda}</p>
      <Marcadores>
        <Marcador>{rellenar(t.progreso, { n: abiertas.size, total: cartas.length })}</Marcador>
      </Marcadores>

      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-x-6">
        {cartas.map((carta, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => abrir(i)}
            aria-label={rellenar(t.abrir, { titulo: carta.sobre || carta.titulo || i + 1 })}
            className="group flex flex-col items-center gap-2 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            whileHover={{ y: -4, rotate: i % 2 ? 1.5 : -1.5 }}
            whileTap={{ scale: 0.96 }}
          >
            <Sobre tipo={carta.tipo} abierta={abiertas.has(i)} />
            <span className="lib-mano text-lg leading-tight text-[var(--lib-tinta)]">{carta.sobre || carta.titulo}</span>
            {abiertas.has(i) ? (
              <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--lib-tinta-suave)]">{t.abierta}</span>
            ) : null}
          </motion.button>
        ))}
      </div>

      <VisorCarta carta={actual !== null ? cartas[actual] : null} indice={actual} onCerrar={() => setActual(null)} />
    </div>
  );
}

/** Dibujo de un sobre cerrado (o ya abierto, con la solapa levantada). */
function Sobre({ tipo, abierta }) {
  return (
    <span className={`jue-sobre jue-sobre-${tipo || "mensaje"} relative block aspect-[4/3] w-full`}>
      <svg viewBox="0 0 160 120" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <rect x="2" y="2" width="156" height="116" rx="6" className="jue-sobre-cuerpo" />
        <path d="M4 114 80 62l76 52" className="jue-sobre-pliegue" />
        {abierta ? (
          <path d="M4 6 80 -30 156 6" className="jue-sobre-solapa" />
        ) : (
          <path d="M4 6 80 66 156 6Z" className="jue-sobre-solapa" />
        )}
      </svg>
      {!abierta ? (
        <span className="absolute left-1/2 top-[52%] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--lib-tapa)] shadow-md transition-transform group-hover:scale-110">
          <Corazon className="h-5 w-5" color="var(--lib-texto-tapa)" />
        </span>
      ) : null}
    </span>
  );
}

function VisorCarta({ carta, indice, onCerrar }) {
  return createPortal(
    <AnimatePresence>
      {carta ? <Modal key={indice} carta={carta} onCerrar={onCerrar} /> : null}
    </AnimatePresence>,
    document.body
  );
}

function Modal({ carta, onCerrar }) {
  const reducir = useReducedMotion();
  // "sobre": se ve el sobre abriendose; "carta": ya se lee el contenido.
  const [fase, setFase] = useState(reducir ? "carta" : "sobre");
  const cerrar = useRef(null);

  useEffect(() => {
    const anterior = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const alPulsar = (e) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", alPulsar);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", alPulsar);
      anterior?.focus?.();
    };
  }, [onCerrar]);

  useEffect(() => {
    if (fase === "carta") cerrar.current?.focus();
  }, [fase]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={carta.titulo || carta.sobre}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[color-mix(in_srgb,var(--lib-sombra-base)_55%,transparent)] p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      {fase === "sobre" ? (
        <SobreAbriendose tipo={carta.tipo} onListo={() => setFase("carta")} />
      ) : (
        <motion.article
          className={`jue-carta-abierta jue-carta-${carta.tipo || "mensaje"} relative my-auto w-full max-w-md px-6 pb-6 pt-8 sm:px-8`}
          initial={{ y: 60, scale: 0.85, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <ContenidoCarta carta={carta} />
          <div className="mt-6 flex justify-center">
            <button ref={cerrar} type="button" className="jue-boton" onClick={onCerrar}>
              {t.guardar || t.cerrar}
            </button>
          </div>
        </motion.article>
      )}
      {fase === "carta" ? <Celebracion disparo={1} /> : null}
    </motion.div>
  );
}

/**
 * El sobre en grande: la solapa gira hacia atras, pasa detras de la
 * carta y la carta asoma. Capas: fondo (0), solapa abierta (1), carta (2),
 * bolsillo de delante (3) y solapa cerrada (4).
 */
function SobreAbriendose({ tipo, onListo }) {
  const [solapaArriba, setSolapaArriba] = useState(false);
  return (
    <motion.div
      className={`jue-sobre jue-sobre-${tipo || "mensaje"} relative aspect-[4/3] w-[min(80vw,340px)]`}
      initial={{ scale: 0.6, y: 40 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      style={{ perspective: 800 }}
    >
      <svg viewBox="0 0 160 120" className="absolute inset-0 z-0 h-full w-full" aria-hidden="true">
        <rect x="2" y="2" width="156" height="116" rx="6" className="jue-sobre-cuerpo" />
      </svg>
      <motion.svg
        viewBox="0 0 160 120"
        className={`absolute inset-0 h-full w-full overflow-visible ${solapaArriba ? "z-[1]" : "z-[4]"}`}
        style={{ transformOrigin: "50% 4%" }}
        aria-hidden="true"
        initial={{ rotateX: 0 }}
        animate={{ rotateX: 180 }}
        transition={{ delay: 0.25, duration: 0.5, ease: "easeInOut" }}
        onAnimationComplete={() => setSolapaArriba(true)}
      >
        <path d="M4 6 80 66 156 6Z" className="jue-sobre-solapa" />
      </motion.svg>
      <motion.div
        className="jue-papel-asoma absolute inset-x-[10%] top-[8%] z-[2] h-[80%] rounded-sm"
        initial={{ y: 0 }}
        animate={{ y: solapaArriba ? "-55%" : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onAnimationComplete={() => {
          if (solapaArriba) onListo();
        }}
      >
        <Filigrana className="mx-auto mt-4 block h-3 w-20" />
      </motion.div>
      <svg viewBox="0 0 160 120" className="absolute inset-0 z-[3] h-full w-full" aria-hidden="true">
        <path d="M2 10v102a6 6 0 0 0 6 6h144a6 6 0 0 0 6-6V10L80 66z" className="jue-sobre-cuerpo" />
        <path d="M4 114 80 62l76 52" className="jue-sobre-pliegue" />
      </svg>
    </motion.div>
  );
}

function ContenidoCarta({ carta }) {
  if (carta.tipo === "vale") {
    return (
      <div className="jue-vale px-4 py-6 text-center">
        <Corazon className="mx-auto block h-8 w-8" />
        {carta.titulo ? (
          <h3 className="font-romantica mt-2 text-3xl text-[var(--lib-tapa)]">{carta.titulo}</h3>
        ) : null}
        <Filigrana className="mx-auto mt-3 block h-3 w-28" />
        {carta.texto ? <p className="lib-cuerpo mt-3 text-[var(--lib-tinta)]">{carta.texto}</p> : null}
        {carta.firma ? <p className="lib-mano mt-4 text-xl text-[var(--lib-tinta-suave)]">{carta.firma}</p> : null}
      </div>
    );
  }
  const poema = carta.tipo === "poema";
  return (
    <div className={poema ? "text-center" : ""}>
      {carta.titulo ? (
        <h3 className="font-romantica text-center text-3xl text-[var(--lib-tinta)]">{carta.titulo}</h3>
      ) : null}
      <Filigrana className="mx-auto mt-2 block h-3 w-28" />
      {carta.texto ? (
        <p
          className={`mt-4 whitespace-pre-line text-[var(--lib-tinta)] ${
            poema ? "lib-mano text-2xl leading-snug" : "lib-cuerpo text-base leading-relaxed"
          }`}
        >
          {carta.texto}
        </p>
      ) : null}
      {carta.firma ? (
        <p className="lib-mano mt-5 text-right text-xl text-[var(--lib-tinta-suave)]">{carta.firma}</p>
      ) : null}
    </div>
  );
}
