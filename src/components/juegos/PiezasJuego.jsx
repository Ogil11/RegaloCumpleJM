import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Filigrana } from "../libro/Adornos";
import { Reemplazo } from "../comun/FotoSegura";
import Imagen from "../comun/Imagen";
import CorazonNuestro from "../comun/CorazonNuestro";
import { textosJuegos as t } from "./datosJuegos";

/** Tarjeta de "¡Ganaste!": titulo, texto y botones (children). */
export function MensajeFinal({ titulo, texto, children }) {
  const caja = useRef(null);
  // En el celular el mensaje puede quedar debajo del tablero: lo trae a la vista.
  useEffect(() => {
    const t = setTimeout(() => caja.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 350);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div
      ref={caja}
      role="status"
      className="jue-tarjeta mx-auto w-full max-w-md px-6 py-7 text-center"
      initial={{ opacity: 0, scale: 0.9, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
    >
      <CorazonNuestro className="mx-auto flex h-11 w-11" />
      {titulo ? <h3 className="font-romantica mt-2 text-2xl text-[var(--lib-tinta)] sm:text-3xl">{titulo}</h3> : null}
      <Filigrana className="mx-auto mt-2 block h-3 w-28" />
      {texto ? (
        <p className="lib-cuerpo mt-3 whitespace-pre-line text-balance text-[var(--lib-tinta-suave)]">{texto}</p>
      ) : null}
      {children ? <div className="mt-5 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </motion.div>
  );
}

/** Aviso cuando un juego no trae contenido en juegos.json. */
export function SinContenido({ texto = t.sinContenido }) {
  return <p className="lib-mano py-10 text-center text-2xl text-[var(--lib-tinta-suave)]">{texto}</p>;
}

/** Linea de marcadores (intentos, progreso...). */
export function Marcadores({ children }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-sm text-[var(--lib-tinta)]">{children}</div>
  );
}

export function Marcador({ children }) {
  return <span className="jue-chip px-3 py-1">{children}</span>;
}

/**
 * Foto que llena su caja. Si falta el archivo, sale el recuadro de
 * REEMPLAZAR con una `etiqueta` grande (un numero, por ejemplo) para
 * que el juego se pueda jugar aunque todavia no haya fotos.
 */
export function FotoJuego({ src, alt = "", etiqueta, className = "" }) {
  return <FotoCargando key={src || "sin-foto"} src={src} alt={alt} etiqueta={etiqueta} className={className} />;
}

function FotoCargando({ src, alt, etiqueta, className }) {
  const [estado, setEstado] = useState(src ? "cargando" : "error");
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {estado === "error" ? (
        <div className="absolute inset-0">
          <Reemplazo compacto />
          {etiqueta != null ? (
            <span className="lib-titulo absolute inset-x-0 bottom-[12%] text-center text-2xl font-bold text-[var(--lib-tapa)] sm:text-3xl">
              {etiqueta}
            </span>
          ) : null}
        </div>
      ) : null}
      {src && estado !== "error" ? (
        <Imagen
          src={src}
          sizes="(min-width: 640px) 180px, 30vw"
          alt={alt}
          decoding="async"
          draggable="false"
          onLoad={() => setEstado("ok")}
          onError={() => setEstado("error")}
          className={`h-full w-full select-none object-cover transition-opacity duration-300 ${
            estado === "ok" ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}
    </div>
  );
}
