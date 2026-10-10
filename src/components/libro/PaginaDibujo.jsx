import { EsquinasFoto } from "./Adornos";
import { ImagenPerezosa } from "./MediaPerezosa";

/**
 * tipo: "dibujo"
 * Campos: dibujo (ruta de la imagen), alt, titulo (opcional),
 * pie (opcional).
 * El fondo imita papel cuadriculado y el dibujo se ve completo
 * (sin recortar), como un escaneo.
 */
export default function PaginaDibujo({ pagina, cerca }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 p-[8%]">
      {/* Cuadricula */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, color-mix(in srgb, var(--lib-salvia) 38%, transparent) 0 1px, transparent 1px 1.1em), repeating-linear-gradient(to bottom, color-mix(in srgb, var(--lib-salvia) 38%, transparent) 0 1px, transparent 1px 1.1em)",
        }}
      />

      {pagina.titulo ? (
        <h2 className="lib-mano relative z-10 text-center text-[clamp(1.05rem,2.9cqw,1.5rem)] text-[var(--lib-tinta)]">
          {pagina.titulo}
        </h2>
      ) : null}

      <div className="relative z-10 flex w-[88%] flex-1 items-center justify-center">
        <div className="relative h-full w-full p-3">
          <EsquinasFoto />
          <ImagenPerezosa
            src={pagina.dibujo || pagina.foto}
            alt={pagina.alt || pagina.titulo || ""}
            cerca={cerca}
            className="h-full w-full"
            imgClassName="object-contain mix-blend-multiply"
          />
        </div>
      </div>

      {pagina.pie ? (
        <p className="lib-mano relative z-10 text-center text-[clamp(0.85rem,2.3cqw,1.1rem)] text-[var(--lib-tinta-suave)]">
          {pagina.pie}
        </p>
      ) : null}
    </div>
  );
}
