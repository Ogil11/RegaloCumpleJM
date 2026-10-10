import { useCallback, useEffect, useRef, useState } from "react";
import { tema } from "../../styles/tema";

const CLAVE = "libro:silenciado";

function leerPreferencia() {
  try {
    return localStorage.getItem(CLAVE) === "1";
  } catch {
    return false;
  }
}

/**
 * Sonido de papel al pasar la hoja.
 * Si el archivo de tema.sonidoPagina no existe, no pasa nada: se
 * desactiva en silencio y el libro sigue funcionando.
 */
export default function useSonidoPagina() {
  const [silenciado, setSilenciado] = useState(leerPreferencia);
  const audioRef = useRef(null);
  const disponibleRef = useRef(true);
  // Espejo en una ref para que `reproducir` no cambie de identidad:
  // react-pageflip guarda sus props al construirse.
  const silenciadoRef = useRef(silenciado);

  useEffect(() => {
    if (!tema.sonidoPagina) {
      disponibleRef.current = false;
      return undefined;
    }
    const audio = new Audio(tema.sonidoPagina);
    audio.preload = "auto";
    audio.volume = tema.libro.volumenSonido;
    const alFallar = () => {
      disponibleRef.current = false;
    };
    audio.addEventListener("error", alFallar);
    audioRef.current = audio;
    return () => {
      audio.removeEventListener("error", alFallar);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    silenciadoRef.current = silenciado;
    try {
      localStorage.setItem(CLAVE, silenciado ? "1" : "0");
    } catch {
      /* modo privado: la preferencia solo dura esta sesión */
    }
  }, [silenciado]);

  const reproducir = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || silenciadoRef.current || !disponibleRef.current) return;
    try {
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch {
      /* el navegador puede bloquear el audio hasta el primer gesto */
    }
  }, []);

  const alternarSilencio = useCallback(() => setSilenciado((s) => !s), []);

  return { silenciado, alternarSilencio, reproducir };
}
