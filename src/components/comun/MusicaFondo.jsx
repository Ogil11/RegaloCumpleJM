import { useEffect, useRef, useState } from "react";
import pareja from "../../content/pareja.json";
import { audioMusica, guardarSilencio, musicaSilenciada } from "./musica";

/**
 * Botón de la música de fondo (pareja.json -> musicaFondo).
 * - Si el campo está vacío o el archivo no existe, no se muestra nada.
 * - La música arranca con el botón "Entrar" de la pantalla de entrada.
 *   Si se salta esa pantalla (al recargar), los navegadores no la dejan
 *   sonar sola, así que empieza con el primer clic o tecla.
 * - El botón silencia o reanuda la música y recuerda la elección.
 */
export default function MusicaFondo() {
  const textos = pareja.textosInterfaz ?? {};
  const [disponible, setDisponible] = useState(false);
  const [silenciada, setSilenciada] = useState(musicaSilenciada);
  const silenciadaRef = useRef(silenciada);

  /* Esperar a que el navegador confirme que es audio de verdad. */
  useEffect(() => {
    const audio = audioMusica();
    if (!audio) return undefined;

    let cancelado = false;
    const sonar = () => (silenciadaRef.current || !audio.paused ? Promise.resolve() : audio.play());
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

    if (audio.error) alFallar();
    else if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) alPoder();
    else audio.addEventListener("canplaythrough", alPoder, { once: true });
    audio.addEventListener("error", alFallar);

    return () => {
      cancelado = true;
      quitarGestos();
      audio.removeEventListener("canplaythrough", alPoder);
      audio.removeEventListener("error", alFallar);
    };
  }, []);

  /* Aplicar y recordar el silencio. */
  useEffect(() => {
    silenciadaRef.current = silenciada;
    guardarSilencio(silenciada);
    const audio = audioMusica();
    if (!audio || !disponible) return;
    if (silenciada) audio.pause();
    else audio.play().catch(() => {});
  }, [silenciada, disponible]);

  if (!disponible) return null;

  return (
    <button
      type="button"
      onClick={() => setSilenciada((s) => !s)}
      aria-pressed={silenciada}
      aria-label={silenciada ? textos.activarMusica : textos.silenciarMusica}
      title={silenciada ? textos.activarMusica : textos.silenciarMusica}
      className="fixed right-3 top-3 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--lib-dorado)]/40 bg-[var(--lib-papel)]/85 text-[var(--lib-tinta)] shadow-sm backdrop-blur-sm transition hover:bg-[var(--lib-papel)]"
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
