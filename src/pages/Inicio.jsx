import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import pareja from "../content/pareja.json";
import Imagen from "../components/comun/Imagen";
import CorazonNuestro from "../components/comun/CorazonNuestro";
import { precargar, precargarTodasLuego } from "../rutas";

// Todo lo visible sale de pareja.json: nombre, frase, foto y las tarjetas (secciones.tarjetas).
const tarjetas = pareja.secciones?.tarjetas ?? [];

const contenedor = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const elemento = {
  oculto: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Inicio() {
  // Si la foto no existe se oculta, en vez de mostrar una imagen rota.
  const [fotoRota, setFotoRota] = useState(false);
  const mostrarFoto = Boolean(pareja.fotoPortada) && !fotoRota;

  // Con el Inicio ya en pantalla, se bajan las otras secciones sin prisa.
  useEffect(() => precargarTodasLuego(), []);

  return (
    <motion.main
      className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 px-4 py-16"
      variants={contenedor}
      initial="oculto"
      animate="visible"
    >
      <motion.header className="flex flex-col items-center text-center" variants={elemento}>
        {mostrarFoto ? (
          <Imagen
            src={pareja.fotoPortada}
            sizes="160px"
            width="160"
            height="160"
            decoding="async"
            alt={pareja.fotoPortadaAlt || ""}
            onError={() => setFotoRota(true)}
            className="mb-6 h-32 w-32 rounded-full object-cover shadow-md ring-4 ring-white/80 sm:h-40 sm:w-40"
          />
        ) : null}
        <h1 className="font-romantica text-4xl text-rose-900 sm:text-5xl">
          {pareja.nombre}
        </h1>
        <p className="mt-4 max-w-xl text-balance text-rose-700/80">
          {pareja.frase}
        </p>
        <CorazonNuestro className="cargando-latido mt-5 h-10 w-10" />
      </motion.header>

      <motion.nav
        className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3"
        variants={contenedor}
      >
        {tarjetas.map((tarjeta) => (
          <motion.div key={tarjeta.ruta} variants={elemento}>
            <Link
              to={tarjeta.ruta}
              onPointerEnter={() => precargar(tarjeta.ruta)}
              onFocus={() => precargar(tarjeta.ruta)}
              className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl bg-white/80 p-6 text-center text-rose-900 shadow-sm ring-1 ring-rose-100 transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="font-romantica text-xl font-medium">{tarjeta.titulo}</span>
              {tarjeta.descripcion ? (
                <span className="text-sm text-rose-700/75">{tarjeta.descripcion}</span>
              ) : null}
            </Link>
          </motion.div>
        ))}
      </motion.nav>
    </motion.main>
  );
}
