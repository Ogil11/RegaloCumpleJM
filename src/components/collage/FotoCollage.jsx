import { motion, useReducedMotion } from "framer-motion";
import { WashiTape } from "../libro/Adornos";
import FotoSegura from "../comun/FotoSegura";
import { textosHistoria as t } from "../comun/textosHistoria";

/* Si la foto no dice "marco" ni "rotacion" en collage.json, se reparten en orden. */
export const MARCOS = ["polaroid", "cinta", "recorte"];
const ROTACIONES = [-3, 2.2, -1.6, 3.2, -2.4, 1.4];

/**
 * Una foto del collage con su marco (polaroid, cinta o recorte),
 * inclinada. Al pasar el mouse o tocarla se levanta y se endereza.
 * `compacto` (forma de corazon) oculta el pie para que quepa.
 */
export default function FotoCollage({ foto, posicion, compacto = false, onAbrir, className = "", style }) {
  const reducir = useReducedMotion();
  const marco = MARCOS.includes(foto.marco) ? foto.marco : MARCOS[posicion % MARCOS.length];
  const rotacion = typeof foto.rotacion === "number" ? foto.rotacion : ROTACIONES[posicion % ROTACIONES.length];
  const levantar = reducir ? undefined : { rotate: 0, scale: 1.06, y: -8 };

  return (
    <motion.div
      className={`relative hover:z-20 focus-within:z-20 ${className}`}
      style={style}
      initial={reducir ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: (posicion % 4) * 0.07 }}
    >
      <motion.button
        type="button"
        onClick={onAbrir}
        aria-label={`${t.verFoto}: ${foto.alt || foto.pie || ""}`}
        className="group block h-full w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--lib-rosa)]"
        style={{ rotate: rotacion }}
        whileHover={levantar}
        whileFocus={levantar}
        whileTap={levantar}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        {marco === "polaroid" ? (
          <span className="lib-polaroid hist-levanta flex h-full flex-col rounded-[2px] p-[6%] pb-[3%]">
            <FotoSegura src={foto.src} alt={foto.alt} compacto={compacto} className="min-h-0 w-full flex-1 bg-[var(--lib-papel-alterno)]" />
            {foto.pie && !compacto ? (
              <span className="lib-mano block truncate px-1 pt-1 text-center text-base leading-tight text-[var(--lib-tinta)] sm:text-lg">
                {foto.pie}
              </span>
            ) : null}
          </span>
        ) : null}

        {marco === "cinta" ? (
          <span className="hist-marco-cinta hist-levanta relative block h-full rounded-[2px] p-1.5">
            <WashiTape className="-top-2.5 left-1/2 z-10 h-5 w-[42%] -translate-x-1/2" indice={posicion} rotacion={posicion % 2 ? 4 : -4} />
            <FotoSegura src={foto.src} alt={foto.alt} compacto={compacto} className="h-full w-full bg-[var(--lib-papel-alterno)]" />
          </span>
        ) : null}

        {marco === "recorte" ? (
          <span className="hist-recorte-sombra block h-full">
            <span className="hist-recorte block h-full bg-[var(--lib-marco-polaroid)] p-[5px]">
              <FotoSegura src={foto.src} alt={foto.alt} compacto={compacto} className="h-full w-full bg-[var(--lib-papel-alterno)]" />
            </span>
          </span>
        ) : null}
      </motion.button>
    </motion.div>
  );
}
