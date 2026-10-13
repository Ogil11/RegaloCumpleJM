import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import pareja from "../content/pareja.json";
import VolverInicio from "../components/comun/VolverInicio";
import { rellenar } from "../components/comun/textosHistoria";
import { Filigrana } from "../components/libro/Adornos";
import { listaJuegos, textosJuegos as t } from "../components/juegos/datosJuegos";
import { ContextoSonido, useSonidosJuegos } from "../components/juegos/sonidos";
import IconoJuego from "../components/juegos/IconoJuego";
import { SinContenido } from "../components/juegos/PiezasJuego";
import Memorama from "../components/juegos/Memorama";
import Quiz from "../components/juegos/Quiz";
import Rompecabezas from "../components/juegos/Rompecabezas";
import Ruleta from "../components/juegos/Ruleta";
import Cartas from "../components/juegos/Cartas";
import Frases from "../components/juegos/Frases";

// Titulos de la pagina: pareja.json -> secciones.juegos. Juegos: src/content/juegos.json.
const textos = pareja.secciones?.juegos ?? {};

/** "tipo" de juegos.json -> componente. trivia y memoria son nombres antiguos. */
const TIPOS = {
  memorama: Memorama,
  memoria: Memorama,
  quiz: Quiz,
  trivia: Quiz,
  rompecabezas: Rompecabezas,
  ruleta: Ruleta,
  cartas: Cartas,
  frases: Frases,
};

const contenedor = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const elemento = {
  oculto: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Juegos() {
  const sonido = useSonidosJuegos();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // El juego abierto va en la URL (/juegos?juego=quiz): el boton Atras del celular vuelve al menu.
  const idAbierto = params.get("juego");
  const juego = listaJuegos.find((j) => String(j.id) === idAbierto) ?? null;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [idAbierto]);

  const abrir = (j) => setParams({ juego: String(j.id) }, { state: { desdeMenu: true } });
  const volverMenu = () => {
    if (location.state?.desdeMenu) navigate(-1);
    else setParams({}, { replace: true });
  };

  return (
    <ContextoSonido.Provider value={sonido}>
      <div className="overflow-x-clip">
        <VolverInicio />
        <BotonSonido silenciado={sonido.silenciado} onAlternar={sonido.alternarSilencio} />

        <AnimatePresence mode="wait">
          {juego ? (
            <VistaJuego key={`juego-${juego.id}`} juego={juego} onVolver={volverMenu} />
          ) : (
            <Menu key="menu" onAbrir={abrir} />
          )}
        </AnimatePresence>
      </div>
    </ContextoSonido.Provider>
  );
}

function Menu({ onAbrir }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
      <motion.header
        className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-8 pt-20 text-center md:pt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="font-romantica text-4xl text-[var(--lib-tinta)] sm:text-5xl">{textos.titulo}</h1>
        <Filigrana className="mt-3 h-3 w-36" />
        {textos.subtitulo ? (
          <p className="lib-cuerpo mt-3 max-w-xl text-balance text-[var(--lib-tinta-suave)]">{textos.subtitulo}</p>
        ) : null}
      </motion.header>

      <main className="mx-auto max-w-5xl px-4 pb-24">
        {listaJuegos.length ? (
          <motion.nav
            aria-label={t.menu}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
            variants={contenedor}
            initial="oculto"
            animate="visible"
          >
            {listaJuegos.map((j, i) => (
              <motion.button
                key={j.id ?? i}
                type="button"
                onClick={() => onAbrir(j)}
                variants={elemento}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.97 }}
                className="jue-tarjeta jue-tarjeta-menu group flex items-center gap-4 p-4 text-left sm:flex-col sm:items-center sm:p-6 sm:text-center"
              >
                <span className="jue-icono flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16">
                  <IconoJuego icono={j.icono} tipo={j.tipo} className="h-7 w-7 sm:h-8 sm:w-8" />
                </span>
                <span className="min-w-0">
                  <span className="font-romantica block text-xl text-[var(--lib-tinta)] sm:text-2xl">{j.titulo}</span>
                  {j.descripcion ? (
                    <span className="lib-cuerpo mt-1 block text-sm text-[var(--lib-tinta-suave)]">{j.descripcion}</span>
                  ) : null}
                </span>
              </motion.button>
            ))}
          </motion.nav>
        ) : (
          <SinContenido texto={t.sinJuegos} />
        )}
      </main>
    </motion.div>
  );
}

function VistaJuego({ juego, onVolver }) {
  const Componente = TIPOS[juego.tipo];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <header className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-6 pt-16 text-center md:pt-20">
        <button type="button" onClick={onVolver} className="jue-chip mb-4 flex items-center gap-1.5 px-3 py-1.5 text-sm">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t.volverMenu}
        </button>
        <span className="jue-icono mb-2 flex h-12 w-12 items-center justify-center rounded-full">
          <IconoJuego icono={juego.icono} tipo={juego.tipo} className="h-6 w-6" />
        </span>
        <h1 className="font-romantica text-3xl text-[var(--lib-tinta)] sm:text-4xl">{juego.titulo}</h1>
        <Filigrana className="mt-2 h-3 w-32" />
      </header>
      <main className="mx-auto max-w-4xl px-4 pb-24">
        {Componente ? <Componente juego={juego} /> : <SinContenido texto={rellenar(t.tipoDesconocido, { tipo: juego.tipo })} />}
      </main>
    </motion.div>
  );
}

function BotonSonido({ silenciado, onAlternar }) {
  const etiqueta = silenciado ? t.activarSonidos : t.silenciarSonidos;
  return (
    <button
      type="button"
      onClick={onAlternar}
      aria-pressed={silenciado}
      aria-label={etiqueta}
      title={etiqueta}
      className="fixed right-[4rem] top-3 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--lib-dorado)]/40 bg-[var(--lib-papel)]/85 text-[var(--lib-tinta)] shadow-sm backdrop-blur-sm transition hover:bg-[var(--lib-papel)]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h3l5-4v14l-5-4H4z" />
        {silenciado ? <path d="m16 9 5 6m0-6-5 6" /> : <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" />}
      </svg>
    </button>
  );
}
