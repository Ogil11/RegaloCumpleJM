import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { rellenar } from "../comun/textosHistoria";
import Celebracion from "./Celebracion";
import { barajar, textosJuegos } from "./datosJuegos";
import { Marcador, Marcadores, MensajeFinal, SinContenido } from "./PiezasJuego";
import { useSonido } from "./sonidos";

const t = textosJuegos.frases ?? {};

/** Para comparar palabras sin importar mayusculas, tildes ni signos. */
function limpiar(palabra = "") {
  return palabra
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function palabrasDe(frase = "") {
  return frase.trim().split(/\s+/).filter(Boolean);
}

/** Posiciones de la frase que quedan en blanco en el modo "completar". */
function posicionesHuecos(palabras, huecos = []) {
  const usadas = new Set();
  for (const hueco of huecos) {
    const i = palabras.findIndex((p, j) => !usadas.has(j) && limpiar(p) === limpiar(hueco));
    if (i >= 0) usadas.add(i);
  }
  return [...usadas].sort((a, b) => a - b);
}

/** Banco de fichas en desorden. Si quedan en el orden correcto, lo vuelve a intentar. */
function fichasDesordenadas(textos) {
  const fichas = textos.map((texto, id) => ({ id, texto }));
  let mezcla = barajar(fichas);
  for (let intento = 0; intento < 5 && fichas.length > 1 && mezcla.every((f, i) => f.id === i); intento++) {
    mezcla = barajar(fichas);
  }
  return mezcla;
}

/**
 * Frases del amor: en cada frase de juegos.json hay que ordenar las
 * palabras ("ordenar") o tocar las que faltan ("completar").
 */
export default function Frases({ juego }) {
  const frases = (juego.frases ?? []).filter((f) => palabrasDe(f?.frase).length > 0);
  const [partida, setPartida] = useState(1);
  if (!frases.length) return <SinContenido />;
  return <Partida key={partida} juego={juego} frases={frases} onReiniciar={() => setPartida((p) => p + 1)} />;
}

function Partida({ juego, frases, onReiniciar }) {
  const { reproducir } = useSonido();
  const [indice, setIndice] = useState(0);
  const [resuelta, setResuelta] = useState(false);
  const [terminado, setTerminado] = useState(false);
  const total = frases.length;
  const frase = frases[indice];

  const alResolver = () => {
    setResuelta(true);
    reproducir(indice + 1 >= total ? "victoria" : "acierto");
  };

  const seguir = () => {
    if (indice + 1 >= total) {
      setTerminado(true);
      return;
    }
    setIndice((i) => i + 1);
    setResuelta(false);
  };

  if (terminado) {
    return (
      <>
        <MensajeFinal titulo={juego.victoria?.titulo} texto={juego.victoria?.texto}>
          <button type="button" className="jue-boton" onClick={onReiniciar}>
            {textosJuegos.jugarOtraVez}
          </button>
        </MensajeFinal>
        <Celebracion disparo={1} />
      </>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Marcadores>
        <Marcador>{rellenar(t.progreso, { actual: indice + 1, total })}</Marcador>
      </Marcadores>
      <AnimatePresence mode="wait">
        <motion.div
          key={indice}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Frase frase={frase} resuelta={resuelta} onResolver={alResolver} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {resuelta ? (
          <motion.div className="mt-5 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {frase.mensaje ? (
              <p role="status" className="lib-mano text-2xl text-[var(--lib-tinta)]">
                {frase.mensaje}
              </p>
            ) : null}
            <button type="button" className="jue-boton mt-4" onClick={seguir}>
              {indice + 1 >= total ? t.terminar : t.siguiente}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <Celebracion disparo={resuelta ? indice + 1 : 0} />
    </div>
  );
}

function Frase({ frase, resuelta, onResolver }) {
  const palabras = palabrasDe(frase.frase);
  const huecos = frase.modo === "completar" ? posicionesHuecos(palabras, frase.huecos) : [];
  // Si "completar" no encuentra sus huecos en la frase, se juega como "ordenar".
  const Juego = huecos.length ? Completar : Ordenar;
  const [verPista, setVerPista] = useState(false);

  return (
    <div className="jue-tarjeta px-4 py-6 sm:px-7">
      <p className="lib-mano mb-4 text-center text-xl text-[var(--lib-tinta-suave)]">
        {huecos.length ? t.ayudaCompletar : t.ayudaOrdenar}
      </p>
      <Juego palabras={palabras} huecos={huecos} distractores={frase.distractores} resuelta={resuelta} onResolver={onResolver} />
      {frase.pista && !resuelta ? (
        <div className="mt-4 text-center">
          {verPista ? (
            <motion.p
              className="lib-cuerpo text-sm italic text-[var(--lib-tinta-suave)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {frase.pista}
            </motion.p>
          ) : (
            <button type="button" className="jue-chip px-3 py-1 text-sm" onClick={() => setVerPista(true)}>
              {t.verPista}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

/** Aviso de "casi" con una pequeña sacudida. */
function AvisoCasi({ visible }) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.p
          role="status"
          className="mt-3 text-center text-sm font-medium text-[var(--lib-tapa)]"
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: [0, -6, 6, -3, 3, 0] }}
          exit={{ opacity: 0 }}
        >
          {t.casi}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

function Ficha({ id, texto, onClick, disabled, variante = "" }) {
  return (
    <motion.button
      layout
      layoutId={`ficha-${id}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`jue-ficha ${variante}`}
      whileTap={disabled ? undefined : { scale: 0.92 }}
    >
      {texto}
    </motion.button>
  );
}

function Ordenar({ palabras, resuelta, onResolver }) {
  const { reproducir } = useSonido();
  const [banco] = useState(() => fichasDesordenadas(palabras));
  const [respuesta, setRespuesta] = useState([]);
  const [casi, setCasi] = useState(false);

  const poner = (ficha) => {
    const nueva = [...respuesta, ficha];
    setRespuesta(nueva);
    reproducir("voltear");
    if (nueva.length < palabras.length) return;
    const bien = nueva.every((f, i) => limpiar(f.texto) === limpiar(palabras[i]));
    setCasi(!bien);
    if (bien) onResolver();
    else reproducir("error");
  };

  const quitar = (ficha) => {
    setRespuesta((r) => r.filter((f) => f.id !== ficha.id));
    setCasi(false);
  };

  const usadas = new Set(respuesta.map((f) => f.id));

  return (
    <LayoutGroup>
      <div className={`jue-renglon ${resuelta ? "jue-renglon-bien" : ""}`}>
        {respuesta.map((f) => (
          <Ficha key={f.id} id={f.id} texto={f.texto} onClick={() => quitar(f)} disabled={resuelta} variante="jue-ficha-puesta" />
        ))}
      </div>
      <AvisoCasi visible={casi} />
      {!resuelta ? (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {banco
            .filter((f) => !usadas.has(f.id))
            .map((f) => (
              <Ficha key={f.id} id={f.id} texto={f.texto} onClick={() => poner(f)} />
            ))}
        </div>
      ) : null}
    </LayoutGroup>
  );
}

function Completar({ palabras, huecos, distractores = [], resuelta, onResolver }) {
  const { reproducir } = useSonido();
  const [banco] = useState(() => fichasDesordenadas([...huecos.map((i) => palabras[i]), ...distractores]));
  // posicion de la frase -> ficha puesta en ese hueco
  const [puestas, setPuestas] = useState({});
  const [casi, setCasi] = useState(false);

  const poner = (ficha) => {
    const libre = huecos.find((i) => !puestas[i]);
    if (libre === undefined) return;
    const nuevas = { ...puestas, [libre]: ficha };
    setPuestas(nuevas);
    reproducir("voltear");
    if (huecos.some((i) => !nuevas[i])) return;
    const bien = huecos.every((i) => limpiar(nuevas[i].texto) === limpiar(palabras[i]));
    setCasi(!bien);
    if (bien) onResolver();
    else reproducir("error");
  };

  const quitar = (posicion) => {
    setPuestas(({ [posicion]: _quitada, ...resto }) => resto);
    setCasi(false);
  };

  const usadas = new Set(Object.values(puestas).map((f) => f.id));

  return (
    <LayoutGroup>
      <p className={`jue-renglon items-baseline ${resuelta ? "jue-renglon-bien" : ""}`}>
        {palabras.map((palabra, i) => {
          if (!huecos.includes(i)) {
            return (
              <span key={i} className="font-romantica px-0.5 text-2xl text-[var(--lib-tinta)]">
                {palabra}
              </span>
            );
          }
          const ficha = puestas[i];
          return ficha ? (
            <Ficha
              key={i}
              id={ficha.id}
              texto={ficha.texto}
              onClick={() => quitar(i)}
              disabled={resuelta}
              variante="jue-ficha-puesta"
            />
          ) : (
            <span key={i} className="jue-hueco" aria-hidden="true" />
          );
        })}
      </p>
      <AvisoCasi visible={casi} />
      {!resuelta ? (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {banco
            .filter((f) => !usadas.has(f.id))
            .map((f) => (
              <Ficha key={f.id} id={f.id} texto={f.texto} onClick={() => poner(f)} />
            ))}
        </div>
      ) : null}
    </LayoutGroup>
  );
}
