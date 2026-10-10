import { Corazon, Filigrana, WashiTape } from "./Adornos";
import { parrafos } from "./util";

/**
 * tipo: "dedicatoria"
 * Campos: titulo (opcional), texto, firma, fecha (opcional).
 */
export default function PaginaDedicatoria({ pagina }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 px-[12%] py-10 text-center">
      <WashiTape className="left-1/2 top-4 h-5 w-24 -translate-x-1/2" indice={0} rotacion={-3} />

      <Corazon className="h-6 w-6 opacity-70" />

      {pagina.titulo ? (
        <h2 className="lib-titulo text-[clamp(0.95rem,2.6cqw,1.3rem)] uppercase tracking-[0.3em] text-[var(--lib-tinta-suave)]">
          {pagina.titulo}
        </h2>
      ) : null}

      <div className="lib-cuerpo flex flex-col gap-3 text-[clamp(0.8rem,2.3cqw,1.05rem)] italic leading-relaxed text-[var(--lib-tinta)]">
        {parrafos(pagina.texto).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <Filigrana className="h-3 w-32 opacity-80" />

      {pagina.firma ? (
        <p className="lib-mano text-[clamp(1.1rem,3cqw,1.6rem)] text-[var(--lib-rosa)]">
          {pagina.firma}
        </p>
      ) : null}

      {pagina.fecha ? (
        <p className="lib-titulo text-[9px] uppercase tracking-[0.25em] text-[var(--lib-tinta-suave)]">
          {pagina.fecha}
        </p>
      ) : null}
    </div>
  );
}
