/**
 * TEMA DEL LIBRO
 * ------------------------------------------------------------------
 * Este es el ÚNICO archivo que hay que editar para cambiar el aspecto
 * del libro: colores, tipografías, grosor de la tapa y adornos.
 *
 * Todo lo de abajo se convierte en variables CSS (--lib-*) que usan
 * los estilos de src/styles/libro.css y los componentes.
 *
 * Tema actual: "scrapbook cálido" (papel crema, rosa y dorado).
 */

export const tema = {
  nombre: "scrapbook-calido",

  /* ---------- TIPOGRAFÍAS ----------
   * Si cambias de fuentes, cambia también la URL de googleFonts.
   * Deja siempre una fuente de respaldo del sistema al final.       */
  fuentes: {
    titulos: '"Playfair Display", Georgia, "Times New Roman", serif',
    manuscrita: '"Caveat", "Segoe Script", "Bradley Hand", cursive',
    texto: '"Lora", Georgia, "Times New Roman", serif',
    googleFonts:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Caveat:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap",
  },

  /* ---------- COLORES ---------- */
  colores: {
    // Fondo detrás del libro (la "mesa")
    fondo: "#efdfd0",
    fondoProfundo: "#dcc3b1",

    // Papel de las páginas
    papel: "#fdf6e7",
    papelAlterno: "#f9eedb",
    papelBorde: "#e6d4b8",

    // Tinta (textos)
    tinta: "#4a3328",
    tintaSuave: "#8a6f5f",

    // Acentos
    rosa: "#d4809c",
    rosaClaro: "#f5d8e2",
    dorado: "#c19a3d",
    doradoClaro: "#ecd9a4",
    verdeSalvia: "#aebfa8",

    // Tapa dura y lomo
    tapa: "#8e3a52",
    tapaOscura: "#5c2234",
    tapaClara: "#a9485f",
    tapaFilete: "#d8b35c",
    lomo: "#6b2838",
    // Letras claras sobre la tapa (titulo, autor, boton de abrir)
    textoTapa: "#fdf3e2",

    // Papeles especiales
    papelCarta: "#fffdf4",
    marcoPolaroid: "#fffdf6",

    // Sombras. Las sombras del papel se calculan a partir de sombraBase
    // (cafe, para que no se vean grises); las de la tapa, de sombraTapa.
    sombra: "rgba(74, 40, 28, 0.35)",
    sombraPliegue: "rgba(74, 40, 28, 0.26)",
    sombraBase: "#4a281c",
    sombraTapa: "#000000",
    // Brillo blanco de la luz sobre el papel y las cintas
    brillo: "#ffffff",
  },

  /* ---------- GEOMETRÍA Y COMPORTAMIENTO ---------- */
  libro: {
    // Proporción de UNA página (ancho / alto). Más bajo = página más
    // alta y estrecha, que llena mejor la pantalla de un celular.
    proporcionPagina: 0.68,
    // Grosor visible de la tapa dura, en píxeles.
    grosorTapa: 12,
    // Grosor máximo del bloque de hojas en cada lado, en píxeles.
    grosorHojas: 20,
    radioEsquina: 8,
    // Duración de la animación de paso de página, en milisegundos.
    tiempoPaso: 900,
    // Intensidad de la sombra que se dibuja al pasar la hoja (0 a 1).
    opacidadSombra: 0.55,
    // Cuántas páginas alrededor de la actual cargan fotos y videos.
    // Más alto = más fluido al pasar, pero más memoria.
    radioCarga: 2,
    // Volumen del sonido de papel (0 a 1).
    volumenSonido: 0.35,
  },

  /* ---------- ADORNOS ----------
   * Ponlos en false para un libro más sobrio.                       */
  decoraciones: {
    corazones: true,
    flores: true,
    washiTape: true,
    texturaPapel: true,
    esquinasFoto: true,
    // Linea dorada con un corazon que separa titulos y textos.
    filigrana: true,
    // Colores de las cintas washi, se van alternando.
    coloresWashi: ["#f5d8e2", "#ecd9a4", "#cfe0d2"],
  },

  /* ---------- SONIDO ----------
   * Si el archivo no existe, el libro funciona igual y en silencio.  */
  sonidoPagina: "/audio/pagina.mp3",

  /* ---------- MÚSICA DE FONDO ----------
   * La canción se elige en pareja.json (musicaFondo).               */
  volumenMusica: 0.4,
};

/** Convierte el tema en variables CSS para aplicarlas con style={}. */
export function variablesTema(t = tema) {
  return {
    "--lib-fuente-titulos": t.fuentes.titulos,
    "--lib-fuente-manuscrita": t.fuentes.manuscrita,
    "--lib-fuente-texto": t.fuentes.texto,

    "--lib-fondo": t.colores.fondo,
    "--lib-fondo-profundo": t.colores.fondoProfundo,
    "--lib-papel": t.colores.papel,
    "--lib-papel-alterno": t.colores.papelAlterno,
    "--lib-papel-borde": t.colores.papelBorde,
    "--lib-tinta": t.colores.tinta,
    "--lib-tinta-suave": t.colores.tintaSuave,
    "--lib-rosa": t.colores.rosa,
    "--lib-rosa-claro": t.colores.rosaClaro,
    "--lib-dorado": t.colores.dorado,
    "--lib-dorado-claro": t.colores.doradoClaro,
    "--lib-salvia": t.colores.verdeSalvia,
    "--lib-tapa": t.colores.tapa,
    "--lib-tapa-oscura": t.colores.tapaOscura,
    "--lib-tapa-clara": t.colores.tapaClara,
    "--lib-tapa-filete": t.colores.tapaFilete,
    "--lib-lomo": t.colores.lomo,
    "--lib-sombra": t.colores.sombra,
    "--lib-sombra-pliegue": t.colores.sombraPliegue,
    "--lib-sombra-base": t.colores.sombraBase,
    "--lib-sombra-tapa": t.colores.sombraTapa,
    "--lib-brillo": t.colores.brillo,
    "--lib-texto-tapa": t.colores.textoTapa,
    "--lib-papel-carta": t.colores.papelCarta,
    "--lib-marco-polaroid": t.colores.marcoPolaroid,

    "--lib-grosor-tapa": `${t.libro.grosorTapa}px`,
    "--lib-radio": `${t.libro.radioEsquina}px`,
  };
}

/** Carga las fuentes del tema una sola vez. */
export function aplicarFuentesTema(t = tema) {
  if (typeof document === "undefined") return;
  const url = t.fuentes.googleFonts;
  if (!url || document.querySelector(`link[data-tema-libro="${t.nombre}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  link.dataset.temaLibro = t.nombre;
  document.head.appendChild(link);
}

/**
 * Aplica el tema a TODA la app: variables --lib-* en <html> y fuentes.
 * Asi el fondo, la tinta y la fuente romantica (font-romantica) del
 * Inicio, Juegos e Historia salen del mismo tema que el libro.
 */
export function aplicarTemaGlobal(t = tema) {
  if (typeof document === "undefined") return;
  const raiz = document.documentElement;
  for (const [nombre, valor] of Object.entries(variablesTema(t))) {
    raiz.style.setProperty(nombre, valor);
  }
  aplicarFuentesTema(t);
}

export default tema;
