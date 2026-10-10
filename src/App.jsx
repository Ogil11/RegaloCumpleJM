import { Navigate, Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Juegos from "./pages/Juegos";
import Historia from "./pages/Historia";
import Libro from "./pages/Libro";
import MusicaFondo from "./components/comun/MusicaFondo";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/juegos" element={<Juegos />} />
        <Route path="/historia" element={<Historia />} />
        <Route path="/libro" element={<Libro />} />
        {/* Cualquier otra ruta vuelve al Inicio. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <MusicaFondo />
    </>
  );
}
