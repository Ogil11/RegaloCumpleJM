import { useEffect, useRef, useState } from "react";
import { textos } from "./textos";

/**
 * Marcador que se muestra cuando falta el archivo, para que se vea
 * claro que hay que reemplazarlo.
 */
export function Marcador({ ruta, etiqueta = textos.reemplazar, className = "" }) {
  return (
    <div
      className={`lib-marcador flex h-full w-full flex-col items-center justify-center gap-1 rounded-sm p-3 text-center ${className}`}
    >
      <span className="lib-titulo text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--lib-rosa)]">
        {etiqueta}
      </span>
      {ruta ? (
        <code className="max-w-full break-all text-[9px] leading-tight text-[var(--lib-tinta-suave)]">
          {ruta}
        </code>
      ) : null}
    </div>
  );
}

/**
 * Imagen con carga perezosa.
 * Si `cerca` es false no se monta el <img>, asi las paginas lejanas no
 * descargan nada. Si el archivo no existe, muestra el Marcador.
 */
export function ImagenPerezosa({ src, alt = "", cerca = true, className = "", imgClassName = "" }) {
  if (!src) {
    return (
      <div className={className}>
        <Marcador etiqueta={textos.faltaFoto} />
      </div>
    );
  }

  if (!cerca) {
    // Pagina lejana: hueco del mismo tamano, sin descargar la imagen.
    return <div className={`${className} bg-[var(--lib-papel-alterno)]`} aria-hidden="true" />;
  }

  // key={src}: si cambia la ruta, la imagen arranca de cero (estado "cargando").
  return <ImagenCargando key={src} src={src} alt={alt} className={className} imgClassName={imgClassName} />;
}

/** El <img> con su estado de carga. Solo lo usa ImagenPerezosa. */
function ImagenCargando({ src, alt, className, imgClassName }) {
  const [estado, setEstado] = useState("cargando");

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {estado !== "ok" && (
        <div className="absolute inset-0">
          {estado === "error" ? (
            <Marcador ruta={src} etiqueta={textos.fotoNoEncontrada} />
          ) : (
            <div className="h-full w-full animate-pulse bg-[var(--lib-papel-alterno)]" />
          )}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable="false"
        onLoad={() => setEstado("ok")}
        onError={() => setEstado("error")}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          estado === "ok" ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
      />
    </div>
  );
}

/**
 * Video con carga perezosa y controles nativos.
 * - Se pausa solo cuando la pagina deja de estar visible (`activa`).
 * - Los eventos de puntero se cortan para que tocar los controles no
 *   pase la pagina.
 */
export function VideoPerezoso({ src, poster, cerca = true, activa = true, className = "" }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!activa && videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {
        /* sin consecuencias */
      }
    }
  }, [activa]);

  const detener = (e) => e.stopPropagation();

  if (!src) {
    return (
      <div className={className}>
        <Marcador etiqueta={textos.faltaVideo} />
      </div>
    );
  }

  if (!cerca) {
    return <div className={`${className} bg-[var(--lib-papel-alterno)]`} aria-hidden="true" />;
  }

  return (
    <div
      className={`relative ${className}`}
      onPointerDown={detener}
      onMouseDown={detener}
      onTouchStart={detener}
    >
      {error ? (
        <Marcador ruta={src} etiqueta={textos.videoNoEncontrado} />
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster || undefined}
          controls
          playsInline
          preload="none"
          onError={() => setError(true)}
          className="h-full w-full rounded-sm bg-black object-contain"
        />
      )}
    </div>
  );
}
