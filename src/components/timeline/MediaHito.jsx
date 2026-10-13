import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { WashiTape } from "../libro/Adornos";
import FotoSegura, { Reemplazo } from "../comun/FotoSegura";
import { urlOptimizada } from "../comun/Imagen";
import { rellenar, textosHistoria as t } from "../comun/textosHistoria";

/** Ancho de la tarjeta de un momento: media columna en escritorio. */
const SIZES_HITO = "(min-width: 768px) 440px, 90vw";

/**
 * Fotos y video de un momento de la linea de tiempo.
 * - 1 foto: marco polaroid o cinta.
 * - 2 o mas: carrusel pequeno dentro del marco.
 * - video: con controles, se carga solo cuando se acerca a la pantalla.
 * Tocar una foto llama a onAbrir(indice) para abrir el visor.
 */
export default function MediaHito({ fotos, video, poster, marco, rotacion, onAbrir }) {
  const [indice, setIndice] = useState(0);
  const actual = fotos[indice];

  return (
    <div className="mt-4 flex flex-col gap-5">
      {fotos.length === 1 ? (
        <Marco tipo={marco} rotacion={rotacion} pie={actual.pie}>
          <button
            type="button"
            onClick={() => onAbrir(0)}
            aria-label={t.verFoto}
            className="block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lib-rosa)]"
          >
            <FotoSegura src={actual.src} alt={actual.alt} sizes={SIZES_HITO} className="aspect-[4/3] w-full bg-[var(--lib-papel-alterno)]" />
          </button>
        </Marco>
      ) : null}

      {fotos.length > 1 ? (
        <Marco tipo={marco} rotacion={rotacion} pie={actual.pie}>
          <Carrusel fotos={fotos} indice={indice} setIndice={setIndice} onAbrir={onAbrir} />
        </Marco>
      ) : null}

      {video ? (
        <Marco tipo="cinta" rotacion={-rotacion}>
          <VideoHito src={video} poster={poster} />
        </Marco>
      ) : null}
    </div>
  );
}

/** Marco de papel: "polaroid" (borde ancho abajo con el pie) o "cinta" (washi tape arriba). */
function Marco({ tipo = "polaroid", rotacion = 0, pie, children }) {
  const reducir = useReducedMotion();
  const polaroid = tipo !== "cinta";
  return (
    <motion.figure
      className={`relative mx-auto w-[94%] rounded-[2px] ${
        polaroid ? "lib-polaroid p-2.5 pb-2" : "hist-marco-cinta p-1.5"
      }`}
      style={{ rotate: rotacion }}
      whileHover={reducir ? undefined : { rotate: 0, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {!polaroid ? (
        <WashiTape className="-top-3 left-1/2 z-10 h-5 w-20 -translate-x-1/2" indice={Math.abs(Math.round(rotacion))} rotacion={-3} />
      ) : null}
      {children}
      {polaroid && pie ? (
        <figcaption className="lib-mano px-1 pt-2 text-center text-lg leading-tight text-[var(--lib-tinta)]">{pie}</figcaption>
      ) : null}
      {!polaroid && pie ? (
        <figcaption className="lib-mano px-1 pt-1.5 text-center text-base leading-tight text-[var(--lib-tinta-suave)]">
          {pie}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}

const DESLIZ_MINIMO = 40;

/** Carrusel pequeno: flechas, puntos y deslizar con el dedo. */
function Carrusel({ fotos, indice, setIndice, onAbrir }) {
  const reducir = useReducedMotion();
  const [direccion, setDireccion] = useState(0);
  // Si se acaba de arrastrar, el clic no debe abrir el visor.
  const arrastrando = useRef(false);
  const total = fotos.length;
  const foto = fotos[indice];

  const ir = (paso) => {
    setDireccion(paso);
    setIndice((indice + paso + total) % total);
  };

  const desplazamiento = reducir ? 0 : 60;
  const flecha =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--lib-papel)]/85 text-[var(--lib-tinta)] shadow-sm transition hover:bg-[var(--lib-papel)] focus-visible:outline-2 focus-visible:outline-[var(--lib-rosa)]";

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--lib-papel-alterno)]">
        <AnimatePresence initial={false} custom={direccion} mode="popLayout">
          <motion.button
            key={indice}
            type="button"
            aria-label={`${t.verFoto} (${rellenar(t.fotoDeTotal, { actual: indice + 1, total })})`}
            className="absolute inset-0 block cursor-zoom-in touch-pan-y"
            custom={direccion}
            variants={{
              entra: (d) => ({ x: d * desplazamiento + "%", opacity: 0 }),
              centro: { x: "0%", opacity: 1 },
              sale: (d) => ({ x: -d * desplazamiento + "%", opacity: 0 }),
            }}
            initial="entra"
            animate="centro"
            exit="sale"
            transition={{ duration: 0.35, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragStart={() => {
              arrastrando.current = true;
            }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -DESLIZ_MINIMO) ir(1);
              else if (info.offset.x > DESLIZ_MINIMO) ir(-1);
              // Se suelta en el siguiente ciclo, despues del clic que genera el navegador.
              setTimeout(() => {
                arrastrando.current = false;
              }, 0);
            }}
            onClick={() => {
              if (!arrastrando.current) onAbrir(indice);
            }}
          >
            <FotoSegura src={foto.src} alt={foto.alt} sizes={SIZES_HITO} className="h-full w-full" />
          </motion.button>
        </AnimatePresence>

        <button type="button" aria-label={t.fotoAnterior} onClick={() => ir(-1)} className={`${flecha} left-2`}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" aria-label={t.fotoSiguiente} onClick={() => ir(1)} className={`${flecha} right-2`}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap justify-center pt-1">
        {fotos.map((f, i) => (
          <button
            key={f.src + i}
            type="button"
            aria-label={rellenar(t.irAFoto, { numero: i + 1 })}
            aria-current={i === indice ? "true" : undefined}
            onClick={() => {
              setDireccion(i > indice ? 1 : -1);
              setIndice(i);
            }}
            className="flex h-11 w-11 items-center justify-center"
          >
            <span
              className={`block h-2 rounded-full transition-all ${
                i === indice ? "w-5 bg-[var(--lib-rosa)]" : "w-2 bg-[var(--lib-papel-borde)]"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/** Video con controles. No se monta hasta que esta cerca de la pantalla. */
function VideoHito({ src, poster }) {
  const ref = useRef(null);
  const cerca = useInView(ref, { once: true, margin: "300px 0px" });
  const [error, setError] = useState(false);

  return (
    <div ref={ref} className="aspect-video w-full overflow-hidden bg-[var(--lib-tinta)]">
      {error ? (
        <Reemplazo ruta={src} aviso={t.videoNoEncontrado} />
      ) : cerca ? (
        <video
          src={src}
          poster={poster ? urlOptimizada(poster, 960) : undefined}
          controls
          playsInline
          // Con portada no hace falta bajar nada hasta que le den play.
          preload={poster ? "none" : "metadata"}
          onError={() => setError(true)}
          className="h-full w-full object-contain"
        />
      ) : null}
    </div>
  );
}
