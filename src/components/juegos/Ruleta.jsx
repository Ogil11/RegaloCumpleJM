import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Celebracion from "./Celebracion";
import { textosJuegos } from "./datosJuegos";
import { SinContenido } from "./PiezasJuego";
import { useSonido } from "./sonidos";

const t = textosJuegos.ruleta ?? {};
const VUELTAS = 5;
const DURACION = 4.2;

// Colores de tema.js por categoria: [fuerte, suave] para alternar gajos vecinos.
const COLORES = {
  cita: ["var(--lib-rosa)", "var(--lib-rosa-claro)"],
  reto: ["var(--lib-dorado)", "var(--lib-dorado-claro)"],
  pregunta: ["var(--lib-salvia)", "color-mix(in srgb, var(--lib-salvia) 45%, var(--lib-papel))"],
};
const OTROS = ["var(--lib-tapa-clara)", "var(--lib-papel-alterno)"];

function colorGajo(tipo, i) {
  const par = COLORES[tipo] ?? OTROS;
  return par[i % 2];
}

/** Camino SVG de un gajo de la rueda (angulos en grados, 0 = arriba, sentido horario). */
function gajo(desde, hasta, r = 96) {
  const punto = (g) => {
    const rad = ((g - 90) * Math.PI) / 180;
    return `${(r * Math.cos(rad)).toFixed(2)} ${(r * Math.sin(rad)).toFixed(2)}`;
  };
  const grande = hasta - desde > 180 ? 1 : 0;
  return `M0 0 L${punto(desde)} A${r} ${r} 0 ${grande} 1 ${punto(hasta)} Z`;
}

/**
 * Ruleta de citas, retos y preguntas (juegos.json -> opciones).
 * Gira con animacion y muestra lo que salio.
 */
export default function Ruleta({ juego }) {
  const opciones = (juego.opciones ?? []).filter((o) => o?.texto);
  if (!opciones.length) return <SinContenido />;
  return <Rueda juego={juego} opciones={opciones} />;
}

function Rueda({ juego, opciones }) {
  const { reproducir } = useSonido();
  const reducir = useReducedMotion();
  const [rotacion, setRotacion] = useState(0);
  const [girando, setGirando] = useState(false);
  const [elegida, setElegida] = useState(null);
  const [mostrar, setMostrar] = useState(false);
  const [fiesta, setFiesta] = useState(0);

  const total = opciones.length;
  const paso = 360 / total;
  const etiquetas = juego.categorias ?? {};
  const tamanoLetra = Math.max(7, Math.min(13, 110 / total));

  const girar = () => {
    if (girando) return;
    // No repite la ultima si hay mas de una opcion.
    let indice = Math.floor(Math.random() * total);
    if (total > 1 && indice === elegida) indice = (indice + 1 + Math.floor(Math.random() * (total - 1))) % total;
    const centro = (indice + 0.5) * paso;
    const variacion = (Math.random() - 0.5) * paso * 0.6;
    const base = rotacion - (rotacion % 360);
    setRotacion(base + 360 * VUELTAS + (360 - centro) + variacion);
    setElegida(indice);
    setMostrar(false);
    setGirando(true);
    reproducir("ruleta");
  };

  const alTerminar = () => {
    setGirando(false);
    setMostrar(true);
    setFiesta((f) => f + 1);
    reproducir("acierto");
  };

  const resultado = elegida !== null ? opciones[elegida] : null;

  return (
    <div className="flex flex-col items-center">
      <p className="lib-mano mb-4 text-center text-xl text-[var(--lib-tinta-suave)]">{t.ayuda}</p>

      <div className="relative w-[min(86vw,380px)]">
        {/* Flecha que marca el gajo ganador */}
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="absolute left-1/2 top-[-14px] z-10 h-9 w-9 -translate-x-1/2 drop-shadow-md"
        >
          <path d="M12 22 4 6a8.5 8.5 0 0 1 16 0z" fill="var(--lib-tapa)" stroke="var(--lib-texto-tapa)" strokeWidth="1.5" />
        </svg>

        <motion.svg
          viewBox="-100 -100 200 200"
          className="jue-ruleta block w-full"
          animate={{ rotate: rotacion }}
          transition={{ duration: reducir ? 0.6 : DURACION, ease: [0.15, 0.7, 0.1, 1] }}
          onAnimationComplete={() => {
            if (girando) alTerminar();
          }}
          role="img"
          aria-label={juego.titulo}
        >
          <circle r="99" fill="var(--lib-tapa)" />
          {opciones.map((o, i) => {
            const desde = i * paso;
            const medio = desde + paso / 2;
            const texto = etiquetas[o.tipo] ?? o.tipo ?? "";
            return (
              <g key={i}>
                {total === 1 ? (
                  <circle r="96" fill={colorGajo(o.tipo, i)} />
                ) : (
                  <path d={gajo(desde, desde + paso)} fill={colorGajo(o.tipo, i)} stroke="var(--lib-papel)" strokeWidth="1" />
                )}
                {/* En la mitad izquierda el texto se gira 180° para que no quede de cabeza. */}
                <g transform={`rotate(${medio - 90}) ${medio > 180 ? "translate(116 0) rotate(180)" : ""}`}>
                  <text
                    x="58"
                    y="0"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={tamanoLetra}
                    className="lib-titulo"
                    fontWeight="700"
                    fill="var(--lib-tinta)"
                  >
                    {texto}
                  </text>
                </g>
              </g>
            );
          })}
          <circle r="16" fill="var(--lib-papel)" stroke="var(--lib-dorado)" strokeWidth="3" />
          <path
            d="M0 7s-6-3.7-7.5-7.2C-8.7-3.1-7.2-6-4.5-6.5-2.8-6.9-1-6 0-4.6 1-6 2.8-6.9 4.5-6.5 7.2-6 8.7-3.1 7.5-.2 6 3.3 0 7 0 7z"
            fill="var(--lib-rosa)"
          />
        </motion.svg>
      </div>

      <motion.button
        type="button"
        className="jue-boton mt-6 min-w-40"
        onClick={girar}
        disabled={girando}
        whileTap={{ scale: 0.95 }}
      >
        {girando ? t.girando : resultado ? t.otraVez : t.girar}
      </motion.button>

      <div className="mt-6 min-h-40 w-full" aria-live="polite">
        <AnimatePresence mode="wait">
          {mostrar && resultado ? (
            <motion.div
              key={`${elegida}-${fiesta}`}
              className="jue-tarjeta mx-auto max-w-md px-6 py-5 text-center"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-sm text-[var(--lib-tinta-suave)]">{t.resultado}</p>
              <span
                className="lib-titulo mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-[var(--lib-tinta)]"
                style={{ backgroundColor: colorGajo(resultado.tipo, 1) }}
              >
                {etiquetas[resultado.tipo] ?? resultado.tipo}
              </span>
              <p className="font-romantica mt-3 text-2xl text-[var(--lib-tinta)]">{resultado.texto}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <Celebracion disparo={fiesta} />
    </div>
  );
}
