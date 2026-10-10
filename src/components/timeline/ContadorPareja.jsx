import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import pareja from "../../content/pareja.json";
import { rellenar, textosHistoria as t } from "../comun/textosHistoria";
import { formatearFecha, leerFecha, tiempoJuntos } from "./fechas";

/**
 * "Llevamos X años, X meses y X días", calculado con pareja.json -> fechaInicio.
 * La frase y las palabras (año/años...) salen de textosInterfaz.historia.
 * Si la fecha falta, es invalida o es futura, no se muestra.
 */
export default function ContadorPareja() {
  const inicio = leerFecha(pareja.fechaInicio);
  const tiempo = tiempoJuntos(inicio);
  if (!tiempo || !t.contador) return null;

  const unidades = t.unidades ?? {};
  // Parte la plantilla en texto y huecos {anios}/{meses}/{dias}.
  const trozos = t.contador.split(/(\{\w+\})/g).filter(Boolean);

  return (
    <motion.div
      className="mx-auto mb-14 w-fit max-w-full rounded-2xl border border-[var(--lib-dorado)]/30 bg-[var(--lib-papel)]/80 px-6 py-5 text-center shadow-sm"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <p className="lib-titulo text-balance text-xl leading-snug text-[var(--lib-tinta)] sm:text-2xl">
        {trozos.map((trozo, i) => {
          const clave = /^\{(\w+)\}$/.exec(trozo)?.[1];
          if (!clave || !(clave in tiempo)) return <span key={i}>{trozo}</span>;
          const valor = tiempo[clave];
          const [singular = "", plural = singular] = unidades[clave] ?? [];
          return (
            <span key={i} className="whitespace-nowrap">
              <Numero valor={valor} /> {valor === 1 ? singular : plural}
            </span>
          );
        })}
      </p>
      {t.contadorDesde ? (
        <p className="lib-mano mt-1 text-lg text-[var(--lib-tinta-suave)]">
          {rellenar(t.contadorDesde, { fecha: formatearFecha(inicio, t.idiomaFechas) })}
        </p>
      ) : null}
    </motion.div>
  );
}

/** Numero que sube desde 0 la primera vez que se ve. */
function Numero({ valor }) {
  const ref = useRef(null);
  const reducir = useReducedMotion();
  const visto = useInView(ref, { once: true });
  const cuenta = useMotionValue(reducir ? valor : 0);
  const redondo = useTransform(cuenta, (v) => Math.round(v));

  useEffect(() => {
    if (reducir) {
      cuenta.set(valor);
      return undefined;
    }
    if (!visto) return undefined;
    const control = animate(cuenta, valor, { duration: 1.4, ease: "easeOut" });
    return () => control.stop();
  }, [visto, valor, reducir, cuenta]);

  return (
    <motion.span ref={ref} className="font-bold tabular-nums text-[var(--lib-tapa)]">
      {redondo}
    </motion.span>
  );
}
