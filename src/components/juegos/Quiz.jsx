import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { rellenar } from "../comun/textosHistoria";
import Celebracion from "./Celebracion";
import { alAzar, textosJuegos } from "./datosJuegos";
import { Marcador, Marcadores, MensajeFinal, SinContenido } from "./PiezasJuego";
import { useSonido } from "./sonidos";

const t = textosJuegos.quiz ?? {};
// Desde este porcentaje de aciertos hay lluvia de corazones al final.
const PORCENTAJE_FIESTA = 50;

/** El resultado con el "desde" mas alto que no pase del porcentaje logrado. */
function elegirResultado(resultados = [], porcentaje) {
  const ordenados = [...resultados].sort((a, b) => (b.desde ?? 0) - (a.desde ?? 0));
  return ordenados.find((r) => porcentaje >= (r.desde ?? 0)) ?? ordenados.at(-1);
}

/**
 * ¿Cuánto me conoces?: preguntas de opcion multiple de juegos.json.
 * Cada respuesta trae su comentario y al final sale un mensaje segun el puntaje.
 */
export default function Quiz({ juego }) {
  const preguntas = (juego.preguntas ?? []).filter((p) => p?.pregunta && p.opciones?.length);
  const [partida, setPartida] = useState(1);
  if (!preguntas.length) return <SinContenido />;
  return <Partida key={partida} juego={juego} preguntas={preguntas} onReiniciar={() => setPartida((p) => p + 1)} />;
}

function Partida({ juego, preguntas, onReiniciar }) {
  const { reproducir } = useSonido();
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState(null);
  const [comentario, setComentario] = useState("");
  const [aciertos, setAciertos] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const total = preguntas.length;
  const pregunta = preguntas[indice];
  const correcta = Number(pregunta.respuestaCorrecta ?? 0);
  const respondida = elegida !== null;

  const responder = (opcion) => {
    if (respondida) return;
    const acerto = opcion === correcta;
    setElegida(opcion);
    if (acerto) setAciertos((n) => n + 1);
    setComentario(
      acerto
        ? pregunta.siAcierta || alAzar(juego.frasesAcierto) || t.correcta
        : pregunta.siFalla || alAzar(juego.frasesFallo) || t.incorrecta
    );
    reproducir(acerto ? "acierto" : "error");
  };

  const seguir = () => {
    if (indice + 1 >= total) {
      setTerminado(true);
      if ((aciertos / total) * 100 >= PORCENTAJE_FIESTA) reproducir("victoria");
      return;
    }
    setIndice((i) => i + 1);
    setElegida(null);
    setComentario("");
  };

  if (terminado) {
    const porcentaje = Math.round((aciertos / total) * 100);
    const resultado = elegirResultado(juego.resultados, porcentaje);
    return (
      <>
        <MensajeFinal titulo={resultado?.titulo} texto={resultado?.texto}>
          <p className="lib-titulo w-full text-3xl font-bold text-[var(--lib-tapa)]">
            {rellenar(t.puntaje, { aciertos, total })}
          </p>
          <button type="button" className="jue-boton" onClick={onReiniciar}>
            {textosJuegos.jugarOtraVez}
          </button>
        </MensajeFinal>
        <Celebracion disparo={porcentaje >= PORCENTAJE_FIESTA ? 1 : 0} />
      </>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Marcadores>
        <Marcador>{rellenar(t.progreso, { actual: indice + 1, total })}</Marcador>
      </Marcadores>
      <div className="jue-barra mb-5" aria-hidden="true">
        <motion.span
          className="jue-barra-relleno"
          initial={false}
          animate={{ width: `${((indice + (respondida ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={indice}
          className="jue-tarjeta px-5 py-6 sm:px-7"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-romantica text-center text-2xl text-[var(--lib-tinta)] sm:text-3xl">{pregunta.pregunta}</h3>

          <div className="mt-5 grid gap-3">
            {pregunta.opciones.map((opcion, i) => {
              let estado = "";
              if (respondida && i === correcta) estado = "jue-opcion-bien";
              else if (respondida && i === elegida) estado = "jue-opcion-mal";
              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => responder(i)}
                  disabled={respondida}
                  className={`jue-opcion ${estado}`}
                  whileTap={respondida ? undefined : { scale: 0.97 }}
                  animate={estado === "jue-opcion-mal" ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {opcion}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {respondida ? (
              <motion.div
                className="mt-5 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p role="status" className="lib-mano text-2xl text-[var(--lib-tinta)]">
                  {comentario}
                </p>
                <button type="button" className="jue-boton mt-4" onClick={seguir}>
                  {indice + 1 >= total ? t.verResultado : t.siguiente}
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
