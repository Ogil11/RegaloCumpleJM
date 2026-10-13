import { useState } from "react";
import Imagen from "./Imagen";
import { textosHistoria as t } from "./textosHistoria";

/**
 * Recuadro elegante que sale en lugar de una foto o un video que falta.
 * Muestra REEMPLAZAR y la ruta, para saber que archivo poner.
 * `compacto` deja solo el corazon, para recuadros pequenos.
 */
export function Reemplazo({ ruta, aviso, compacto = false, className = "" }) {
  return (
    <div
      className={`lib-marcador hist-reemplazo flex h-full w-full flex-col items-center justify-center gap-1 overflow-hidden p-2 text-center ${className}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0 opacity-70">
        <path
          d="M12 21s-7.5-4.7-9.4-9.1C1.1 8.3 3 4.8 6.4 4.1c2.2-.5 4.3.6 5.6 2.4 1.3-1.8 3.4-2.9 5.6-2.4 3.4.7 5.3 4.2 3.8 7.8C19.5 16.3 12 21 12 21z"
          fill="var(--lib-rosa)"
        />
      </svg>
      {!compacto ? (
        <span className="lib-titulo text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--lib-rosa)]">
          {t.reemplazar}
        </span>
      ) : null}
      {aviso && !compacto ? (
        <span className="lib-mano text-sm leading-tight text-[var(--lib-tinta-suave)]">{aviso}</span>
      ) : null}
      {ruta && !compacto ? (
        <code className="max-w-full break-all text-[9px] leading-tight text-[var(--lib-tinta-suave)]">{ruta}</code>
      ) : null}
    </div>
  );
}

/**
 * Foto con carga perezosa (loading="lazy") y recuadro de reemplazo si
 * el archivo no existe. Nunca muestra una imagen rota.
 * - modo "cubrir": llena su caja (para marcos y mosaicos).
 * - modo "contener": la foto entera a su tamano natural (para el visor).
 * - sizes: cuanto ocupa en pantalla, para elegir la version justa.
 */
const SIZES_MOSAICO = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

export default function FotoSegura({ src, alt = "", modo = "cubrir", compacto = false, sizes, className = "" }) {
  if (!src) {
    return (
      <div className={className}>
        <Reemplazo aviso={t.faltaFoto} compacto={compacto} />
      </div>
    );
  }
  // key={src}: si cambia la ruta, vuelve a empezar en "cargando".
  return (
    <FotoCargando
      key={src}
      src={src}
      alt={alt}
      modo={modo}
      compacto={compacto}
      sizes={sizes ?? (modo === "contener" ? "100vw" : SIZES_MOSAICO)}
      className={className}
    />
  );
}

function FotoCargando({ src, alt, modo, compacto, sizes, className }) {
  const [estado, setEstado] = useState("cargando");
  const contener = modo === "contener";

  if (contener) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {estado !== "ok" ? (
          <div className="aspect-[4/3] w-[min(86vw,560px)]">
            {estado === "error" ? (
              <Reemplazo ruta={src} aviso={t.fotoNoEncontrada} />
            ) : (
              <div className="h-full w-full animate-pulse rounded-sm bg-[var(--lib-papel-alterno)]/30" />
            )}
          </div>
        ) : null}
        <Imagen
          src={src}
          sizes={sizes}
          alt={alt}
          decoding="async"
          draggable="false"
          onLoad={() => setEstado("ok")}
          onError={() => setEstado("error")}
          className={
            estado === "ok"
              ? "max-h-[72dvh] max-w-full select-none rounded-sm object-contain shadow-2xl"
              : "pointer-events-none absolute h-px w-px opacity-0"
          }
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {estado !== "ok" ? (
        <div className="absolute inset-0">
          {estado === "error" ? (
            <Reemplazo ruta={src} aviso={t.fotoNoEncontrada} compacto={compacto} />
          ) : (
            <div className="h-full w-full animate-pulse bg-[var(--lib-papel-alterno)]" />
          )}
        </div>
      ) : null}
      <Imagen
        src={src}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable="false"
        onLoad={() => setEstado("ok")}
        onError={() => setEstado("error")}
        className={`h-full w-full select-none object-cover transition-opacity duration-500 ${
          estado === "ok" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
