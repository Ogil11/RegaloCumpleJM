import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { tema } from "../../styles/tema";
import CorazonNuestro, { corazonPareja } from "../comun/CorazonNuestro";

const COLORES = [
  "var(--lib-rosa)",
  "var(--lib-dorado)",
  "var(--lib-tapa-clara)",
  "var(--lib-rosa-claro)",
  "var(--lib-salvia)",
];
const CORAZON =
  "M12 21s-7.5-4.7-9.4-9.1C1.1 8.3 3 4.8 6.4 4.1c2.2-.5 4.3.6 5.6 2.4 1.3-1.8 3.4-2.9 5.6-2.4 3.4.7 5.3 4.2 3.8 7.8C19.5 16.3 12 21 12 21z";

function crearPiezas(cantidad) {
  return Array.from({ length: cantidad }, (_, i) => ({
    id: i,
    // Mitad corazones y mitad confeti (si los corazones estan apagados en tema.js, todo confeti).
    corazon: tema.decoraciones.corazones && i % 2 === 0,
    x: Math.random() * 100,
    deriva: (Math.random() - 0.5) * 30,
    tamano: 10 + Math.random() * 14,
    giro: (Math.random() - 0.5) * 540,
    retraso: Math.random() * 0.8,
    duracion: 2.4 + Math.random() * 1.6,
    color: COLORES[i % COLORES.length],
  }));
}

/**
 * Lluvia ligera de corazones y confeti. Cambia `disparo` (1, 2, 3...)
 * para lanzarla otra vez; con 0 no se muestra nada.
 */
export default function Celebracion({ disparo }) {
  if (!disparo) return null;
  return createPortal(<Lluvia key={disparo} />, document.body);
}

function Lluvia() {
  const reducir = useReducedMotion();
  const [piezas] = useState(() => crearPiezas(reducir ? 8 : 36));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 4800);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {piezas.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 block"
          style={{ left: `${p.x}%`, width: p.tamano, height: p.corazon ? p.tamano : p.tamano * 0.45 }}
          initial={reducir ? { opacity: 0, y: "40vh", scale: 0.6 } : { y: "-8vh", x: 0, rotate: 0, opacity: 1 }}
          animate={
            reducir
              ? { opacity: [0, 1, 0], scale: 1 }
              : { y: "108vh", x: `${p.deriva}vw`, rotate: p.giro, opacity: [1, 1, 0.9, 0] }
          }
          transition={{ duration: reducir ? 1.6 : p.duracion, delay: p.retraso, ease: "easeIn" }}
        >
          {p.corazon && corazonPareja ? (
            <CorazonNuestro className="h-full w-full" />
          ) : p.corazon ? (
            <svg viewBox="0 0 24 24" className="h-full w-full">
              <path d={CORAZON} fill={p.color} />
            </svg>
          ) : (
            <span className="block h-full w-full rounded-[2px]" style={{ backgroundColor: p.color }} />
          )}
        </motion.span>
      ))}
    </div>
  );
}
