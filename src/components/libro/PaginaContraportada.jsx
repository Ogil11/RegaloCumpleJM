import { Corazon, Flor } from "./Adornos";
import { parrafos } from "./util";

/**
 * tipo: "contraportada"
 * Campos: texto (opcional), firma (opcional), fecha (opcional).
 * Tapa dura trasera: mismo material que la portada, pero sobria.
 */
export default function PaginaContraportada({ pagina }) {
  return (
    <div className="lib-tapa relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden px-[14%] text-center">
      <div className="lib-filete pointer-events-none absolute inset-3 rounded-[2px]" />
      <Flor className="absolute -left-8 -bottom-8 h-28 w-28 opacity-15" />

      <Corazon className="relative z-10 h-7 w-7" color="var(--lib-tapa-filete)" />

      {pagina.texto ? (
        <div className="relative z-10 flex flex-col gap-3">
          {parrafos(pagina.texto).map((p, i) => (
            <p
              key={i}
              className="lib-cuerpo text-balance text-[clamp(0.78rem,2.2cqw,1rem)] italic leading-relaxed text-[var(--lib-texto-tapa)]/90"
            >
              {p}
            </p>
          ))}
        </div>
      ) : null}

      {pagina.firma ? (
        <p className="lib-mano relative z-10 text-[clamp(1.05rem,2.9cqw,1.45rem)] text-[var(--lib-tapa-filete)]">
          {pagina.firma}
        </p>
      ) : null}

      {pagina.fecha ? (
        <p className="lib-titulo relative z-10 text-[9px] uppercase tracking-[0.3em] text-[var(--lib-texto-tapa)]/60">
          {pagina.fecha}
        </p>
      ) : null}
    </div>
  );
}
