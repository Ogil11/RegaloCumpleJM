import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import pareja from "../../content/pareja.json";
import { Filigrana } from "../libro/Adornos";
import CorazonNuestro from "./CorazonNuestro";
import { normalizarClave, PREFIJO_HUELLA } from "./clave";
import { iniciarMusica } from "./musica";

/**
 * Pantalla de entrada: el nombre y un boton "Entrar".
 * - El clic en "Entrar" es el gesto que los navegadores piden para
 *   dejar sonar la musica de fondo.
 * - Si pareja.json -> claveAcceso tiene algo, primero pide esa
 *   respuesta (pareja.json -> preguntaAcceso). Vacia, no se pide.
 * Se muestra una vez por visita (pestana); la clave se recuerda en el
 * navegador hasta que la cambies en pareja.json.
 */

const textos = pareja.textosInterfaz?.entrada ?? {};
const textosAcceso = pareja.textosInterfaz?.acceso ?? {};
const CLAVE = pareja.claveAcceso || "";
const VISTA = "entrada:vista";
const ACCESO = "acceso:ok";

function leer(almacen, clave) {
  try {
    return almacen.getItem(clave);
  } catch {
    return null;
  }
}

function guardar(almacen, clave, valor) {
  try {
    almacen.setItem(clave, valor);
  } catch {
    /* modo privado: se volvera a pedir */
  }
}

/** true si en esta pestana ya se entro (y, si hay clave, ya se acerto). */
export function entradaYaVista() {
  if (CLAVE && leer(localStorage, ACCESO) !== CLAVE) return false;
  return leer(sessionStorage, VISTA) === "1";
}

async function huella(texto) {
  const datos = new TextEncoder().encode(texto);
  const resumen = await crypto.subtle.digest("SHA-256", datos);
  return [...new Uint8Array(resumen)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Compara con la clave de pareja.json. Al publicar, la clave llega como huella SHA-256. */
async function esCorrecta(intento) {
  const limpio = normalizarClave(intento);
  if (!limpio) return false;
  if (CLAVE.startsWith(PREFIJO_HUELLA)) {
    if (!globalThis.crypto?.subtle) return false;
    return PREFIJO_HUELLA + (await huella(limpio)) === CLAVE;
  }
  return limpio === normalizarClave(CLAVE);
}

const contenedor = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
};
const elemento = {
  oculto: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Entrada({ onEntrar }) {
  const pideClave = Boolean(CLAVE) && leer(localStorage, ACCESO) !== CLAVE;

  const entrar = () => {
    // Dentro del clic: asi el navegador deja sonar la musica.
    iniciarMusica();
    guardar(sessionStorage, VISTA, "1");
    if (CLAVE) guardar(localStorage, ACCESO, CLAVE);
    onEntrar();
  };

  return (
    <motion.main
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-4 py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <CorazonesFlotantes />

      <motion.div
        className="relative z-10 flex w-full max-w-md flex-col items-center"
        variants={contenedor}
        initial="oculto"
        animate="visible"
      >
        <motion.div variants={elemento}>
          <CorazonNuestro className="mb-5 h-14 w-14" />
        </motion.div>
        <motion.h1 variants={elemento} className="font-romantica text-balance text-4xl text-[var(--lib-tinta)] sm:text-6xl">
          {pareja.nombre}
        </motion.h1>
        <motion.div variants={elemento}>
          <Filigrana className="mt-4 h-3 w-40" />
        </motion.div>

        {pideClave ? (
          <FormularioClave onCorrecta={entrar} />
        ) : (
          <motion.div variants={elemento} className="mt-10 flex flex-col items-center gap-3">
            <button type="button" className="jue-boton min-w-40 text-lg" onClick={entrar} autoFocus>
              {textos.boton}
            </button>
            {pareja.musicaFondo && textos.sugerencia ? (
              <p className="lib-mano text-lg text-[var(--lib-tinta-suave)]">{textos.sugerencia}</p>
            ) : null}
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  );
}

function FormularioClave({ onCorrecta }) {
  const id = useId();
  const [valor, setValor] = useState("");
  const [error, setError] = useState(false);
  const [comprobando, setComprobando] = useState(false);
  // Se comprueba mientras se escribe, asi al pulsar "Entrar" la respuesta
  // ya se sabe y la musica puede arrancar dentro del mismo clic.
  const [acierto, setAcierto] = useState({ valor: "", ok: false });
  const vivo = useRef(true);

  useEffect(() => {
    vivo.current = true;
    let vigente = true;
    esCorrecta(valor).then((ok) => {
      if (vigente) setAcierto({ valor, ok });
    });
    return () => {
      vigente = false;
      vivo.current = false;
    };
  }, [valor]);

  const enviar = async (e) => {
    e.preventDefault();
    if (acierto.valor === valor) {
      if (acierto.ok) onCorrecta();
      else setError(true);
      return;
    }
    // Se pulso Entrar antes de terminar la comprobacion (por ejemplo al pegar).
    setComprobando(true);
    const ok = await esCorrecta(valor);
    if (!vivo.current) return;
    setComprobando(false);
    if (ok) onCorrecta();
    else setError(true);
  };

  return (
    <motion.form variants={elemento} onSubmit={enviar} className="mt-8 flex w-full flex-col items-center gap-4" noValidate>
      {pareja.preguntaAcceso ? (
        <label htmlFor={id} className="lib-mano text-balance text-2xl leading-snug text-[var(--lib-tinta)]">
          {pareja.preguntaAcceso}
        </label>
      ) : null}
      <input
        id={id}
        type="text"
        value={valor}
        onChange={(e) => {
          setValor(e.target.value);
          setError(false);
        }}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
        autoFocus
        aria-label={pareja.preguntaAcceso ? undefined : textosAcceso.etiqueta}
        placeholder={textosAcceso.etiqueta}
        aria-invalid={error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="ent-campo w-full max-w-xs"
      />
      <p id={`${id}-error`} role="alert" className="lib-cuerpo min-h-[1.5rem] text-sm text-[var(--lib-tapa)]">
        {error ? textosAcceso.error : ""}
      </p>
      <button type="submit" className="jue-boton min-w-40 text-lg" disabled={!valor.trim() || comprobando}>
        {comprobando ? textosAcceso.comprobando : textosAcceso.entrar}
      </button>
    </motion.form>
  );
}

/** Corazones que suben despacio por el fondo. Solo adorno. */
const CORAZONES = [
  { x: "8%", tam: 18, dur: 16, retraso: 0 },
  { x: "22%", tam: 12, dur: 19, retraso: 4 },
  { x: "38%", tam: 22, dur: 21, retraso: 9 },
  { x: "55%", tam: 14, dur: 17, retraso: 2 },
  { x: "70%", tam: 20, dur: 20, retraso: 7 },
  { x: "84%", tam: 12, dur: 15, retraso: 11 },
  { x: "93%", tam: 16, dur: 22, retraso: 5 },
];

function CorazonesFlotantes() {
  return (
    <div aria-hidden="true" className="ent-corazones pointer-events-none absolute inset-0">
      {CORAZONES.map((c, i) => (
        <span
          key={i}
          className="ent-corazon"
          style={{ left: c.x, width: c.tam, height: c.tam, animationDuration: `${c.dur}s`, animationDelay: `-${c.retraso}s` }}
        >
          <CorazonNuestro className="h-full w-full" />
        </span>
      ))}
    </div>
  );
}
