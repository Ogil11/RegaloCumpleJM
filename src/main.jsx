import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { aplicarTemaGlobal } from "./styles/tema";
import "./styles/index.css";

// Colores y fuentes de tema.js para toda la app, antes del primer render.
aplicarTemaGlobal();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
