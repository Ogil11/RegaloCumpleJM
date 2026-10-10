import { WashiTape } from "./Adornos";
import { VideoPerezoso } from "./MediaPerezosa";

/**
 * tipo: "video"
 * Campos: video (ruta .mp4), poster (imagen de portada, opcional),
 * titulo (opcional), pie (opcional).
 * El video se pausa solo al cambiar de pagina.
 */
export default function PaginaVideo({ pagina, cerca, visible }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-[8%]">
      {pagina.titulo ? (
        <h2 className="lib-titulo text-center text-[clamp(0.9rem,2.5cqw,1.2rem)] uppercase tracking-[0.2em] text-[var(--lib-tinta-suave)]">
          {pagina.titulo}
        </h2>
      ) : null}

      <div className="lib-polaroid relative w-full max-w-[460px] rounded-[2px] p-[4%]">
        <WashiTape className="-top-3 left-1/2 h-6 w-20 -translate-x-1/2" indice={2} rotacion={5} />

        <VideoPerezoso
          src={pagina.video}
          poster={pagina.poster}
          cerca={cerca}
          activa={visible}
          className="aspect-video w-full overflow-hidden rounded-sm"
        />
      </div>

      {pagina.pie ? (
        <p className="lib-mano text-center text-[clamp(0.9rem,2.4cqw,1.15rem)] leading-tight text-[var(--lib-tinta)]">
          {pagina.pie}
        </p>
      ) : null}
    </div>
  );
}
