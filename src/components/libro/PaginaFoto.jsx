import { Corazon, WashiTape } from "./Adornos";
import { ImagenPerezosa } from "./MediaPerezosa";

/**
 * tipo: "foto"
 * Campos: foto, alt, pie (opcional), rotacion (grados, opcional),
 * titulo (opcional).
 * Se muestra como una polaroid sujeta con cinta washi.
 */
export default function PaginaFoto({ pagina, cerca }) {
  const rotacion = typeof pagina.rotacion === "number" ? pagina.rotacion : -2.5;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-[8%]">
      {pagina.titulo ? (
        <h2 className="lib-titulo text-center text-[clamp(0.9rem,2.5cqw,1.2rem)] uppercase tracking-[0.2em] text-[var(--lib-tinta-suave)]">
          {pagina.titulo}
        </h2>
      ) : null}

      <div
        className="lib-polaroid relative flex w-[86%] max-w-[420px] flex-col gap-2 rounded-[2px] p-[5%] pb-[3%]"
        style={{ transform: `rotate(${rotacion}deg)` }}
      >
        <WashiTape
          className="-top-4 left-1/2 h-7 w-24 -translate-x-1/2"
          indice={0}
          rotacion={-rotacion * 2 - 4}
        />

        <ImagenPerezosa
          src={pagina.foto}
          alt={pagina.alt || pagina.pie || ""}
          cerca={cerca}
          className="aspect-square w-full bg-[var(--lib-papel-alterno)]"
        />

        <div className="flex min-h-[2.6em] items-center justify-center px-1">
          {pagina.pie ? (
            <p className="lib-mano text-center text-[clamp(0.9rem,2.5cqw,1.2rem)] leading-tight text-[var(--lib-tinta)]">
              {pagina.pie}
            </p>
          ) : null}
        </div>
      </div>

      <Corazon className="h-4 w-4 opacity-60" />
    </div>
  );
}
