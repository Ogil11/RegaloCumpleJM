import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { rutasSonidos } from "./datosJuegos";

const CLAVE = "juegos:silenciado";

function leerPreferencia() {
  try {
    return localStorage.getItem(CLAVE) === "1";
  } catch {
    return false;
  }
}

const sinSonido = { silenciado: true, alternarSilencio: () => {}, reproducir: () => {} };
export const ContextoSonido = createContext(sinSonido);

/**
 * Efectos de sonido de los juegos (rutas en juegos.json -> sonidos).
 * Cada sonido se carga la primera vez que se usa. Si el archivo no
 * existe, ese sonido se desactiva en silencio y el juego sigue igual.
 */
export function useSonidosJuegos() {
  const [silenciado, setSilenciado] = useState(leerPreferencia);
  const audios = useRef(new Map());
  const fallidos = useRef(new Set());
  const silenciadoRef = useRef(silenciado);

  useEffect(() => {
    silenciadoRef.current = silenciado;
    try {
      localStorage.setItem(CLAVE, silenciado ? "1" : "0");
    } catch {
      /* modo privado: la preferencia solo dura esta sesión */
    }
  }, [silenciado]);

  useEffect(() => {
    const mapa = audios.current;
    return () => {
      for (const audio of mapa.values()) audio.pause();
      mapa.clear();
    };
  }, []);

  const reproducir = useCallback((nombre) => {
    const ruta = rutasSonidos[nombre];
    if (!ruta || silenciadoRef.current || fallidos.current.has(nombre)) return;
    try {
      let audio = audios.current.get(nombre);
      if (!audio) {
        audio = new Audio(ruta);
        audio.volume = 0.5;
        audio.addEventListener("error", () => fallidos.current.add(nombre));
        audios.current.set(nombre, audio);
      }
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch {
      /* el navegador puede bloquear el audio: no pasa nada */
    }
  }, []);

  const alternarSilencio = useCallback(() => setSilenciado((s) => !s), []);

  return useMemo(() => ({ silenciado, alternarSilencio, reproducir }), [silenciado, alternarSilencio, reproducir]);
}

/** Desde cualquier juego: const { reproducir } = useSonido(); reproducir("acierto"). */
export function useSonido() {
  return useContext(ContextoSonido);
}
