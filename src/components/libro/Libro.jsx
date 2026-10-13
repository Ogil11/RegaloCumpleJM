import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { tema } from "../../styles/tema";
import datos from "../../content/libro.json";
import pareja from "../../content/pareja.json";
import Cargando from "../comun/Cargando";
import Pagina from "./Pagina";
import { ProveedorLibro } from "./contexto";
import ControlesLibro from "./ControlesLibro";
import { entradasIndice } from "./indice";
import useSonidoPagina from "./useSonidoPagina";

/* Proporcion de UNA pagina y de la doble pagina abierta. */
const PROP = tema.libro.proporcionPagina;
const PROP_DOBLE = PROP * 2;

/* Ancho minimo de pagina que pasamos a page-flip. La libreria usa
   "ancho del bloque < minWidth * 2" para decidir si muestra una sola
   pagina, asi que este valor define el salto a modo celular. */
const MIN_PAGINA = 340;
const UMBRAL_DOBLE = MIN_PAGINA * 2 + 40; // 720px de bloque

/* Pantalla de carga: nunca mas de TOPE_CARGA ms aunque una foto tarde. */
const TOPE_CARGA = 8000;
const MINIMO_CARGA = 450;

/** Deja un numero par de hojas: showCover necesita portada y contraportada. */
function prepararPaginas(lista) {
  const paginas = Array.isArray(lista) ? [...lista] : [];
  if (paginas.length % 2 !== 0) {
    paginas.splice(paginas.length - 1, 0, { id: "__relleno", tipo: "relleno" });
  }
  return paginas;
}

/**
 * page-flip no tiene una forma de apagarse sin borrar nodos que maneja
 * React (su destroy() los quita del DOM). Asi que al salir del libro le
 * quitamos los listeners de la ventana y vaciamos su bucle de dibujo,
 * que si no seguiria corriendo para siempre, uno mas en cada visita.
 */
function apagarPageFlip(pf) {
  if (!pf) return;
  try {
    pf.getUI()?.removeHandlers();
    for (const evento of ["flip", "changeOrientation", "changeState", "init", "update"]) {
      pf.off(evento);
    }
    const render = pf.getRender();
    if (render) render.render = () => {};
  } catch {
    /* sin consecuencias */
  }
}

export default function Libro() {
  const libroRef = useRef(null);
  const areaRef = useRef(null);
  // Instancia de page-flip, para apagarla al desmontar (ver apagarPageFlip).
  const instanciaRef = useRef(null);

  const [area, setArea] = useState({ w: 0, h: 0 });
  const [paginaActual, setPaginaActual] = useState(0);
  const [orientacionLib, setOrientacionLib] = useState(null);
  const [iniciado, setIniciado] = useState(false);
  const [carga, setCarga] = useState({ listas: 0, total: 0, terminada: false });
  // Con "menos movimiento" la hoja pasa rapido en vez de curvarse despacio.
  const reducirMovimiento = useReducedMotion();

  const { silenciado, alternarSilencio, reproducir } = useSonidoPagina();

  const paginas = useMemo(() => prepararPaginas(datos.paginas), []);
  const total = paginas.length;
  const entradas = useMemo(() => entradasIndice(paginas), [paginas]);

  /* Titulo de la pestana: el "titulo" de libro.json mientras se lee. */
  useEffect(() => {
    if (!datos.titulo) return undefined;
    const anterior = document.title;
    document.title = datos.titulo;
    return () => {
      document.title = anterior;
    };
  }, []);

  /* Al salir del libro, apagar page-flip. */
  useEffect(
    () => () => {
      apagarPageFlip(instanciaRef.current);
      instanciaRef.current = null;
    },
    []
  );

  /* ---------- Medidas disponibles ---------- */
  useEffect(() => {
    const el = areaRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const observador = new ResizeObserver((entradasRO) => {
      const r = entradasRO[0]?.contentRect;
      if (!r) return;
      setArea({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  /* Cabe la doble pagina? Lo decidimos nosotros para que no haya
     tira y afloja con el calculo interno de page-flip. */
  const dobleCabe = area.w >= UMBRAL_DOBLE && area.h * PROP_DOBLE >= UMBRAL_DOBLE;
  const retrato = !dobleCabe;

  const anchoLibro = useMemo(() => {
    if (area.w <= 0 || area.h <= 0) return 0;
    const ancho = retrato
      ? Math.min(area.w, area.h * PROP, 560)
      : Math.min(area.w, area.h * PROP_DOBLE, 1180);
    return Math.max(0, Math.floor(ancho));
  }, [area.w, area.h, retrato]);

  /* ---------- Acciones (identidad estable) ---------- */
  const irSiguiente = useCallback(() => {
    try {
      libroRef.current?.pageFlip()?.flipNext();
    } catch {
      /* el libro aun no esta listo */
    }
  }, []);

  const irAnterior = useCallback(() => {
    try {
      libroRef.current?.pageFlip()?.flipPrev();
    } catch {
      /* el libro aun no esta listo */
    }
  }, []);

  const irA = useCallback((n) => {
    try {
      libroRef.current?.pageFlip()?.flip(n);
    } catch {
      /* el libro aun no esta listo */
    }
  }, []);

  const acciones = useMemo(
    () => ({ irSiguiente, irAnterior, irA }),
    [irSiguiente, irAnterior, irA]
  );

  /* ---------- Eventos de page-flip (identidad estable) ---------- */
  const alPasar = useCallback((e) => setPaginaActual(e.data), []);
  const alCambiarOrientacion = useCallback((e) => setOrientacionLib(e.data), []);
  const alIniciar = useCallback((e) => {
    // Si page-flip se recreo, apagar la instancia vieja antes de olvidarla.
    const pf = libroRef.current?.pageFlip() ?? null;
    if (instanciaRef.current && instanciaRef.current !== pf) apagarPageFlip(instanciaRef.current);
    instanciaRef.current = pf;
    setPaginaActual(e.data.page);
    setOrientacionLib(e.data.mode);
    setIniciado(true);
  }, []);

  /* ---------- Pantalla de carga ----------
     Espera las fotos de las primeras paginas (las que ya estan montadas
     por radioCarga) y las tipografias, con un tope por si algo tarda. */
  useEffect(() => {
    if (!iniciado || carga.terminada) return undefined;
    let vivo = true;
    const imagenes = [...(areaRef.current?.querySelectorAll("img") ?? [])];
    const pendientes = imagenes.filter((img) => !img.complete);
    let listas = imagenes.length - pendientes.length;
    setCarga((c) => ({ ...c, listas, total: imagenes.length }));

    const esperas = pendientes.map(
      (img) =>
        new Promise((resolver) => {
          const fin = () => {
            listas += 1;
            if (vivo) setCarga((c) => ({ ...c, listas }));
            resolver();
          };
          img.addEventListener("load", fin, { once: true });
          img.addEventListener("error", fin, { once: true });
        })
    );
    const fuentes = document.fonts?.ready ?? Promise.resolve();
    const espera = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

    Promise.all([Promise.race([Promise.all([...esperas, fuentes]), espera(TOPE_CARGA)]), espera(MINIMO_CARGA)]).then(() => {
      if (vivo) setCarga((c) => ({ ...c, terminada: true }));
    });
    return () => {
      vivo = false;
    };
  }, [iniciado, carga.terminada]);
  const listo = carga.terminada;
  const alCambiarEstado = useCallback(
    (e) => {
      if (e.data === "flipping") reproducir();
    },
    [reproducir]
  );

  /* page-flip solo recalcula al redimensionar la ventana, asi que le
     avisamos cuando cambiamos el ancho del libro por nuestra cuenta. */
  useEffect(() => {
    if (!anchoLibro) return undefined;
    const id = requestAnimationFrame(() => {
      try {
        libroRef.current?.pageFlip()?.update();
      } catch {
        /* sin consecuencias */
      }
    });
    return () => cancelAnimationFrame(id);
  }, [anchoLibro, retrato]);

  /* ---------- Teclado ---------- */
  useEffect(() => {
    const alTeclear = (e) => {
      if (e.defaultPrevented) return;
      const t = e.target;
      if (t?.closest?.("input, textarea, select, [contenteditable='true']")) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        irSiguiente();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        irAnterior();
      } else if (e.key === "Home") {
        e.preventDefault();
        irA(0);
      } else if (e.key === "End") {
        e.preventDefault();
        irA(total - 1);
      }
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [irSiguiente, irAnterior, irA, total]);

  /* ---------- Geometria del libro visible ----------
     Cerrado, page-flip dibuja la portada en la mitad DERECHA del
     bloque; en la ultima pagina, la contraportada en la IZQUIERDA.
     Desplazamos el conjunto para que el libro siempre quede centrado. */
  const orientacion = orientacionLib || (retrato ? "portrait" : "landscape");
  const esRetrato = orientacion === "portrait";
  const cerrado = paginaActual <= 0;
  const alFinal = paginaActual >= total - 1;
  const abierto = !cerrado && !alFinal;

  /* Usamos pixeles (no porcentajes): framer-motion no interpola bien
     de 0 a "-25%" y el desplazamiento se quedaba sin aplicar. */
  const mitad = Math.round(anchoLibro / 2);
  const desplazamiento = esRetrato ? 0 : cerrado ? -mitad / 2 : alFinal ? mitad / 2 : 0;
  const cajaLibro = esRetrato
    ? { left: 0, right: 0 }
    : cerrado
      ? { left: mitad, right: 0 }
      : alFinal
        ? { left: 0, right: mitad }
        : { left: 0, right: 0 };

  /* Grosor de los bloques de hojas a cada lado. */
  const leidas = Math.max(0, Math.min(paginaActual, total - 1)) / Math.max(1, total - 1);
  const grosorIzq = Math.round(tema.libro.grosorHojas * leidas);
  const grosorDer = Math.round(tema.libro.grosorHojas * (1 - leidas));

  /* ---------- Hojas (congeladas a proposito) ----------
     Con renderOnlyPageLengthChange react-pageflip no reinicia el libro
     en cada render. El estado llega a las paginas por el contexto. */
  const hojas = useMemo(
    () =>
      paginas.map((p, i) => (
        <Pagina key={p.id ?? i} pagina={p} indice={i} total={paginas.length} />
      )),
    [paginas]
  );

  return (
    <ProveedorLibro
      paginaActual={paginaActual}
      orientacion={orientacion}
      total={total}
      acciones={acciones}
    >
      <div
        className="lib-escena flex h-[100dvh] w-full flex-col overflow-hidden"
      >
        {/* ---------- Zona del libro ---------- */}
        <div
          ref={areaRef}
          className="relative flex min-h-0 flex-1 items-center justify-center px-2 py-3 sm:px-6"
        >
          {anchoLibro > 0 ? (
            <motion.div
              className="relative"
              style={{ width: anchoLibro }}
              initial={{ opacity: 0, scale: 0.94, y: 18, x: desplazamiento }}
              animate={listo ? { opacity: 1, scale: 1, y: 0, x: desplazamiento } : { opacity: 0, scale: 0.94, y: 18, x: desplazamiento }}
              transition={{
                opacity: { duration: 0.6, ease: "easeOut" },
                scale: { duration: 0.7, ease: "easeOut" },
                y: { duration: 0.7, ease: "easeOut" },
                // El recentrado ocurre al terminar de pasar la hoja:
                // corto, para que se sienta un ajuste y no un deslizamiento.
                x: { duration: 0.45, ease: "easeOut" },
              }}
            >
              {/* Sombra en la mesa */}
              <motion.div
                aria-hidden="true"
                className="lib-sombra-suelo pointer-events-none absolute -bottom-5 h-10"
                initial={false}
                animate={cajaLibro}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />

              {/* Cantos, lomo y grosor de la tapa */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 z-0"
                initial={false}
                animate={cajaLibro}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {/* Grosor de la tapa dura por detras */}
                <span
                  className="lib-tapa absolute rounded-[var(--lib-radio)]"
                  style={{
                    top: -6,
                    left: -6,
                    right: -6,
                    bottom: "calc(-1 * var(--lib-grosor-tapa))",
                    filter: "brightness(0.78)",
                  }}
                />

                {/* Bloque de hojas: canto izquierdo y derecho */}
                {!esRetrato && abierto ? (
                  <>
                    <motion.span
                      className="lib-canto-izq absolute inset-y-[1.5%] rounded-l-[3px]"
                      animate={{ width: grosorIzq, left: -grosorIzq }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    <motion.span
                      className="lib-canto-der absolute inset-y-[1.5%] rounded-r-[3px]"
                      animate={{ width: grosorDer, right: -grosorDer }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </>
                ) : null}

                {/* Lomo */}
                {!esRetrato ? (
                  abierto ? (
                    <span
                      className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-[var(--lib-lomo)] opacity-70"
                      style={{ width: "var(--lib-grosor-tapa)" }}
                    />
                  ) : (
                    <span
                      className={`absolute inset-y-[-6px] ${
                        cerrado ? "lib-lomo-der -left-[14px]" : "lib-lomo-izq -right-[14px]"
                      } rounded-[2px]`}
                      style={{ width: "calc(var(--lib-grosor-tapa) + 8px)" }}
                    />
                  )
                ) : null}
              </motion.div>

              {/* ---------- El libro ---------- */}
              <HTMLFlipBook
                ref={libroRef}
                className="relative z-10"
                /* La proporcion sale de width/height; el tamano real lo
                   da el ancho del contenedor por size="stretch". */
                width={720}
                height={Math.round(720 / PROP)}
                size="stretch"
                minWidth={MIN_PAGINA}
                maxWidth={1100}
                minHeight={320}
                maxHeight={1600}
                /* Tapa dura: primera y ultima hoja rigidas. */
                showCover
                usePortrait
                /* Curvatura, arrastre de esquina y sombra dinamica. */
                drawShadow
                maxShadowOpacity={tema.libro.opacidadSombra}
                flippingTime={reducirMovimiento ? 350 : tema.libro.tiempoPaso}
                showPageCorners
                useMouseEvents
                clickEventForward
                mobileScrollSupport
                swipeDistance={28}
                startZIndex={5}
                autoSize
                /* Evita que el libro se reinicie en cada render. */
                renderOnlyPageLengthChange
                onFlip={alPasar}
                onInit={alIniciar}
                onChangeOrientation={alCambiarOrientacion}
                onChangeState={alCambiarEstado}
              >
                {hojas}
              </HTMLFlipBook>
            </motion.div>
          ) : null}

          <AnimatePresence>
            {listo ? null : (
              <motion.div
                key="cargando"
                className="absolute inset-0 z-20 flex flex-col items-center justify-center"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Cargando texto={pareja.textosInterfaz?.cargandoLibro} className="h-full" />
                <BarraCarga listas={carga.listas} total={carga.total} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---------- Barra de navegacion ---------- */}
        <ControlesLibro
          paginaActual={paginaActual}
          total={total}
          retrato={esRetrato}
          entradas={entradas}
          silenciado={silenciado}
          onAnterior={irAnterior}
          onSiguiente={irSiguiente}
          onIr={irA}
          onAlternarSilencio={alternarSilencio}
        />
      </div>
    </ProveedorLibro>
  );
}

/** Barrita fina con las fotos ya cargadas. */
function BarraCarga({ listas, total }) {
  if (!total) return null;
  const porcentaje = Math.round((Math.min(listas, total) / total) * 100);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={porcentaje}
      className="absolute bottom-[22%] h-1.5 w-40 overflow-hidden rounded-full bg-[var(--lib-papel)]"
    >
      <div className="h-full rounded-full bg-[var(--lib-rosa)] transition-[width] duration-300" style={{ width: `${porcentaje}%` }} />
    </div>
  );
}
