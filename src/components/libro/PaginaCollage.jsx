import { Flor, WashiTape } from "./Adornos";
import { ImagenPerezosa } from "./MediaPerezosa";

/**
 * tipo: "collage"
 * Campos: titulo (opcional), fotos (de 2 a 4 objetos con
 * { src, alt, pie, rotacion }).
 * Las fotos salen inclinadas, como pegadas en un album.
 */

/* Colocacion segun cuantas fotos haya. Sin solapes: si las polaroids
   se montan unas sobre otras, los pies de foto quedan tapados. */
const DISPOSICION = {
  2: ["w-[60%] self-start", "w-[60%] self-end"],
  3: ["w-[88%]", "w-[88%]", "col-span-2 w-[46%] justify-self-center"],
  4: ["w-[88%]", "w-[88%]", "w-[88%]", "w-[88%]"],
};

const ROTACIONES = [-3.5, 2.8, -2, 3.2];

export default function PaginaCollage({ pagina, cerca }) {
  const fotos = (pagina.fotos || []).slice(0, 4);
  const n = Math.max(2, Math.min(4, fotos.length));
  const clases = DISPOSICION[n] || DISPOSICION[4];
  // Con 3 o 4 fotos se usa una rejilla de 2 columnas; con 2, una columna.
  const enRejilla = n >= 3;

  return (
    <div className="relative flex h-full w-full flex-col gap-3 p-[7%]">
      <Flor className="absolute -right-4 top-1/3 h-16 w-16 opacity-20" />

      {pagina.titulo ? (
        <h2 className="lib-titulo text-center text-[clamp(0.9rem,2.5cqw,1.2rem)] uppercase tracking-[0.2em] text-[var(--lib-tinta-suave)]">
          {pagina.titulo}
        </h2>
      ) : null}

      <div
        className={
          enRejilla
            ? "relative z-10 grid flex-1 grid-cols-2 content-center items-center justify-items-center gap-x-[4%] gap-y-[5%]"
            : "relative z-10 flex flex-1 flex-col justify-center gap-[6%]"
        }
      >
        {fotos.map((foto, i) => {
          const rot = typeof foto.rotacion === "number" ? foto.rotacion : ROTACIONES[i % 4];
          return (
            <figure
              key={foto.src || i}
              className={`lib-polaroid relative rounded-[2px] p-[4%] pb-[2%] ${clases[i] || "w-[46%]"}`}
              style={{ transform: `rotate(${rot}deg)` }}
            >
              {i === 0 ? (
                <WashiTape className="-top-3 left-2 h-5 w-14" indice={i} rotacion={-rot * 2} />
              ) : null}

              <ImagenPerezosa
                src={foto.src}
                alt={foto.alt || foto.pie || ""}
                cerca={cerca}
                className="aspect-[4/3] w-full bg-[var(--lib-papel-alterno)]"
              />

              {foto.pie ? (
                <figcaption className="lib-mano px-1 pt-1 text-center text-[clamp(0.7rem,1.9cqw,0.95rem)] leading-tight text-[var(--lib-tinta)]">
                  {foto.pie}
                </figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>
    </div>
  );
}
