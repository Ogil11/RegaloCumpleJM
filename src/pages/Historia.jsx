import { motion } from "framer-motion";
import pareja from "../content/pareja.json";
import VolverInicio from "../components/comun/VolverInicio";
import BarraSecciones from "../components/comun/BarraSecciones";
import { textosHistoria as t } from "../components/comun/textosHistoria";
import { Filigrana } from "../components/libro/Adornos";
import ContadorPareja from "../components/timeline/ContadorPareja";
import LineaTiempo from "../components/timeline/LineaTiempo";
import Collage from "../components/collage/Collage";

// Titulos de la pagina: pareja.json -> secciones.historia. Botones: textosInterfaz.historia.
const textos = pareja.secciones?.historia ?? {};

const SECCIONES = [
  { id: "linea-tiempo", etiqueta: t.chipLineaTiempo },
  { id: "collage", etiqueta: t.chipCollage },
];

export default function Historia() {
  return (
    <div className="overflow-x-clip">
      <VolverInicio />

      <motion.header
        className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-6 pt-20 text-center md:pt-24"
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

      <BarraSecciones secciones={SECCIONES} etiqueta={t.navegacion} />

      <main className="mx-auto max-w-5xl px-4 pb-24">
        <section id="linea-tiempo" aria-labelledby="titulo-linea-tiempo" className="hist-seccion pt-12">
          <TituloSeccion id="titulo-linea-tiempo" titulo={textos.tituloLineaTiempo} />
          <ContadorPareja />
          <LineaTiempo />
        </section>

        <section id="collage" aria-labelledby="titulo-collage" className="hist-seccion pt-16">
          <TituloSeccion id="titulo-collage" titulo={textos.tituloCollage} subtitulo={textos.subtituloCollage} />
          <Collage />
        </section>
      </main>
    </div>
  );
}

function TituloSeccion({ id, titulo, subtitulo }) {
  return (
    <div className="mb-8 text-center">
      <h2 id={id} className="font-romantica text-3xl text-[var(--lib-tinta)] sm:text-4xl">
        {titulo}
      </h2>
      {subtitulo ? <p className="lib-mano mt-1 text-xl text-[var(--lib-tinta-suave)]">{subtitulo}</p> : null}
    </div>
  );
}
