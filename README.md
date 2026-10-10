# Regalo — base del proyecto

App web romántica hecha con **React + Vite**, **Tailwind CSS**, **Framer Motion**, **react-router-dom** y **react-pageflip**.

Estado actual:

- **Inicio (`/`)** — las 3 tarjetas, funcionando.
- **Libro (`/libro`)** — terminado: libro digital con tapa dura, curvatura al pasar la hoja, arrastre de esquina, sonido de papel e índice. Ver el **[capítulo 5](#5-el-libro-página-por-página)**.
- **Juegos (`/juegos`)** y **Nuestra historia (`/historia`)** — todavía solo muestran su título y el botón **Volver al inicio**.
- **Música de fondo** — opcional, suena en todas las pantallas y tiene su botón de silencio arriba a la derecha.

Todo lo que se ve en pantalla se lee de `src/content/*.json`: los textos (incluidos los de botones y avisos) y las rutas de fotos, videos y música. Los colores y tipografías salen de `src/styles/tema.js`.

---

## 1. Cómo correrlo

```bash
npm install     # solo la primera vez
npm run dev     # abre http://localhost:5173
npm run build   # versión final para publicar
```

---

## 2. Regla de oro

**Nunca escribas textos ni rutas de fotos dentro del código.**
Todo lo que se ve en pantalla (nombres, frases, fechas, fotos, videos, música, y también los textos de botones como "Abrir el libro" o "Volver al inicio") vive en `src/content/*.json`.
Si quieres cambiar algo que se ve, cambia un JSON — no un `.jsx`. Si quieres cambiar un color o una tipografía, cambia `src/styles/tema.js`.

---

## 3. Dónde va cada archivo multimedia

Todo lo multimedia va en `public/`. Lo que pongas ahí se sirve desde la raíz del sitio:
un archivo en `public/fotos/ana.jpg` se escribe en el JSON como `/fotos/ana.jpg` (con `/` al inicio, sin `public`).

| Carpeta | Qué guardas ahí | Cómo lo escribes en el JSON |
|---|---|---|
| `public/fotos/` | Fotos del collage, del timeline y de los juegos. También videos cortos. | `/fotos/nombre.jpg`, `/fotos/nombre.mp4` |
| `public/libro/` | Las imágenes **y los videos** que van **dentro del libro** (fotos, dibujos, portada, videos y sus imágenes de portada). | `/libro/nombre.jpg`, `/libro/nombre.mp4` |
| `public/audio/` | Música de fondo, notas de voz y el sonido de pasar página (`pagina.mp3`). | `/audio/nombre.mp3` |

Consejos:
- Usa nombres **sin espacios ni tildes**: `primer-viaje.jpg`, no `Primer Viaje ñ.jpg`.
- Formatos recomendados: fotos `.jpg` o `.webp`, video `.mp4`, audio `.mp3`.
- Los archivos `.gitkeep` en esas carpetas solo existen para que las carpetas no se borren. **No los toques.**

---

## 4. Los archivos de contenido, uno por uno

Todos están en `src/content/`. Cada uno trae **2-3 entradas de EJEMPLO** marcadas con la palabra `EJEMPLO`.
Borra las de ejemplo y pon las tuyas, respetando el formato. La clave `_ejemplo` es solo una nota para ti: puedes borrarla.

### `src/content/pareja.json` — datos generales
Lo usan el **Inicio**, los títulos de **Juegos** e **Historia**, el botón **Volver al inicio** y la **música de fondo**.

```json
{
  "nombre": "Juli",
  "frase": "La frase que resume lo que sientes.",
  "fechaInicio": "2023-01-01",
  "fotoPortada": "/fotos/portada.jpg",
  "fotoPortadaAlt": "Nosotros dos en la playa",
  "musicaFondo": "/audio/nuestra-cancion.mp3",
  "secciones": {
    "tarjetas": [
      { "titulo": "Juegos", "descripcion": "Trivia, memoria y cartas.", "ruta": "/juegos" },
      { "titulo": "Nuestra historia", "descripcion": "Cómo llegamos aquí.", "ruta": "/historia" },
      { "titulo": "Libro", "descripcion": "Para hojear despacio.", "ruta": "/libro" }
    ],
    "juegos": { "titulo": "Juegos" },
    "historia": { "titulo": "Nuestra historia" }
  },
  "textosInterfaz": {
    "volverInicio": "Volver al inicio",
    "activarMusica": "Activar música",
    "silenciarMusica": "Silenciar música"
  }
}
```

| Campo | Qué es |
|---|---|
| `nombre` | Nombre que aparece grande en el Inicio. |
| `frase` | Frase bajo el nombre en el Inicio. |
| `fechaInicio` | Fecha en que empezaron, formato `AAAA-MM-DD`. |
| `fotoPortada` | Foto redonda sobre el nombre en el Inicio. Archivo en `public/fotos/`. Si la dejas como `""` o el archivo no existe, simplemente no sale. |
| `fotoPortadaAlt` | Descripción corta de esa foto (accesibilidad). |
| `musicaFondo` | Canción de fondo, en bucle, en todas las pantallas. Archivo en `public/audio/`. Si la dejas como `""` o el archivo no existe, no suena nada y el botón de música no aparece. |
| `secciones.tarjetas` | Las 3 tarjetas del Inicio: `titulo`, `descripcion` (línea pequeña, opcional) y `ruta` (no la cambies). |
| `secciones.juegos.titulo`, `secciones.historia.titulo` | Título grande de cada una de esas pantallas. |
| `textosInterfaz` | Textos del botón **Volver al inicio** y del botón de música (lo que lee un lector de pantalla y sale al pasar el mouse). |

Sobre la música: los navegadores no dejan que una página suene sola antes de que la toques. Si no arranca al entrar, empezará con el primer clic o tecla. El botón de la nota musical la silencia o la reanuda, y recuerda tu elección.

### `src/content/timeline.json` — la línea de tiempo
Una entrada por momento importante. Van en la página **Nuestra historia**.

```json
{
  "momentos": [
    {
      "id": 1,
      "fecha": "2023-01-01",
      "titulo": "El día que nos conocimos",
      "texto": "Lo que pasó ese día.",
      "foto": "/fotos/conocernos.jpg",
      "video": ""
    }
  ]
}
```

| Campo | Qué es |
|---|---|
| `id` | Número único. No repitas ninguno. |
| `fecha` | `AAAA-MM-DD`. Sirve para ordenar los momentos. |
| `titulo` | Título corto del momento. |
| `texto` | El relato. Puede ser largo. |
| `foto` | Imagen del momento, de `public/fotos/`. |
| `video` | Opcional. Un `.mp4` de `public/fotos/`. Déjalo como `""` si no hay video. |

### `src/content/collage.json` — las fotos del collage
Una entrada por foto. Va en la página **Nuestra historia**.

```json
{
  "fotos": [
    {
      "id": 1,
      "src": "/fotos/playa.jpg",
      "alt": "Nosotros en la playa",
      "pie": "Ese atardecer."
    }
  ]
}
```

| Campo | Qué es |
|---|---|
| `id` | Número único. |
| `src` | Ruta de la foto en `public/fotos/`. |
| `alt` | Descripción corta (accesibilidad y si la foto no carga). |
| `pie` | Texto que se muestra con la foto. Puede ir vacío: `""`. |

### `src/content/libro.json` — el libro que se hojea
Es el archivo más grande y tiene su propio capítulo: **[5. El libro, página por página](#5-el-libro-página-por-página)**.

### `src/content/juegos.json` — los juegos
Cada objeto de `juegos` es un juego. El campo `tipo` define cómo se juega.

```json
{
  "juegos": [
    {
      "id": 1,
      "tipo": "trivia",
      "titulo": "¿Cuánto me conoces?",
      "descripcion": "Preguntas sobre nosotros.",
      "preguntas": [
        {
          "pregunta": "¿Dónde fue nuestra primera cita?",
          "opciones": ["En el cine", "En el parque", "En tu casa"],
          "respuestaCorrecta": 1
        }
      ]
    }
  ]
}
```

Campos comunes a todos los juegos:

| Campo | Qué es |
|---|---|
| `id` | Número único. |
| `tipo` | `"trivia"`, `"memoria"` o `"cartas"`. |
| `titulo` | Nombre del juego en la tarjeta. |
| `descripcion` | Línea corta que explica el juego. |

Campos según el `tipo`:

- **`trivia`** → `preguntas`: lista de `{ pregunta, opciones, respuestaCorrecta }`.
  `respuestaCorrecta` es la **posición** de la opción correcta empezando en **0**
  (`0` = la primera, `1` = la segunda, `2` = la tercera).
- **`memoria`** → `fotos`: lista de rutas de `public/fotos/`. Cada foto se duplica para formar la pareja.
- **`cartas`** → `cartas`: lista de `{ titulo, texto }`. Cada una es una carta que se abre.

---

## 5. El libro, página por página

El libro vive en `/libro` y se construye entero desde **`src/content/libro.json`**.
El aspecto (colores, tipografías, adornos) se cambia desde **`src/styles/tema.js`**.

### 5.1 La forma del archivo

```json
{
  "titulo": "Nuestra historia",
  "textosInterfaz": { "abrirLibro": "Abrir el libro", "indice": "Índice", "...": "..." },
  "paginas": [
    { "id": 1, "tipo": "portada", "titulo": "..." },
    { "id": 2, "tipo": "dedicatoria", "texto": "..." }
  ]
}
```

- **`titulo`** es el título de la pestaña del navegador mientras se lee el libro.
- **`textosInterfaz`** son los textos de los botones y avisos del libro. Cámbialos si quieres otras palabras; no borres ninguna clave:

| Clave | Dónde sale |
|---|---|
| `abrirLibro` | Botón de la portada. |
| `indice` | Botón del menú de capítulos. |
| `inicio` | Botón para salir del libro. |
| `portada`, `fin` | Lo que dice el contador de páginas con el libro cerrado al principio y al final. |
| `paginaAnterior`, `paginaSiguiente` | Flechas de la barra (lector de pantalla). |
| `activarSonido`, `silenciarSonido` | Botón del sonido de papel (lector de pantalla). |
| `reemplazar`, `faltaFoto`, `fotoNoEncontrada`, `faltaVideo`, `videoNoEncontrado` | Avisos que salen en lugar de una foto o un video que falta. |

Reglas que no puedes saltarte:

- **Cada página necesita `id` único y `tipo`.** El `tipo` decide cómo se dibuja.
- **La primera página debe ser `"portada"` y la última `"contraportada"`.** Son las tapas duras.
- **Deja un número par de páginas.** Si pones un número impar, el libro mete una hoja en blanco antes del final para cuadrar las parejas. No es un error, pero queda más limpio si cuadras tú.
- **Si un campo no lo quieres, bórralo o déjalo como `""`.** No se dibuja nada.
- **Las fotos que no existan** salen con un recuadro rosa punteado que dice `REEMPLAZAR` y la ruta que falta. Así sabes exactamente qué archivo te falta.

### 5.2 Campos comunes a cualquier página

| Campo | Qué hace |
|---|---|
| `id` | Número único. Obligatorio. |
| `tipo` | Uno de los 11 tipos de la tabla de abajo. Obligatorio. |
| `indice` | Si lo pones, esta página aparece en el menú **Índice** con ese texto. Si no lo pones, no sale en el índice (salvo los separadores, que salen con su `titulo`). |
| `dura` | `true` convierte la hoja en cartulina rígida, que se pasa como una tapa en vez de curvarse. |

### 5.3 Los 11 tipos de página

#### `portada` — la tapa dura de delante
```json
{
  "id": 1, "tipo": "portada",
  "etiqueta": "Feliz cumpleaños",
  "titulo": "Nuestra historia",
  "subtitulo": "una frase corta",
  "autor": "de parte de Andrés",
  "foto": "/libro/portada.jpg",
  "alt": "nosotros dos"
}
```
`etiqueta` va arriba del todo en letras pequeñas. `foto` sale como un círculo pequeño sobre el título (opcional). Lleva el botón **Abrir el libro**.

#### `dedicatoria` — la primera hoja, centrada
```json
{
  "id": 2, "tipo": "dedicatoria",
  "titulo": "Para ti",
  "texto": "Primer párrafo.\n\nSegundo párrafo.",
  "firma": "Andrés",
  "fecha": "8 de octubre de 2026"
}
```

#### `texto` — página de lectura normal
```json
{
  "id": 4, "tipo": "texto",
  "titulo": "El primer día",
  "texto": "Párrafo uno.\n\nPárrafo dos.",
  "capitular": true,
  "foto": "/fotos/x.jpg", "alt": "..."
}
```
`capitular` (por defecto `true`) hace grande y rosa la primera letra. `foto` es opcional y sale pequeña al pie.

#### `poema` — versos centrados
```json
{
  "id": 6, "tipo": "poema",
  "titulo": "Para ti",
  "versos": ["primer verso", "segundo verso", "", "tras el espacio"],
  "firma": "Andrés"
}
```
Cada elemento de `versos` es una línea; una cadena vacía `""` deja un espacio. Si prefieres, usa `"texto"` con saltos de línea en vez de `versos`.

#### `carta` — hoja de carta con renglones
```json
{
  "id": 9, "tipo": "carta",
  "lugar": "Bogotá", "fecha": "8 de octubre",
  "destinatario": "Querida Juli,",
  "texto": "Párrafo uno.\n\nPárrafo dos.",
  "firma": "Andrés"
}
```
Se dibuja con renglones, margen rojo y la letra manuscrita del tema.

#### `foto` — una polaroid con cinta
```json
{
  "id": 5, "tipo": "foto",
  "titulo": "Aquel día",
  "foto": "/fotos/playa.jpg", "alt": "en la playa",
  "pie": "lo que escribirías al reverso",
  "rotacion": -2.5
}
```
`rotacion` en grados: negativo inclina a la izquierda, positivo a la derecha.

#### `collage` — de 2 a 4 fotos inclinadas
```json
{
  "id": 7, "tipo": "collage",
  "titulo": "Un poco de todo",
  "fotos": [
    { "src": "/fotos/1.jpg", "alt": "...", "pie": "...", "rotacion": -3.5 },
    { "src": "/fotos/2.jpg", "alt": "...", "pie": "...", "rotacion": 2.8 }
  ]
}
```
Con 2 fotos se colocan en columna alternando lados; con 3 o 4, en rejilla de dos columnas. Más de 4 se ignoran.

#### `dibujo` — un escaneo sobre papel cuadriculado
```json
{
  "id": 10, "tipo": "dibujo",
  "titulo": "Te hice un dibujo",
  "dibujo": "/libro/dibujo.png", "alt": "...",
  "pie": "no soy artista"
}
```
La imagen se ve **completa** (no se recorta) y con las esquinas de álbum. Si tu dibujo es sobre papel blanco, un `.png` queda mejor.

#### `video` — con controles, se pausa solo
```json
{
  "id": 11, "tipo": "video",
  "titulo": "Un video para ti",
  "video": "/libro/video.mp4",
  "poster": "/libro/video-portada.jpg",
  "pie": "dale play"
}
```
`poster` es la imagen que se ve antes de darle play (opcional pero recomendada). El video **se pausa solo** al pasar de página, y tocar sus controles no pasa la hoja.

#### `separador` — portada de capítulo
```json
{
  "id": 3, "tipo": "separador",
  "numero": "Capítulo 1",
  "titulo": "Cómo empezó todo",
  "subtitulo": "el día que nos conocimos",
  "indice": "Capítulo 1 — Cómo empezó todo"
}
```
Es cartulina rígida: se pasa como un separador de verdad. Sale siempre en el **Índice**.

#### `contraportada` — la tapa dura de atrás
```json
{
  "id": 12, "tipo": "contraportada",
  "texto": "La frase con la que cierra el libro.",
  "firma": "Andrés",
  "fecha": "2026"
}
```

### 5.4 Cambiar el estilo del libro: `src/styles/tema.js`

Es el **único** archivo que hay que tocar para cambiar cómo se ve el libro (y el fondo, la tinta y la fuente de títulos del resto de la app). No pongas colores dentro de los componentes ni en los `.css`.

| Bloque | Qué controla |
|---|---|
| `fuentes` | Las tres tipografías: `titulos`, `manuscrita`, `texto`. Si las cambias, cambia también la URL de `googleFonts`. La de `titulos` es también la clase `font-romantica` que usan el Inicio, Juegos e Historia. |
| `colores` | Fondo, papel, tinta, acentos rosa y dorado, tapa y lomo, `textoTapa` (letras sobre la tapa), `papelCarta`, `marcoPolaroid` y las sombras (`sombraBase` para el papel, `sombraTapa` para la tapa, `brillo` para los reflejos). |
| `libro.proporcionPagina` | Ancho ÷ alto de una página. Más bajo = página más alta y estrecha. |
| `libro.grosorTapa`, `libro.grosorHojas` | Grosor visible de la tapa y del bloque de hojas. |
| `libro.tiempoPaso` | Milisegundos que tarda en pasar una hoja. |
| `libro.opacidadSombra` | Intensidad de la sombra que se dibuja al pasar la hoja (0 a 1). |
| `libro.radioCarga` | Cuántas páginas alrededor de la actual cargan fotos y videos. Súbelo si al pasar rápido ves huecos; bájalo si va lento. |
| `libro.volumenSonido` | Volumen del sonido de papel (0 a 1). |
| `decoraciones` | Pon en `false` los corazones, flores, washi tape, esquinas de foto, filigranas o la textura del papel para un libro más sobrio. |
| `sonidoPagina` | Ruta del sonido de pasar hoja. |
| `volumenMusica` | Volumen de la música de fondo (0 a 1). La canción se elige en `pareja.json`. |

### 5.5 El sonido de pasar página

Pon un `.mp3` corto (menos de un segundo) en **`public/audio/pagina.mp3`**.

Si el archivo no existe **no pasa nada**: el libro funciona igual, en silencio. El botón del altavoz en la barra de abajo silencia o activa el sonido, y recuerda tu elección.

### 5.6 Cómo se navega

| Acción | Cómo |
|---|---|
| Pasar página | Arrastra la esquina con el dedo o el mouse, desliza, o haz clic en la página |
| Anterior / siguiente | Botones de flecha de la barra de abajo |
| Teclado | ← y →, `Inicio` para la portada, `Fin` para la última página |
| Saltar a un capítulo | Botón **Índice** |
| Salir | Botón **Inicio** |

En pantalla ancha el libro se abre a doble página; en celular muestra una página a la vez. El cambio es automático según el tamaño de la ventana.

### 5.7 Si quieres tocar el código

Los componentes están en `src/components/libro/`, uno por tipo de página (`PaginaFoto.jsx`, `PaginaCarta.jsx`, …). Para **añadir un tipo nuevo**: crea el componente y regístralo en el objeto `TIPOS` de `Pagina.jsx`.

Un detalle: por defecto, hacer clic en cualquier parte de la página pasa la hoja. Si prefieres que solo pase al hacer clic en las esquinas, activa `disableFlipByClick` en `Libro.jsx`.

## 6. Mapa del proyecto

```
public/
  fotos/      ← fotos y videos (collage, timeline, juegos)
  libro/      ← imágenes y videos de las páginas del libro
  audio/      ← música, notas de voz y pagina.mp3
src/
  content/    ← TODOS los textos y rutas. Aquí editas tú.
    pareja.json
    timeline.json
    collage.json
    libro.json
    juegos.json
  pages/      ← una pantalla por ruta
    Inicio.jsx      → /          (las 3 tarjetas, ya funciona)
    Juegos.jsx      → /juegos    (placeholder con título y botón volver)
    Historia.jsx    → /historia  (placeholder con título y botón volver)
    Libro.jsx       → /libro     (terminado)
  components/
    comun/      ← piezas de toda la app
      MusicaFondo.jsx     ← música de fondo y su botón de silencio
      VolverInicio.jsx    ← botón "Volver al inicio"
    libro/      ← el libro digital, terminado
      Libro.jsx           ← arma el libro y lo navega
      Pagina.jsx          ← una hoja; reparte según el "tipo"
      PaginaPortada.jsx   ┐
      PaginaDedicatoria.jsx │
      PaginaTexto.jsx     │
      PaginaPoema.jsx     │
      PaginaCarta.jsx     ├ un archivo por tipo de página
      PaginaFoto.jsx      │
      PaginaCollage.jsx   │
      PaginaDibujo.jsx    │
      PaginaVideo.jsx     │
      PaginaSeparador.jsx │
      PaginaContraportada.jsx ┘
      ControlesLibro.jsx  ← barra de abajo
      IndiceLibro.jsx     ← menú de capítulos
      indice.js           ← arma las entradas del índice desde libro.json
      Adornos.jsx         ← corazones, flores, washi tape (SVG)
      MediaPerezosa.jsx   ← fotos y videos con carga perezosa
      contexto.jsx        ← reparte qué página se está leyendo
      estadoLibro.js      ← hooks para leer ese estado desde cada página
      textos.js           ← lee textosInterfaz de libro.json
      useSonidoPagina.js  ← sonido de papel
      util.js
    timeline/   ← vacías, para las siguientes secciones
    collage/
    juegos/
  styles/
    tema.js     ← COLORES Y TIPOGRAFÍAS. Edita aquí.
    libro.css   ← papel, pliegue, tapa, washi tape
    index.css   ← Tailwind, font-romantica y estilos globales
  App.jsx       ← las 4 rutas, el comodín y la música de fondo
  main.jsx      ← arranque de la app (aplica el tema a todo)
index.html
```

---

## 7. Las rutas

| URL | Pantalla |
|---|---|
| `/` | Inicio — 3 tarjetas con animación de entrada |
| `/juegos` | Juegos |
| `/historia` | Nuestra historia |
| `/libro` | Libro digital con efecto de pasar páginas |
| cualquier otra | Vuelve al Inicio |

---

## 8. Errores comunes

- **La foto no aparece**: revisa que la ruta en el JSON empiece con `/` y **no** incluya `public`.
  Correcto: `/fotos/ana.jpg`. Incorrecto: `public/fotos/ana.jpg` o `fotos/ana.jpg`.
- **La app se queda en blanco tras editar un JSON**: casi siempre es una **coma** sobrante o faltante.
  En JSON, el último elemento de una lista **no** lleva coma al final.
- **Comillas**: todos los textos van entre comillas dobles `"`. Si tu texto lleva una comilla doble dentro, escríbela como `\"`.
