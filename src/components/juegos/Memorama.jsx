import { useEffect, useRef, useState } from "react";
import { normalizarFoto, rellenar } from "../comun/textosHistoria";
import Celebracion from "./Celebracion";
import { barajar, textosJuegos } from "./datosJuegos";
import { FotoJuego, Marcador, Marcadores, MensajeFinal, SinContenido } from "./PiezasJuego";
import { useSonido } from "./sonidos";

const t = textosJuegos.memorama ?? {};
// Tiempo que se ven dos cartas distintas antes de voltearse otra vez.
const ESPERA_FALLO = 900;

/**
 * Memorama: cada foto de juegos.json -> fotos sale dos veces.
 * Voltea dos cartas; si son la misma foto se quedan boca arriba.
 */
export default function Memorama({ juego }) {
  const fotos = (juego.fotos ?? []).map((f) => normalizarFoto(f)).filter(Boolean);
  const [partida, setPartida] = useState(1);
  if (!fotos.length) return <SinContenido />;
  return <Tablero key={partida} juego={juego} fotos={fotos} onReiniciar={() => setPartida((p) => p + 1)} />;
}

function columnas(total) {
  if (total <= 12 && total % 3 === 0) return { celular: 3, ancha: total <= 6 ? 3 : 4 };
  if (total <= 16) return { celular: 4, ancha: 4 };
  return { celular: 4, ancha: total <= 20 ? 5 : 6 };
}

function Tablero({ juego, fotos, onReiniciar }) {
  const { reproducir } = useSonido();
  const [cartas] = useState(() =>
    barajar(fotos.flatMap((foto, par) => [0, 1].map((copia) => ({ id: `${par}-${copia}`, par, foto }))))
  );
  const [volteadas, setVolteadas] = useState([]);
  const [encontradas, setEncontradas] = useState(() => new Set());
  const [intentos, setIntentos] = useState(0);
  const temporizador = useRef(null);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const gano = encontradas.size === fotos.length;
  const cols = columnas(cartas.length);

  const voltear = (indice) => {
    const carta = cartas[indice];
    if (volteadas.length === 2 || volteadas.includes(indice) || encontradas.has(carta.par)) return;
    reproducir("voltear");
    const nuevas = [...volteadas, indice];
    setVolteadas(nuevas);
    if (nuevas.length < 2) return;

    setIntentos((n) => n + 1);
    const otra = cartas[nuevas[0]];
    if (otra.par === carta.par) {
      const halladas = new Set(encontradas).add(carta.par);
      setEncontradas(halladas);
      setVolteadas([]);
      reproducir(halladas.size === fotos.length ? "victoria" : "acierto");
    } else {
      temporizador.current = setTimeout(() => {
        setVolteadas([]);
        reproducir("error");
      }, ESPERA_FALLO);
    }
  };

  return (
    <div>
      {juego.instrucciones ? (
        <p className="lib-mano mb-3 text-center text-xl text-[var(--lib-tinta-suave)]">{juego.instrucciones}</p>
      ) : null}
      <Marcadores>
        <Marcador>{rellenar(t.intentos, { n: intentos })}</Marcador>
        <Marcador>{rellenar(t.parejas, { n: encontradas.size, total: fotos.length })}</Marcador>
      </Marcadores>

      <div
        className="mx-auto grid max-w-xl grid-cols-[repeat(var(--cols-celular),minmax(0,1fr))] gap-2 sm:grid-cols-[repeat(var(--cols-ancha),minmax(0,1fr))] sm:gap-3"
        style={{ "--cols-celular": cols.celular, "--cols-ancha": cols.ancha }}
      >
        {cartas.map((carta, i) => {
          const hallada = encontradas.has(carta.par);
          const boca = hallada || volteadas.includes(i);
          const etiqueta = boca
            ? rellenar(t.cartaVolteada, { n: i + 1, alt: carta.foto.alt || carta.par + 1 })
            : rellenar(t.carta, { n: i + 1 });
          return (
            <button
              key={carta.id}
              type="button"
              onClick={() => voltear(i)}
              aria-label={etiqueta}
              aria-pressed={boca}
              disabled={hallada}
              className={`jue-carta aspect-[3/4] w-full ${boca ? "jue-carta-boca" : ""} ${hallada ? "jue-carta-hallada" : ""}`}
            >
              <span className="jue-carta-giro">
                <span className="jue-carta-cara jue-carta-dorso" aria-hidden="true" />
                <span className="jue-carta-cara jue-carta-frente">
                  <FotoJuego src={carta.foto.src} alt="" etiqueta={carta.par + 1} />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {gano ? (
        <div className="mt-8">
          <MensajeFinal titulo={juego.victoria?.titulo} texto={juego.victoria?.texto}>
            <p className="w-full text-sm text-[var(--lib-tinta-suave)]">{rellenar(t.resumen, { n: intentos })}</p>
            <button type="button" className="jue-boton" onClick={onReiniciar}>
              {textosJuegos.jugarOtraVez}
            </button>
          </MensajeFinal>
        </div>
      ) : null}
      <Celebracion disparo={gano ? 1 : 0} />
    </div>
  );
}
