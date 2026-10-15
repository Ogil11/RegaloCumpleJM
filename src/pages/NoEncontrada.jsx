import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import pareja from "../content/pareja.json";
import { Filigrana } from "../components/libro/Adornos";
import CorazonNuestro from "../components/comun/CorazonNuestro";

// Textos: pareja.json -> textosInterfaz.noEncontrada.
const textos = pareja.textosInterfaz?.noEncontrada ?? {};

/** Cualquier direccion que no existe. */
export default function NoEncontrada() {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.12, 1, 1.08, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
      >
        <CorazonNuestro className="h-20 w-20" />
      </motion.div>
      <h1 className="font-romantica mt-6 text-balance text-4xl text-[var(--lib-tinta)] sm:text-5xl">{textos.titulo}</h1>
      <Filigrana className="mt-4 h-3 w-36" />
      {textos.texto ? (
        <p className="lib-cuerpo mt-4 text-balance text-lg text-[var(--lib-tinta-suave)]">{textos.texto}</p>
      ) : null}
      <Link to="/" className="jue-boton mt-10">
        {textos.boton}
      </Link>
    </main>
  );
}
