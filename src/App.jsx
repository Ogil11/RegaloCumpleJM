import { Suspense, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Inicio from "./pages/Inicio";
import { Historia, Juegos, Libro, NoEncontrada } from "./rutas";
import Entrada, { entradaYaVista } from "./components/comun/Entrada";
import Cargando from "./components/comun/Cargando";
import MusicaFondo from "./components/comun/MusicaFondo";

export default function App() {
  const [dentro, setDentro] = useState(entradaYaVista);

  return (
    // reducedMotion="user": si el sistema pide menos movimiento, framer-motion
    // quita desplazamientos y escalas y deja solo los fundidos.
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {dentro ? (
          <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Rutas />
          </motion.div>
        ) : (
          <Entrada key="entrada" onEntrar={() => setDentro(true)} />
        )}
      </AnimatePresence>
      {dentro ? <MusicaFondo /> : null}
    </MotionConfig>
  );
}

/**
 * Las 4 pantallas con un fundido al cambiar de una a otra.
 * Solo opacidad a proposito: un transform en este contenedor haria que
 * los botones fijos (Volver al inicio, musica) se movieran con la pagina.
 */
function Rutas() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Suspense fallback={<Cargando />}>
          <Routes location={location}>
            <Route path="/" element={<Inicio />} />
            <Route path="/juegos" element={<Juegos />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/libro" element={<Libro />} />
            {/* Cualquier otra direccion: pagina romantica de "no existe". */}
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}
