import { Link } from "react-router-dom";
import IndiceLibro from "./IndiceLibro";
import { textos } from "./textos";

const BOTON =
  "flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-[var(--lib-dorado)]/40 bg-[var(--lib-papel)]/85 px-2.5 py-2 text-xs font-medium text-[var(--lib-tinta)] shadow-sm transition hover:bg-[var(--lib-papel)] disabled:cursor-not-allowed disabled:opacity-40 sm:gap-2 sm:px-3";

function Flecha({ hacia = "izq" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${hacia === "der" ? "rotate-180" : ""}`}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoSonido({ silenciado }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 9v6h3l5 4V5L7 9H4z" strokeLinecap="round" strokeLinejoin="round" />
      {silenciado ? (
        <path d="M16 9l5 6M21 9l-5 6" strokeLinecap="round" />
      ) : (
        <path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" strokeLinecap="round" />
      )}
    </svg>
  );
}

/**
 * Barra de navegacion del libro. Va FUERA del libro para que sus clics
 * nunca se confundan con un paso de pagina.
 */
export default function ControlesLibro({
  paginaActual,
  total,
  retrato,
  entradas,
  silenciado,
  onAnterior,
  onSiguiente,
  onIr,
  onAlternarSilencio,
}) {
  const ultima = total - 1;
  const etiquetaPagina = retrato
    ? `${paginaActual} / ${ultima}`
    : paginaActual === 0
      ? textos.portada
      : paginaActual >= ultima
        ? textos.fin
        : `${paginaActual}–${Math.min(paginaActual + 1, ultima)} / ${ultima}`;

  return (
    <div className="lib-sin-flip flex w-full items-center justify-center gap-1.5 px-2 py-2.5 sm:gap-3 sm:px-3 sm:py-3">
      <Link to="/" className={BOTON}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 11l9-8 9 8M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="hidden sm:inline">{textos.inicio}</span>
      </Link>

      <IndiceLibro entradas={entradas} paginaActual={paginaActual} onIr={onIr} />

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onAnterior}
          disabled={paginaActual <= 0}
          aria-label={textos.paginaAnterior}
          className={BOTON}
        >
          <Flecha hacia="izq" />
        </button>

        <span
          aria-live="polite"
          className="lib-titulo min-w-[4rem] text-center text-[10px] tracking-[0.1em] text-[var(--lib-tinta)] sm:min-w-[5.5rem] sm:text-[11px]"
        >
          {etiquetaPagina}
        </span>

        <button
          type="button"
          onClick={onSiguiente}
          disabled={paginaActual >= ultima}
          aria-label={textos.paginaSiguiente}
          className={BOTON}
        >
          <Flecha hacia="der" />
        </button>
      </div>

      <button
        type="button"
        onClick={onAlternarSilencio}
        aria-pressed={silenciado}
        aria-label={silenciado ? textos.activarSonido : textos.silenciarSonido}
        className={BOTON}
      >
        <IconoSonido silenciado={silenciado} />
      </button>
    </div>
  );
}
