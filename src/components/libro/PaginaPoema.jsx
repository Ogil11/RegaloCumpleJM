import { Flor, Hoja } from "./Adornos";
import { lineas } from "./util";

/**
 * tipo: "poema"
 * Campos: titulo (opcional), versos (lista de lineas) o texto
 * (una linea por salto de linea), firma (opcional).
 */
export default function PaginaPoema({ pagina }) {
  const versos =
    Array.isArray(pagina.versos) && pagina.versos.length > 0
      ? pagina.versos
      : lineas(pagina.texto);

  return (
    <div className="lib-papel-alterno relative flex h-full w-full flex-col items-center justify-center gap-5 px-[12%] py-10">
      <Flor className="absolute left-4 top-5 h-11 w-11 opacity-35" />
      <Hoja className="absolute bottom-6 right-5 h-12 w-12 opacity-30" />
      <Flor className="absolute bottom-4 right-16 h-7 w-7 opacity-25" />

      {pagina.titulo ? (
        <h2 className="lib-titulo relative z-10 text-center text-[clamp(1rem,2.9cqw,1.45rem)] italic text-[var(--lib-tinta)]">
          {pagina.titulo}
        </h2>
      ) : null}

      <div className="relative z-10 flex flex-col items-center gap-[0.35em] text-center">
        {versos.map((v, i) => (
          <p
            key={i}
            className={`lib-cuerpo text-[clamp(0.78rem,2.15cqw,1rem)] leading-[1.6] ${
              v.trim() === "" ? "h-3" : ""
            } ${i % 2 === 1 ? "text-[var(--lib-tinta-suave)]" : "text-[var(--lib-tinta)]"}`}
          >
            {v}
          </p>
        ))}
      </div>

      {pagina.firma ? (
        <p className="lib-mano relative z-10 mt-2 text-[clamp(1rem,2.7cqw,1.4rem)] text-[var(--lib-rosa)]">
          {pagina.firma}
        </p>
      ) : null}
    </div>
  );
}
