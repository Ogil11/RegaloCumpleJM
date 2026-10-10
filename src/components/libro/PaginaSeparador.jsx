import { Corazon, Filigrana, Flor, Hoja } from "./Adornos";

/**
 * tipo: "separador"
 * Campos: numero (ej. "Capitulo 1"), titulo, subtitulo (opcional).
 * Es una hoja de cartulina mas gruesa (data-density="hard"), asi que
 * se pasa con el gesto rigido, como un separador de verdad.
 */
export default function PaginaSeparador({ pagina }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden px-[12%] text-center">
      {/* Cartulina con tono propio */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, color-mix(in srgb, var(--lib-rosa-claro) 70%, var(--lib-papel)) 0%, var(--lib-papel-alterno) 60%, color-mix(in srgb, var(--lib-dorado-claro) 45%, var(--lib-papel)) 100%)",
        }}
      />

      <Flor className="absolute -left-6 -top-6 h-28 w-28 opacity-30" />
      <Hoja className="absolute -bottom-6 -right-5 h-28 w-28 opacity-25" />
      <Corazon className="absolute bottom-8 left-8 h-4 w-4 opacity-40" />

      <div className="relative z-10 flex flex-col items-center gap-3">
        {pagina.numero ? (
          <p className="lib-titulo text-[10px] uppercase tracking-[0.4em] text-[var(--lib-dorado)]">
            {pagina.numero}
          </p>
        ) : null}

        <Filigrana className="h-3 w-28 opacity-80" />

        <h2 className="lib-titulo text-balance text-[clamp(1.2rem,3.6cqw,2rem)] font-bold leading-tight text-[var(--lib-tinta)]">
          {pagina.titulo}
        </h2>

        {pagina.subtitulo ? (
          <p className="lib-mano text-balance text-[clamp(0.95rem,2.6cqw,1.3rem)] text-[var(--lib-rosa)]">
            {pagina.subtitulo}
          </p>
        ) : null}

        <Filigrana className="h-3 w-20 rotate-180 opacity-70" />
      </div>
    </div>
  );
}
