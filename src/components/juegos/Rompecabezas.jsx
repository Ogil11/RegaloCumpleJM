import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reemplazo } from "../comun/FotoSegura";
import { urlOptimizada } from "../comun/Imagen";
import { normalizarFoto, rellenar, textosHistoria } from "../comun/textosHistoria";
import { EsquinasFoto } from "../libro/Adornos";
import Celebracion from "./Celebracion";
import { barajar, textosJuegos } from "./datosJuegos";
import { Marcador, Marcadores, MensajeFinal } from "./PiezasJuego";
import { useSonido } from "./sonidos";

const t = textosJuegos.rompecabezas ?? {};
// Pixeles que hay que mover el dedo para que cuente como arrastre y no como toque.
const UMBRAL_ARRASTRE = 8;

/** Carga la foto para saber si existe y su proporcion (ancho / alto). */
function useImagen(src) {
  const [info, setInfo] = useState(() => ({ estado: src ? "cargando" : "error", proporcion: 1 }));
  useEffect(() => {
    if (!src) return undefined;
    let vivo = true;
    const img = new Image();
    img.onload = () => {
      if (vivo) setInfo({ estado: "ok", proporcion: img.naturalWidth / img.naturalHeight || 1 });
    };
    img.onerror = () => {
      if (vivo) setInfo({ estado: "error", proporcion: 1 });
    };
    img.src = src;
    return () => {
      vivo = false;
    };
  }, [src]);
  return info;
}

/** Orden aleatorio de las piezas que nunca sale ya resuelto. */
function mezclar(total) {
  const base = Array.from({ length: total }, (_, i) => i);
  let orden = barajar(base);
  while (total > 1 && orden.every((p, i) => p === i)) orden = barajar(base);
  return orden;
}

/**
 * Rompecabezas: la foto de juegos.json se parte en 3x3 o 4x4.
 * Se arrastra una pieza sobre otra (dedo o mouse) para cambiarlas,
 * o se tocan dos piezas seguidas. Al terminar sale la foto y la dedicatoria.
 */
export default function Rompecabezas({ juego }) {
  const foto = normalizarFoto(juego.foto) ?? { src: "", alt: "" };
  // Version .webp de 960 px (al publicar): nitida en el tablero y liviana.
  const srcOptimo = urlOptimizada(foto.src, 960);
  const imagen = useImagen(srcOptimo);
  const validos = (juego.tamanos ?? [3, 4]).map(Number).filter((n) => n >= 2 && n <= 8);
  const tamanos = validos.length ? validos : [3];
  const [tamano, setTamano] = useState(tamanos.length === 1 ? tamanos[0] : null);
  const [partida, setPartida] = useState(1);

  if (!tamano) {
    return (
      <div className="text-center">
        <p className="lib-mano mb-4 text-2xl text-[var(--lib-tinta-suave)]">{t.elegirTamano}</p>
        <div className="flex flex-wrap justify-center gap-4">
          {tamanos.map((n) => (
            <motion.button
              key={n}
              type="button"
              onClick={() => setTamano(n)}
              className="jue-tarjeta flex w-32 flex-col items-center gap-3 p-4"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
            >
              <span
                aria-hidden="true"
                className="grid aspect-square w-20 gap-[2px]"
                style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
              >
                {Array.from({ length: n * n }, (_, i) => (
                  <span key={i} className="rounded-[2px] bg-[var(--lib-rosa-claro)]" />
                ))}
              </span>
              <span className="lib-titulo text-lg font-bold text-[var(--lib-tinta)]">{rellenar(t.tamano, { n })}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Tablero
      key={`${tamano}-${partida}`}
      n={tamano}
      foto={{ ...foto, optimo: srcOptimo }}
      imagen={imagen}
      dedicatoria={juego.dedicatoria}
      onReiniciar={() => setPartida((p) => p + 1)}
      onCambiarTamano={tamanos.length > 1 ? () => setTamano(null) : null}
    />
  );
}

function Tablero({ n, foto, imagen, dedicatoria, onReiniciar, onCambiarTamano }) {
  const { reproducir } = useSonido();
  const total = n * n;
  const [orden, setOrden] = useState(() => mezclar(total));
  const [movimientos, setMovimientos] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [arrastre, setArrastre] = useState(null);
  const [verModelo, setVerModelo] = useState(false);
  const tablero = useRef(null);

  const conFoto = imagen.estado === "ok";
  const proporcion = conFoto ? imagen.proporcion : 1;
  const resuelto = orden.every((p, i) => p === i);
  const ancho = `min(100%, 520px, calc(60dvh * ${proporcion}))`;

  const intercambiar = (a, b) => {
    if (a === b || a == null || b == null) return;
    const nuevo = [...orden];
    [nuevo[a], nuevo[b]] = [nuevo[b], nuevo[a]];
    setOrden(nuevo);
    setMovimientos((m) => m + 1);
    reproducir(nuevo.every((p, i) => p === i) ? "victoria" : "voltear");
  };

  const tocar = (casilla) => {
    if (seleccion === null) {
      setSeleccion(casilla);
      return;
    }
    intercambiar(seleccion, casilla);
    setSeleccion(null);
  };

  const casillaEn = (x, y) => {
    const r = tablero.current?.getBoundingClientRect();
    if (!r) return null;
    const col = Math.floor(((x - r.left) / r.width) * n);
    const fila = Math.floor(((y - r.top) / r.height) * n);
    if (col < 0 || fila < 0 || col >= n || fila >= n) return null;
    return fila * n + col;
  };

  const alBajar = (e, casilla) => {
    if (resuelto || (e.pointerType === "mouse" && e.button !== 0)) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setArrastre({ casilla, id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, movido: false, destino: null });
  };

  const alMover = (e) => {
    if (!arrastre || e.pointerId !== arrastre.id) return;
    const dx = e.clientX - arrastre.x0;
    const dy = e.clientY - arrastre.y0;
    const movido = arrastre.movido || Math.hypot(dx, dy) > UMBRAL_ARRASTRE;
    setArrastre({ ...arrastre, dx, dy, movido, destino: movido ? casillaEn(e.clientX, e.clientY) : null });
  };

  const alSoltar = (e) => {
    if (!arrastre || e.pointerId !== arrastre.id) return;
    const a = arrastre;
    setArrastre(null);
    if (a.movido) {
      intercambiar(a.casilla, casillaEn(e.clientX, e.clientY));
      setSeleccion(null);
    } else {
      tocar(a.casilla);
    }
  };

  if (resuelto) {
    return (
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="hist-marco-cinta relative p-2 sm:p-3"
          style={{ width: ancho }}
          initial={{ scale: 0.92, rotate: -2, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 16 }}
        >
          <div className="relative w-full" style={{ aspectRatio: proporcion }}>
            {conFoto ? (
              <img src={foto.optimo} alt={foto.alt} className="h-full w-full object-cover" draggable="false" />
            ) : (
              <Reemplazo ruta={foto.src} aviso={textosHistoria.fotoNoEncontrada} />
            )}
            <EsquinasFoto />
          </div>
        </motion.div>
        <MensajeFinal titulo={dedicatoria?.titulo} texto={dedicatoria?.texto}>
          <p className="w-full text-sm text-[var(--lib-tinta-suave)]">{rellenar(t.movimientos, { n: movimientos })}</p>
          <button type="button" className="jue-boton" onClick={onReiniciar}>
            {textosJuegos.jugarOtraVez}
          </button>
          {onCambiarTamano ? (
            <button type="button" className="jue-boton-sec" onClick={onCambiarTamano}>
              {t.cambiarTamano}
            </button>
          ) : null}
        </MensajeFinal>
        <Celebracion disparo={1} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <p className="lib-mano mb-3 max-w-md text-center text-xl text-[var(--lib-tinta-suave)]">{t.ayuda}</p>
      <Marcadores>
        <Marcador>{rellenar(t.movimientos, { n: movimientos })}</Marcador>
        {conFoto ? (
          <button type="button" className="jue-chip px-3 py-1" onClick={() => setVerModelo((v) => !v)} aria-pressed={verModelo}>
            {verModelo ? t.ocultarModelo : t.verModelo}
          </button>
        ) : null}
        <button type="button" className="jue-chip px-3 py-1" onClick={onReiniciar}>
          {t.mezclar}
        </button>
        {onCambiarTamano ? (
          <button type="button" className="jue-chip px-3 py-1" onClick={onCambiarTamano}>
            {t.cambiarTamano}
          </button>
        ) : null}
      </Marcadores>

      {imagen.estado === "error" ? (
        <div className="mb-4 h-24 w-full max-w-xs">
          <Reemplazo ruta={foto.src} aviso={textosHistoria.fotoNoEncontrada} />
        </div>
      ) : null}

      <AnimatePresence>
        {verModelo && conFoto ? (
          <motion.img
            src={foto.optimo}
            alt={foto.alt}
            draggable="false"
            className="mb-4 w-32 rounded-sm shadow-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          />
        ) : null}
      </AnimatePresence>

      <div
        ref={tablero}
        className="jue-puzzle grid touch-none select-none"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, aspectRatio: proporcion, width: ancho }}
      >
        {imagen.estado === "cargando" ? (
          <div className="absolute inset-0 animate-pulse bg-[var(--lib-papel-alterno)]" />
        ) : null}
        {orden.map((pieza, casilla) => {
          const fila = Math.floor(pieza / n);
          const col = pieza % n;
          const movida = arrastre?.casilla === casilla && arrastre.movido;
          const clases = [
            "jue-pieza",
            seleccion === casilla ? "jue-pieza-elegida" : "",
            movida ? "jue-pieza-arrastrada" : "",
            arrastre?.destino === casilla && !movida ? "jue-pieza-destino" : "",
            conFoto ? "" : "lib-marcador hist-reemplazo",
          ].join(" ");
          const fondo = conFoto
            ? {
                backgroundImage: `url("${foto.optimo}")`,
                backgroundSize: `${n * 100}% ${n * 100}%`,
                backgroundPosition: `${(col / (n - 1)) * 100}% ${(fila / (n - 1)) * 100}%`,
              }
            : null;
          return (
            <button
              key={pieza}
              type="button"
              aria-label={rellenar(t.pieza, { n: pieza + 1 })}
              aria-pressed={seleccion === casilla}
              className={clases}
              style={{
                ...fondo,
                transform: movida ? `translate(${arrastre.dx}px, ${arrastre.dy}px) scale(1.06)` : undefined,
              }}
              onPointerDown={(e) => alBajar(e, casilla)}
              onPointerMove={alMover}
              onPointerUp={alSoltar}
              onPointerCancel={() => setArrastre(null)}
              onClick={(e) => {
                // Solo teclado (Enter/Espacio): el dedo y el mouse ya se manejan arriba.
                if (e.detail === 0) tocar(casilla);
              }}
            >
              {conFoto ? null : (
                <span className="lib-titulo text-xl font-bold text-[var(--lib-tapa)] sm:text-2xl">{pieza + 1}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
