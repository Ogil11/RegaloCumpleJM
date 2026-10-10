import { motion, useReducedMotion } from "framer-motion";
import usePantallaAncha from "../comun/usePantallaAncha";
import { textosHistoria as t } from "../comun/textosHistoria";
import IconoHito from "./IconoHito";
import MediaHito from "./MediaHito";
import { formatearFecha } from "./fechas";

/* Efectos de entrada al hacer scroll. Se reparten en orden
   (desliza, inclina, rebota...) o se eligen con "animacion" en timeline.json. */
export const EFECTOS = ["desliza", "inclina", "rebota"];

function variantesDe(efecto, lado, reducir) {
  if (reducir) {
    return { oculto: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } };
  }
  // lado: -1 viene desde la izquierda, 1 desde la derecha.
  switch (efecto) {
    case "inclina":
      return {
        oculto: { opacity: 0, y: 50, rotate: lado * 7 },
        visible: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring", stiffness: 80, damping: 13 } },
      };
    case "rebota":
      return {
        oculto: { opacity: 0, y: 60, scale: 0.86 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.45, duration: 0.9 } },
      };
    default:
      return {
        oculto: { opacity: 0, x: lado * 70 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
      };
  }
}

/** Rotaciones suaves para los marcos de foto, en orden. */
const ROTACIONES = [-2.2, 1.8, -1.2, 2.4];

/**
 * Un momento de la linea de tiempo.
 * En escritorio alterna izquierda/derecha de la linea; en celular va
 * siempre a la derecha. El nodo lleva el icono del momento.
 */
export default function Hito({ momento, fecha, posicion, onAbrirFoto }) {
  const reducir = useReducedMotion();
  const ancha = usePantallaAncha();
  const aLaIzquierda = ancha && posicion % 2 === 0;
  const efecto = EFECTOS.includes(momento.animacion) ? momento.animacion : EFECTOS[posicion % EFECTOS.length];
  const variantes = variantesDe(efecto, aLaIzquierda ? -1 : 1, reducir);
  const textoFecha = momento.fechaTexto || formatearFecha(fecha, t.idiomaFechas);

  return (
    <li className="relative pb-12 md:pb-16">
      {/* Nodo sobre la linea */}
      <motion.span
        className="absolute left-5 top-3 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--lib-papel)] text-[var(--lib-rosa)] shadow-md ring-2 ring-[var(--lib-dorado-claro)] md:left-1/2"
        initial={reducir ? false : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
      >
        <IconoHito nombre={momento.icono} className="h-5 w-5" />
      </motion.span>

      {/* En escritorio la fecha va al otro lado de la linea, a la altura del nodo */}
      {textoFecha ? (
        <motion.p
          className={`lib-mano absolute top-4 hidden text-2xl leading-none text-[var(--lib-tapa)] md:block ${
            aLaIzquierda ? "left-[calc(50%+2.25rem)]" : "right-[calc(50%+2.25rem)] text-right"
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {textoFecha}
        </motion.p>
      ) : null}

      <motion.article
        className={`relative ml-12 rounded-2xl border border-[var(--lib-papel-borde)] bg-[var(--lib-papel)] p-5 shadow-[0_8px_24px_-12px_var(--lib-sombra)] md:ml-0 md:w-[calc(50%-2.75rem)] ${
          aLaIzquierda ? "" : "md:ml-auto"
        }`}
        variants={variantes}
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* Piquito que apunta al nodo */}
        <span
          aria-hidden="true"
          className={`absolute top-6 h-3 w-3 rotate-45 bg-[var(--lib-papel)] ${
            aLaIzquierda
              ? "-right-[7px] border-r border-t border-[var(--lib-papel-borde)]"
              : "-left-[7px] border-b border-l border-[var(--lib-papel-borde)]"
          }`}
        />

        {textoFecha ? (
          <p className="lib-mano text-xl leading-none text-[var(--lib-tapa)] md:hidden">{textoFecha}</p>
        ) : null}
        <h3 className="lib-titulo mt-1 text-xl leading-snug text-[var(--lib-tinta)] md:mt-0">{momento.titulo}</h3>
        {momento.texto ? (
          <p className="lib-cuerpo mt-2 text-[15px] leading-relaxed text-[var(--lib-tinta-suave)]">{momento.texto}</p>
        ) : null}

        {momento.fotos.length || momento.video ? (
          <MediaHito
            fotos={momento.fotos}
            video={momento.video}
            poster={momento.poster}
            marco={momento.marco}
            rotacion={ROTACIONES[posicion % ROTACIONES.length]}
            onAbrir={onAbrirFoto}
          />
        ) : null}
      </motion.article>
    </li>
  );
}
