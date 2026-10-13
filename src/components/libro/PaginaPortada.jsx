import { motion } from "framer-motion";
import { useLibro } from "./estadoLibro";
import { textos } from "./textos";
import { Corazon, Flor } from "./Adornos";
import { ImagenPerezosa } from "./MediaPerezosa";

/**
 * tipo: "portada"
 * Tapa dura. Campos: titulo, subtitulo, autor, foto (opcional), etiqueta.
 */
export default function PaginaPortada({ pagina, cerca }) {
  const { paginaActual, acciones } = useLibro();
  const cerrado = paginaActual === 0;

  return (
    <div className="lib-tapa relative flex h-full w-full flex-col items-center justify-between overflow-hidden px-6 py-8 text-center">
      {/* Marco dorado */}
      <div className="lib-filete pointer-events-none absolute inset-3 rounded-[2px]" />

      <Flor className="absolute -right-6 -top-6 h-28 w-28 opacity-20" />
      <Flor className="absolute -bottom-8 -left-8 h-32 w-32 opacity-15" />

      <header className="relative z-10 mt-2">
        {pagina.etiqueta ? (
          <p className="lib-titulo text-[10px] uppercase tracking-[0.42em] text-[var(--lib-tapa-filete)]">
            {pagina.etiqueta}
          </p>
        ) : null}
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-2">
        {pagina.foto ? (
          <div className="relative">
            <ImagenPerezosa
              src={pagina.foto}
              alt={pagina.alt || pagina.titulo || ""}
              cerca={cerca}
              sizes="112px"
              className="h-24 w-24 rounded-full border-2 border-[var(--lib-tapa-filete)]/70 shadow-lg sm:h-28 sm:w-28"
            />
          </div>
        ) : null}

        <h1 className="lib-titulo text-balance text-[clamp(1.5rem,4.2cqw,2.6rem)] font-bold leading-tight text-[var(--lib-texto-tapa)] drop-shadow-[0_2px_4px_color-mix(in_srgb,var(--lib-sombra-tapa)_45%,transparent)]">
          {pagina.titulo}
        </h1>

        <Corazon className="h-5 w-5" color="var(--lib-tapa-filete)" />

        {pagina.subtitulo ? (
          <p className="lib-mano text-balance text-[clamp(0.95rem,2.4cqw,1.35rem)] leading-snug text-[var(--lib-tapa-filete)]">
            {pagina.subtitulo}
          </p>
        ) : null}
      </div>

      <footer className="relative z-10 mb-1 flex flex-col items-center gap-3">
        {pagina.autor ? (
          <p className="lib-titulo text-[10px] uppercase tracking-[0.3em] text-[var(--lib-texto-tapa)]/75">
            {pagina.autor}
          </p>
        ) : null}

        {/* Boton real: react-pageflip reenvia los clics de <button>,
            asi no se confunde con un arrastre de esquina. */}
        {cerrado ? (
          <motion.button
            type="button"
            onClick={() => acciones?.irSiguiente?.()}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="lib-titulo inline-flex min-h-11 items-center rounded-full border border-[var(--lib-tapa-filete)]/80 bg-[var(--lib-sombra-tapa)]/20 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[var(--lib-texto-tapa)] backdrop-blur-sm transition hover:bg-[var(--lib-sombra-tapa)]/35"
          >
            {textos.abrirLibro}
          </motion.button>
        ) : null}
      </footer>
    </div>
  );
}
