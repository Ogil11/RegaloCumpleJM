import { AdornosEsquina, Filigrana } from "./Adornos";
import { ImagenPerezosa } from "./MediaPerezosa";
import { parrafos } from "./util";

/**
 * tipo: "texto"
 * Campos: titulo (opcional), texto (parrafos separados por linea en
 * blanco), foto (opcional, se muestra pequena al final), capitular
 * (opcional, true para letra inicial grande).
 */
export default function PaginaTexto({ pagina, indice, cerca }) {
  const bloques = parrafos(pagina.texto);
  const capitular = pagina.capitular !== false;

  return (
    <div className="relative flex h-full w-full flex-col gap-4 px-[11%] py-[9%]">
      <AdornosEsquina variante={indice} />

      {pagina.titulo ? (
        <header className="relative z-10 flex flex-col items-center gap-2 text-center">
          <h2 className="lib-titulo text-[clamp(1rem,3cqw,1.5rem)] font-bold leading-tight text-[var(--lib-tinta)]">
            {pagina.titulo}
          </h2>
          <Filigrana className="h-3 w-24 opacity-70" />
        </header>
      ) : null}

      <div className="lib-cuerpo relative z-10 flex flex-1 flex-col gap-3 overflow-hidden text-[clamp(0.75rem,2.1cqw,0.98rem)] leading-[1.75] text-[var(--lib-tinta)]">
        {bloques.map((p, i) => (
          <p
            key={i}
            className={
              i === 0 && capitular
                ? "first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-[2.9em] first-letter:font-bold first-letter:leading-[0.78] first-letter:text-[var(--lib-rosa)] first-letter:[font-family:var(--lib-fuente-titulos)]"
                : "indent-6"
            }
          >
            {p}
          </p>
        ))}
      </div>

      {pagina.foto ? (
        <ImagenPerezosa
          src={pagina.foto}
          alt={pagina.alt || ""}
          cerca={cerca}
          className="relative z-10 h-[22%] w-full rounded-sm border border-[var(--lib-papel-borde)] shadow-sm"
        />
      ) : null}
    </div>
  );
}
