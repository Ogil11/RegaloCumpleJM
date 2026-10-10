import { useCallback, useEffect, useRef, useState } from "react";
import pareja from "../../content/pareja.json";
import { tema } from "../../styles/tema";

const CLAVE = "musica:silenciada";

function leerPreferencia() {
  try {
    return localStorage.getItem(CLAVE) === "1";
  } catch {
    return false;
  }
}

/**
 * Música de fondo de toda la app (pareja.json -> musicaFondo).
 * - Si el campo está vacío o el archivo no existe, no se muestra nada.
 * - Los navegadores no dejan sonar audio antes de que la persona toque
 *   la página, así que si el primer intento falla se reintenta con el
 *   primer clic o tecla.
 * - El botón silencia o reanuda la música y recuerda la elección.
 */
export default function MusicaFondo() {
  const src = pareja.musicaFondo;
  const textos = pareja.textosInterfaz ?? {};

  const audioRef = useRef(null);
  const [disponible, setDisponible] = useState(false);
  const [silenciada, setSilenciada] = useState(leerPreferencia);
  const silenciadaRef = useRef(silenciada);

  const sonar = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || silenciadaRef.current) return Promise.resolve();
    return audio.play();
  }, []);

  /* Cargar el archivo. Solo cuando el navegador confirma que es audio
     de verdad aparece el botón. */
  useEffect(() => {
    if (!src) return undefined;
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = tema.volumenMusica;
    audioRef.current = audio;

    let cancelado = false;
    const alPrimerGesto = () => {
      quitarGestos();
      sonar().catch(() => {});
    };
    const quitarGestos = () => {
      window.removeEventListener("pointerdown", alPrimerGesto);
      window.removeEventListener("keydown", alPrimerGesto);
    };

    const alPoder = () => {
      if (cancelado) return;
      setDisponible(true);
      sonar().catch(() => {
        // Bloqueado hasta que la persona interactúe.
        window.addEventListener("pointerdown", alPrimerGesto);
        window.addEventListener("keydown", alPrimerGesto);
      });
    };
    const alFallar = () => {
      if (!cancelado) setDisponible(false);
    };

    audio.addEventListener("canplaythrough", alPoder, { once: true });
    audio.addEventListener("error", alFallar);

    return () => {
      cancelado = true;
      quitarGestos();
      audio.removeEventListener("canplaythrough", alPoder);
      audio.removeEventListener("error", alFallar);
      audio.pause();
      audio.removeAttribute("src");
      audioRef.current = null;
    };
  }, [src, sonar]);

  /* Aplicar y recordar el silencio. */
  useEffect(() => {
    silenciadaRef.current = silenciada;
    try {
      localStorage.setItem(CLAVE, silenciada ? "1" : "0");
    } catch {
      /* modo privado: la preferencia solo dura esta sesión */
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (silenciada) audio.pause();
    else sonar().catch(() => {});
  }, [silenciada, sonar]);

  if (!src || !disponible) return null;

  return (
    <button
      type="button"
      onClick={() => setSilenciada((s) => !s)}
      aria-pressed={silenciada}
      aria-label={silenciada ? textos.activarMusica : textos.silenciarMusica}
      title={silenciada ? textos.activarMusica : textos.silenciarMusica}
      className="fixed right-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--lib-dorado)]/40 bg-[var(--lib-papel)]/85 text-[var(--lib-tinta)] shadow-sm backdrop-blur-sm transition hover:bg-[var(--lib-papel)]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 18V5l11-2v13" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="17" cy="16" r="3" />
        {silenciada ? <path d="M3 3l18 18" strokeLinecap="round" /> : null}
      </svg>
    </button>
  );
}
