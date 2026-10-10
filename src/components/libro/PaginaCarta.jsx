import { Corazon, WashiTape } from "./Adornos";
import { parrafos } from "./util";

/**
 * tipo: "carta"
 * Campos: destinatario, texto, firma, fecha (opcional), lugar (opcional).
 * Se dibuja como una hoja de carta con renglones.
 */
export default function PaginaCarta({ pagina }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-[6%]">
      {/* Hoja de carta pegada con cinta */}
      <div className="relative h-full w-full lib-carta rounded-sm px-[9%] py-[8%]">
        <WashiTape className="-top-3 left-6 h-6 w-20" indice={1} rotacion={-8} />
        <WashiTape className="-top-3 right-6 h-6 w-20" indice={2} rotacion={7} />

        {/* Renglones */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 1.55em, color-mix(in srgb, var(--lib-salvia) 45%, transparent) 1.55em 1.6em)",
            backgroundPosition: "0 2.2em",
          }}
        />
        {/* Margen rojo clasico */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-[7%] top-0 w-px bg-[color-mix(in_srgb,var(--lib-rosa)_55%,transparent)]"
        />

        <div className="relative z-10 flex h-full flex-col">
          {pagina.fecha || pagina.lugar ? (
            <p className="lib-mano mb-2 self-end text-[clamp(0.85rem,2.3cqw,1.1rem)] text-[var(--lib-tinta-suave)]">
              {[pagina.lugar, pagina.fecha].filter(Boolean).join(", ")}
            </p>
          ) : null}

          {pagina.destinatario ? (
            <p className="lib-mano mb-2 text-[clamp(1.05rem,2.9cqw,1.5rem)] text-[var(--lib-tinta)]">
              {pagina.destinatario}
            </p>
          ) : null}

          <div className="lib-mano flex flex-1 flex-col gap-2 overflow-hidden text-[clamp(0.95rem,2.6cqw,1.3rem)] leading-[1.6] text-[var(--lib-tinta)]">
            {parrafos(pagina.texto).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {pagina.firma ? (
            <div className="mt-3 flex items-end justify-end gap-2">
              <Corazon className="h-4 w-4 opacity-70" />
              <p className="lib-mano text-[clamp(1.1rem,3cqw,1.55rem)] text-[var(--lib-rosa)]">
                {pagina.firma}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
