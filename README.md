# Regalo

App web romántica hecha con **React + Vite**, **Tailwind CSS**, **Framer Motion**, **react-router-dom** y **react-pageflip**.

Estado actual:

- **Inicio (`/`)** — las 3 tarjetas, funcionando.
- **Libro (`/libro`)** — terminado: libro digital con tapa dura, curvatura al pasar la hoja, arrastre de esquina, sonido de papel e índice. Ver el **[capítulo 5](#5-el-libro-página-por-página)**.
- **Nuestra historia (`/historia`)** — terminada: contador de tiempo juntos, línea de tiempo animada y collage de fotos con visor a pantalla completa. Ver `timeline.json` y `collage.json` en el **[capítulo 4](#4-los-archivos-de-contenido-uno-por-uno)**.
- **Juegos (`/juegos`)** — terminado: menú con 6 minijuegos (memorama, ¿cuánto me conoces?, rompecabezas, ruleta de citas y retos, cartas para abrir y frases del amor), celebración al ganar y sonidos opcionales. Ver `juegos.json` en el **[capítulo 4](#4-los-archivos-de-contenido-uno-por-uno)**.
- **Música de fondo** — opcional, suena en todas las pantallas y tiene su botón de silencio arriba a la derecha.
- **Pantalla de entrada** — el nombre y un botón **Entrar** (que además arranca la música). Si pones una `claveAcceso`, primero pide la respuesta.
- **Listo para publicar** — fotos optimizadas solas al construir, vista previa al compartir el enlace, oculto para buscadores y configurado para Vercel y Netlify. Ver el **[capítulo 10](#10-publicarlo-gratis-paso-a-paso)**.

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
| `public/fotos/` | Fotos del collage, de la línea de tiempo y de los juegos. También los videos de la línea de tiempo y sus portadas. | `/fotos/nombre.jpg`, `/fotos/nombre.mp4` |
| `public/libro/` | Las imágenes **y los videos** que van **dentro del libro** (fotos, dibujos, portada, videos y sus imágenes de portada). | `/libro/nombre.jpg`, `/libro/nombre.mp4` |
| `public/audio/` | Música de fondo, notas de voz, el sonido de pasar página (`pagina.mp3`) y los sonidos de los juegos (en `public/audio/juegos/`). | `/audio/nombre.mp3` |

Consejos:
- Usa nombres **sin espacios ni tildes**: `primer-viaje.jpg`, no `Primer Viaje ñ.jpg`.
- Formatos recomendados: fotos `.jpg` (o `.png` para dibujos), video `.mp4`, audio `.mp3`.
- **No hace falta achicar las fotos a mano.** Al construir (`npm run build`), cada `.jpg`/`.png` se convierte sola a `.webp` en tres tamaños (480, 960 y 1600 px de ancho) y cada pantalla descarga el tamaño justo. Tus archivos de `public/` no se tocan y los JSON siguen apuntando al `.jpg`. Aun así, fotos de más de 5 MB hacen el build más lento: si vienen del celular en máxima calidad, está bien bajarlas a unos 2500 px de ancho.
- **Videos**: no se descargan hasta que se necesitan (al llegar a ellos; en el libro, solo cerca de su página). Ponles siempre `poster`: con portada, el video no baja **nada** hasta que le den play. Intenta que pesen menos de 30 MB (720p alcanza de sobra).
- Los archivos `.gitkeep` en esas carpetas solo existen para que las carpetas no se borren. **No los toques.**

---

## 4. Los archivos de contenido, uno por uno

Todos están en `src/content/`. Cada uno trae **entradas de ejemplo** marcadas con la palabra `EJEMPLO` o `REEMPLAZAR`.
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
    "historia": {
      "titulo": "Nuestra historia",
      "subtitulo": "Los momentos que nos trajeron hasta aquí.",
      "tituloLineaTiempo": "Paso a paso",
      "tituloCollage": "Nuestro collage",
      "subtituloCollage": "Toca una foto para verla en grande."
    }
  },
  "textosInterfaz": {
    "volverInicio": "Volver al inicio",
    "activarMusica": "Activar música",
    "silenciarMusica": "Silenciar música",
    "historia": {
      "idiomaFechas": "es-CO",
      "chipLineaTiempo": "Línea de tiempo",
      "chipCollage": "Collage",
      "contador": "Llevamos {anios}, {meses} y {dias}",
      "contadorDesde": "desde el {fecha}",
      "unidades": { "anios": ["año", "años"], "meses": ["mes", "meses"], "dias": ["día", "días"] }
    }
  }
}
```
(El bloque `textosInterfaz.historia` real tiene más claves; están todas en la tabla de abajo.)

| Campo | Qué es |
|---|---|
| `nombre` | Nombre que aparece grande en el Inicio. |
| `frase` | Frase bajo el nombre en el Inicio. |
| `fechaInicio` | Fecha en que empezaron, formato `AAAA-MM-DD`. |
| `fotoPortada` | Foto redonda sobre el nombre en el Inicio. Archivo en `public/fotos/`. Si la dejas como `""` o el archivo no existe, simplemente no sale. |
| `fotoPortadaAlt` | Descripción corta de esa foto (accesibilidad). |
| `musicaFondo` | Canción de fondo, en bucle, en todas las pantallas. Archivo en `public/audio/`. Si la dejas como `""` o el archivo no existe, no suena nada y el botón de música no aparece. |
| `claveAcceso` | Respuesta que hay que escribir para entrar (por ejemplo la fecha de aniversario, `"2023-01-01"`). **Vacía (`""`) = no se pide.** No importan mayúsculas, tildes, espacios ni separadores: `2023/01/01` vale igual que `2023-01-01`. Ver el **[capítulo 9](#9-privacidad)**. |
| `preguntaAcceso` | La pregunta que sale encima del campo (por ejemplo "¿Cuál es nuestra fecha de aniversario? (AAAA-MM-DD)"). Solo se usa si hay `claveAcceso`. |
| `metadatos.titulo` | Título de la pestaña del navegador y de la tarjeta al compartir el enlace por WhatsApp, Instagram, etc. |
| `metadatos.descripcion` | Texto pequeño bajo el título en esa tarjeta. |
| `metadatos.imagen`, `metadatos.imagenAlt` | Foto de la tarjeta al compartir (archivo en `public/fotos/`) y su descripción. Se recorta sola a 1200×630. Si la dejas vacía se usa `fotoPortada`. |
| `metadatos.urlSitio` | La dirección final, por ejemplo `"https://para-juli.vercel.app"`. En Vercel y Netlify **puedes dejarla vacía**: se detecta sola. Ponla si usas un dominio propio. |
| `secciones.tarjetas` | Las 3 tarjetas del Inicio: `titulo`, `descripcion` (línea pequeña, opcional) y `ruta` (no la cambies). |
| `secciones.juegos.titulo`, `secciones.historia.titulo` | Título grande de cada una de esas pantallas. |
| `secciones.historia.subtitulo`, `secciones.juegos.subtitulo` | Frase bajo el título de Nuestra historia y de Juegos (opcional). |
| `secciones.historia.tituloLineaTiempo`, `tituloCollage`, `subtituloCollage` | Títulos de las dos partes de Nuestra historia. |
| `textosInterfaz` | Textos del botón **Volver al inicio** y del botón de música (lo que lee un lector de pantalla y sale al pasar el mouse). |
| `textosInterfaz.entrada` | Botón **Entrar** de la pantalla de entrada (`boton`) y la línea pequeña bajo él (`sugerencia`, solo sale si hay música). |
| `textosInterfaz.acceso` | Textos del campo de la clave: `etiqueta`, `entrar`, `error` (cuando la respuesta no es) y `comprobando`. |
| `textosInterfaz.cargando`, `cargandoLibro` | Lo que dice el corazón que late mientras carga una pantalla, y mientras cargan las fotos del libro. |
| `textosInterfaz.noEncontrada` | La página que sale si alguien abre una dirección que no existe: `titulo`, `texto` y `boton`. |
| `textosInterfaz.historia` | Textos de botones y avisos de **Nuestra historia** (tabla de abajo). |
| `textosInterfaz.juegos` | Textos de botones, marcadores y avisos de **Juegos**: uno general (`volverMenu`, `jugarOtraVez`, sonidos...) y un bloque por juego (`memorama`, `quiz`, `rompecabezas`, `ruleta`, `cartas`, `frases`). Igual que arriba: no borres las palabras entre llaves (`{n}`, `{total}`, `{actual}`...). |

Las claves de `textosInterfaz.historia`. Cámbialas si quieres otras palabras, pero no borres claves ni las palabras entre llaves (`{anios}`, `{fecha}`, `{actual}`...), que se rellenan solas:

| Clave | Dónde sale |
|---|---|
| `idiomaFechas` | Idioma de las fechas (`"es-CO"` → "1 de enero de 2023"). |
| `chipLineaTiempo`, `chipCollage`, `navegacion` | Los chips de arriba para saltar de sección (y su nombre para lectores de pantalla). |
| `contador` | La frase del contador. `{anios}`, `{meses}` y `{dias}` se cambian por el número y su palabra. |
| `unidades` | La palabra en singular y en plural de cada número: `["año", "años"]`. |
| `contadorDesde` | Línea pequeña bajo el contador. `{fecha}` es `fechaInicio`. |
| `verFoto`, `fotoAnterior`, `fotoSiguiente`, `irAFoto`, `cerrar`, `visor`, `fotoDeTotal` | Botones del carrusel y del visor de fotos. `fotoDeTotal` es el "2 de 12" del visor. |
| `reemplazar`, `faltaFoto`, `fotoNoEncontrada`, `videoNoEncontrado` | El recuadro que sale cuando falta una foto o un video. |
| `sinMomentos`, `sinFotos` | Aviso si `timeline.json` o `collage.json` quedan vacíos. |

Sobre la música: los navegadores no dejan que una página suene sola antes de que la toques. Por eso arranca con el botón **Entrar**. La pantalla de entrada sale una vez por visita: si recargas, no vuelve a salir y la música empieza con el primer toque. El botón de la nota musical la silencia o la reanuda, y recuerda tu elección.

### `src/content/timeline.json` — la línea de tiempo
Una entrada por momento importante. Salen en **Nuestra historia** (`/historia`), sobre una línea vertical que se dibuja mientras bajas: en escritorio alternan izquierda y derecha; en celular van todas a un lado. Se **ordenan solas por `fecha`**, así que no importa en qué orden las escribas.

Trae **8 momentos de ejemplo** marcados `REEMPLAZAR`: con una foto, sin foto, con varias fotos (carrusel) y con video.

```json
{
  "momentos": [
    {
      "id": 1,
      "fecha": "2023-01-01",
      "titulo": "El día que nos conocimos",
      "texto": "Lo que pasó ese día.",
      "icono": "estrella",
      "foto": "/fotos/conocernos.jpg",
      "alt": "Nosotros en el café",
      "marco": "polaroid",
      "pie": "lo que escribirías al reverso"
    },
    {
      "id": 2,
      "fecha": "2023-04-08",
      "titulo": "El primer paseo",
      "texto": "Varias fotos: salen en un carrusel.",
      "icono": "camara",
      "marco": "cinta",
      "fotos": [
        { "src": "/fotos/paseo-1.jpg", "alt": "En el parque", "pie": "la primera" },
        { "src": "/fotos/paseo-2.jpg", "alt": "El atardecer", "pie": "la segunda" }
      ]
    },
    {
      "id": 3,
      "fecha": "2023-06-15",
      "titulo": "Nuestro primer viaje",
      "texto": "Con video.",
      "icono": "avion",
      "video": "/fotos/viaje.mp4",
      "poster": "/fotos/viaje-portada.jpg"
    }
  ]
}
```

| Campo | ¿Obligatorio? | Qué es |
|---|---|---|
| `id` | sí | Número único. No repitas ninguno. |
| `fecha` | sí | `AAAA-MM-DD`. Sirve para ordenar y se muestra como "1 de enero de 2023". |
| `fechaTexto` | no | Si lo pones, se muestra **en lugar** de la fecha (por ejemplo `"Navidad 2023"`). El orden sigue saliendo de `fecha`. |
| `titulo` | sí | Título corto del momento. |
| `texto` | no | Relato corto (2 o 3 líneas quedan mejor). |
| `icono` | no | Icono del círculo sobre la línea: `corazon` (por defecto), `estrella`, `anillo`, `avion`, `casa`, `regalo`, `camara`, `musica`. |
| `foto` | no | **Una** foto, de `public/fotos/`. Con `alt` (descripción) y `pie` (texto bajo la foto) opcionales. |
| `fotos` | no | **Varias** fotos: lista de `{ "src", "alt", "pie" }`. Salen en un carrusel pequeño (flechas, puntos y deslizar con el dedo). Si pones `fotos`, se ignora `foto`. |
| `marco` | no | Marco de las fotos: `"polaroid"` (por defecto, borde blanco ancho abajo) o `"cinta"` (borde fino con cinta washi). |
| `video` | no | Un `.mp4` de `public/fotos/`. Sale con controles y solo se carga cuando llegas a él. Puede ir junto con fotos. |
| `poster` | no | Imagen que se ve antes de darle play al video. |
| `animacion` | no | Cómo aparece al bajar: `"desliza"`, `"inclina"` o `"rebota"`. Si no lo pones, se van alternando solos. |

- **Sin foto ni video**: el momento sale solo con su texto.
- **Tocar una foto** la abre a pantalla completa. Si el momento tiene varias, en el visor puedes pasar de una a otra.
- **El contador** de arriba ("Llevamos 3 años, 9 meses y 9 días") se calcula solo con `fechaInicio` de `pareja.json`. Si esa fecha está vacía o es futura, no se muestra.

### `src/content/collage.json` — las fotos del collage
Una entrada por foto. Va al final de **Nuestra historia**. Trae **12 fotos de ejemplo** marcadas `REEMPLAZAR`.

```json
{
  "formaCorazon": false,
  "textoCentro": "Te amo",
  "fotos": [
    { "id": 1, "src": "/fotos/playa.jpg", "alt": "Nosotros en la playa", "pie": "Ese atardecer.", "tamano": "grande", "marco": "polaroid" },
    { "id": 2, "src": "/fotos/cena.jpg", "alt": "La cena", "pie": "", "marco": "cinta", "rotacion": -3 }
  ]
}
```

| Campo | ¿Obligatorio? | Qué es |
|---|---|---|
| `formaCorazon` | no | `true` coloca las fotos formando un **corazón**. `false` (o sin poner) las muestra en mosaico. Con forma de corazón los pies no salen en el collage, solo en el visor. Queda mejor con 8 a 14 fotos; con más, las que sobran forman un segundo corazón por dentro. |
| `textoCentro` | no | Texto corto en el hueco del medio del corazón (solo con `formaCorazon: true` y hasta 14 fotos). |
| `fotos[].id` | sí | Número único. |
| `fotos[].src` | sí | Ruta de la foto en `public/fotos/`. |
| `fotos[].alt` | no | Descripción corta (accesibilidad). |
| `fotos[].pie` | no | Texto bajo la foto (en el marco polaroid) y en el visor. Puede ir vacío: `""`. |
| `fotos[].tamano` | no | Celdas que ocupa en el mosaico: `"normal"` (por defecto), `"ancha"` (2 de ancho), `"alta"` (2 de alto) o `"grande"` (2×2). |
| `fotos[].marco` | no | `"polaroid"`, `"cinta"` o `"recorte"` (bordes irregulares, como recortada a mano). Si no lo pones, se van alternando. |
| `fotos[].rotacion` | no | Inclinación en grados (entre `-4` y `4` queda natural). Si no lo pones, cada foto lleva una leve distinta. |

Al pasar el mouse (o tocar) una foto, se **levanta y se endereza**. Al tocarla se abre el **visor**: flechas o ← → del teclado para la anterior y la siguiente, deslizar con el dedo en el celular, y **ESC** o la **X** para cerrar.

### Si falta una foto o un video
No pasa nada: en su lugar sale un **recuadro rosa a rayas con un corazón**, la palabra `REEMPLAZAR` y la ruta del archivo que falta, para que sepas qué archivo poner y con qué nombre. Todas las fotos cargan de forma perezosa (solo cuando te acercas a ellas).

### `src/content/libro.json` — el libro que se hojea
Es el archivo más grande y tiene su propio capítulo: **[5. El libro, página por página](#5-el-libro-página-por-página)**.

### `src/content/juegos.json` — los juegos
La página **Juegos (`/juegos`)** muestra un menú con una tarjeta por juego. Cada juego se abre en la misma página (sin recargar) y tiene su botón **Volver a los juegos**; el botón **Atrás** del celular también vuelve al menú.
El archivo trae **un ejemplo de cada juego** marcado `REEMPLAZAR`. Los textos de botones y avisos de los juegos ("Girar", "Intentos: {n}"...) están en `pareja.json` → `textosInterfaz.juegos`, y el título y subtítulo de la página en `pareja.json` → `secciones.juegos`.

```json
{
  "sonidos": { "voltear": "/audio/juegos/voltear.mp3", "acierto": "...", "error": "...", "victoria": "...", "ruleta": "...", "abrir": "..." },
  "juegos": [
    { "id": "memorama", "tipo": "memorama", "icono": "cartas", "titulo": "Memorama", "descripcion": "Encuentra las parejas." }
  ]
}
```

**Campos comunes a todos los juegos:**

| Campo | ¿Obligatorio? | Qué es |
|---|---|---|
| `id` | sí | Texto o número **único**. Sale en la dirección: `/juegos?juego=memorama`. |
| `tipo` | sí | Cómo se juega: `memorama`, `quiz`, `rompecabezas`, `ruleta`, `cartas` o `frases`. |
| `titulo` | sí | Nombre en la tarjeta del menú y arriba del juego. |
| `descripcion` | no | Línea corta bajo el nombre en el menú. |
| `icono` | no | `cartas`, `pregunta`, `rompecabezas`, `ruleta`, `sobre`, `pluma`, `corazon` o `estrella`. Si no lo pones, se usa el del tipo. |

El **orden** de la lista `juegos` es el orden del menú. Para quitar un juego, borra su objeto.

#### Dónde van las fotos y los sonidos de los juegos
- **Fotos** → `public/fotos/`, y en el JSON como `/fotos/nombre.jpg` (memorama y rompecabezas).
  Si una foto falta, sale el recuadro rosa de **REEMPLAZAR**; en el memorama lleva un **número** grande y en el rompecabezas cada pieza muestra su número, así los juegos se pueden probar sin fotos.
- **Sonidos** (opcionales) → `public/audio/juegos/` y sus rutas en `sonidos`. Hay un botón para silenciarlos arriba a la derecha. Si un archivo no existe, ese sonido simplemente no suena; nada falla.

#### `memorama` — parejas de fotos
```json
{
  "id": "memorama", "tipo": "memorama", "titulo": "Memorama",
  "instrucciones": "Voltea dos cartas...",
  "fotos": [ { "src": "/fotos/memorama-1.jpg", "alt": "Nuestra primera foto" }, "/fotos/memorama-2.jpg" ],
  "victoria": { "titulo": "¡Las encontraste todas!", "texto": "Mensaje romántico al ganar." }
}
```
- `fotos`: cada foto sale **dos veces**. Con 6 fotos hay 12 cartas (queda muy bien en celular); de 4 a 10 fotos funciona bien. Puede ser solo la ruta o `{ "src", "alt" }`.
- `victoria`: título y texto del mensaje final. Al ganar hay lluvia de corazones y se muestran los intentos.

#### `quiz` — ¿Cuánto me conoces?
```json
{
  "id": "quiz", "tipo": "quiz", "titulo": "¿Cuánto me conoces?",
  "preguntas": [
    {
      "pregunta": "¿Dónde fue nuestra primera cita?",
      "opciones": ["En el cine", "En un café", "En el parque"],
      "respuestaCorrecta": 1,
      "siAcierta": "¡Exacto!",
      "siFalla": "Nooo, fue en el café."
    }
  ],
  "frasesAcierto": ["¡Bien!", "¡Me conoces demasiado!"],
  "frasesFallo": ["Uy, casi…"],
  "resultados": [
    { "desde": 0,   "titulo": "Hay que estudiar más", "texto": "..." },
    { "desde": 50,  "titulo": "¡Nada mal!",           "texto": "..." },
    { "desde": 100, "titulo": "¡Perfecto!",           "texto": "..." }
  ]
}
```
- `opciones`: 3 o 4. `respuestaCorrecta` es la **posición** empezando en **0** (`0` = la primera).
- `siAcierta` / `siFalla` (opcionales): comentario de esa pregunta. Si no los pones, sale uno al azar de `frasesAcierto` / `frasesFallo`.
- `resultados`: mensaje final según el **porcentaje** de aciertos. Sale el de `desde` más alto que no pase del puntaje (con 3 de 4 = 75 % sale el de `50`). Desde 50 % hay lluvia de corazones.

#### `rompecabezas` — arma la foto
```json
{
  "id": "rompecabezas", "tipo": "rompecabezas", "titulo": "Rompecabezas",
  "foto": { "src": "/fotos/rompecabezas.jpg", "alt": "Nosotros dos" },
  "tamanos": [3, 4],
  "dedicatoria": { "titulo": "¡Completo!", "texto": "Contigo todas las piezas encajan." }
}
```
- `tamanos`: tamaños para elegir (`3` = 3×3, `4` = 4×4). Con uno solo, por ejemplo `[3]`, empieza directo.
- Sirve cualquier proporción de foto (vertical u horizontal); queda mejor una foto nítida.
- Se juega **arrastrando** una pieza sobre otra (dedo o mouse) o **tocando dos piezas** seguidas. Al terminar sale la foto completa con la `dedicatoria`.

#### `ruleta` — citas, retos y preguntas
```json
{
  "id": "ruleta", "tipo": "ruleta", "titulo": "Ruleta de citas y retos",
  "categorias": { "cita": "Cita", "reto": "Reto", "pregunta": "Pregunta" },
  "opciones": [
    { "tipo": "cita", "texto": "Picnic en el parque." },
    { "tipo": "reto", "texto": "Bailar nuestra canción." },
    { "tipo": "pregunta", "texto": "¿Cuál es tu recuerdo favorito?" }
  ]
}
```
- Cada opción es un gajo de la ruleta. En el gajo se lee la **categoría**; el `texto` aparece al terminar de girar.
- `categorias`: el nombre que se ve de cada tipo. Los colores salen de `tema.js` (cita = rosa, reto = dorado, pregunta = verde salvia).
- Se ve mejor con 6 a 12 opciones. Nunca sale la misma dos veces seguidas.

#### `cartas` — sobres para abrir
```json
{
  "id": "cartas", "tipo": "cartas", "titulo": "Cartas para abrir",
  "cartas": [
    { "sobre": "Ábrela cuando estés triste", "tipo": "mensaje", "titulo": "Para ti", "texto": "...", "firma": "Con amor, yo" },
    { "sobre": "Un poema", "tipo": "poema", "titulo": "Tu nombre", "texto": "Verso 1\nVerso 2" },
    { "sobre": "Vale", "tipo": "vale", "titulo": "Vale por un masaje", "texto": "Sin fecha de vencimiento." }
  ]
}
```
- `sobre`: lo que está escrito en el sobre cerrado.
- `tipo`: `mensaje` (hoja con renglones), `poema` (letra a mano, centrado) o `vale` (cupón con borde punteado).
- `\n` dentro del `texto` es un salto de línea (útil en los poemas). `firma` es opcional.
- Los sobres ya abiertos quedan marcados como **Abierta** en ese navegador.

#### `frases` — completar u ordenar
```json
{
  "id": "frases", "tipo": "frases", "titulo": "Frases del amor",
  "frases": [
    { "modo": "ordenar", "frase": "Eres mi lugar favorito en el mundo", "pista": "...", "mensaje": "Y lo sigues siendo." },
    { "modo": "completar", "frase": "Contigo hasta el fin del mundo", "huecos": ["Contigo", "mundo"], "distractores": ["cielo", "mar"] }
  ],
  "victoria": { "titulo": "¡Todas completas!", "texto": "Cada palabra es verdad." }
}
```
- `ordenar`: las palabras de `frase` salen desordenadas y hay que tocarlas en orden.
- `completar`: las palabras de `huecos` quedan en blanco y se eligen entre ellas y los `distractores` (palabras de más para despistar). Las de `huecos` deben estar escritas **igual** que en la frase (no importan mayúsculas ni tildes).
- `pista` y `mensaje` son opcionales. `victoria` sale al terminar todas las frases.
- No pongas `REEMPLAZAR` dentro de `frase`: se volvería una palabra más del juego.

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
    Juegos.jsx      → /juegos    (menú de juegos y el juego abierto)
    Historia.jsx    → /historia  (contador, línea de tiempo y collage)
    Libro.jsx       → /libro     (terminado)
    NoEncontrada.jsx → cualquier otra dirección
  components/
    comun/      ← piezas de toda la app
      Entrada.jsx         ← pantalla de entrada y clave de acceso
      MusicaFondo.jsx     ← botón de silencio (musica.js reproduce la canción)
      Imagen.jsx          ← <img> que usa las versiones .webp optimizadas
      Cargando.jsx        ← corazón que late mientras carga
      VolverInicio.jsx    ← botón "Volver al inicio"
      BarraSecciones.jsx  ← chips para saltar entre secciones de una página
      Lightbox.jsx        ← visor de fotos a pantalla completa
      FotoSegura.jsx      ← foto perezosa con recuadro REEMPLAZAR si falta
      textosHistoria.js   ← lee textosInterfaz.historia de pareja.json
      usePantallaAncha.js ← ¿celular o escritorio?
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
    timeline/   ← línea de tiempo de Nuestra historia
      LineaTiempo.jsx     ← ordena los momentos y dibuja la línea al bajar
      Hito.jsx            ← un momento: nodo, fecha, tarjeta y animación
      MediaHito.jsx       ← foto con marco, carrusel y video
      ContadorPareja.jsx  ← "Llevamos X años, X meses y X días"
      IconoHito.jsx       ← iconos del nodo
      fechas.js
    collage/    ← collage de Nuestra historia
      Collage.jsx         ← mosaico o forma de corazón
      FotoCollage.jsx     ← una foto con su marco
      posicionesCorazon.js
    juegos/     ← los minijuegos de /juegos
      Memorama.jsx        ← parejas de fotos con volteo
      Quiz.jsx            ← ¿Cuánto me conoces?
      Rompecabezas.jsx    ← piezas para arrastrar (3x3 / 4x4)
      Ruleta.jsx          ← ruleta de citas, retos y preguntas
      Cartas.jsx          ← sobres que se abren
      Frases.jsx          ← ordenar y completar frases
      PiezasJuego.jsx     ← mensaje final, marcadores y foto con REEMPLAZAR
      Celebracion.jsx     ← lluvia de corazones y confeti
      IconoJuego.jsx      ← iconos de las tarjetas del menú
      sonidos.js          ← efectos de sonido y botón de silencio
      datosJuegos.js      ← lee juegos.json y textosInterfaz.juegos
  styles/
    tema.js     ← COLORES Y TIPOGRAFÍAS. Edita aquí.
    libro.css   ← papel, pliegue, tapa, washi tape
    historia.css ← marcos del collage, recorte y visor de fotos
    juegos.css  ← cartas, sobres, piezas, fichas y botones de los juegos
    index.css   ← Tailwind, font-romantica y estilos globales
  App.jsx       ← entrada, rutas con transición y música de fondo
  rutas.js      ← carga cada pantalla solo cuando hace falta
  main.jsx      ← arranque de la app (aplica el tema a todo)
plugins/
  imagenes.js   ← convierte las fotos a .webp al construir
  pareja.js     ← título, vista previa al compartir y clave (desde pareja.json)
index.html
vercel.json     ← configuración para Vercel
netlify.toml    ← configuración para Netlify
```

---

## 7. Las rutas

| URL | Pantalla |
|---|---|
| `/` | Inicio — 3 tarjetas con animación de entrada |
| `/juegos` | Juegos — menú con los 6 minijuegos (`/juegos?juego=<id>` abre uno directo) |
| `/historia` | Nuestra historia — contador, línea de tiempo y collage |
| `/libro` | Libro digital con efecto de pasar páginas |
| cualquier otra | Página "no existe" con mensaje romántico y botón para volver (`pareja.json` → `textosInterfaz.noEncontrada`) |

---

## 8. Errores comunes

- **La foto no aparece**: revisa que la ruta en el JSON empiece con `/` y **no** incluya `public`.
  Correcto: `/fotos/ana.jpg`. Incorrecto: `public/fotos/ana.jpg` o `fotos/ana.jpg`.
- **La app se queda en blanco tras editar un JSON**: casi siempre es una **coma** sobrante o faltante.
  En JSON, el último elemento de una lista **no** lleva coma al final.
- **Comillas**: todos los textos van entre comillas dobles `"`. Si tu texto lleva una comilla doble dentro, escríbela como `\"`.
- **Cambié algo y en el celular sigo viendo lo viejo**: espera uno o dos minutos a que termine de publicarse y recarga. Si sigue igual, ábrelo en una pestaña de incógnito.
- **El enlace compartido no muestra la foto**: WhatsApp y Facebook guardan la vista previa varios días. Pega el enlace en <https://developers.facebook.com/tools/debug/> y pulsa **Volver a extraer** (*Scrape Again*); para WhatsApp, prueba agregando `?v=2` al final del enlace.

---

## 9. Privacidad

- **Buscadores**: el sitio le pide a Google y compañía que no lo muestren de tres formas: la etiqueta `<meta name="robots">` de `index.html`, `public/robots.txt` y una cabecera en `vercel.json` / `netlify.toml`. A los robots que arman la vista previa de WhatsApp, Facebook, X o Telegram sí se les deja pasar, para que el enlace se vea bonito al compartirlo.
- **Clave de acceso**: pon una respuesta en `pareja.json` → `claveAcceso` y una pregunta en `preguntaAcceso`. Se pide una sola vez en cada navegador; si cambias la clave, se vuelve a pedir. En la versión publicada la respuesta no viaja escrita tal cual, solo su huella.
- **Lo que la clave NO hace**: es una cerradura simpática, no una caja fuerte. Alguien que sepa programar y tenga el enlace podría ver los textos y las fotos sin escribirla. Lo importante es **no compartir el enlace** con quien no debe verlo, y no subir nada que no quieras que se pueda ver con ese enlace.

---

## 10. Publicarlo gratis, paso a paso

Necesitas una cuenta gratis de **GitHub** (donde se guarda el proyecto) y otra de **Vercel** o **Netlify** (donde se publica). Las dos son gratis y funcionan igual de bien: elige **una**. Ya están configuradas en `vercel.json` y `netlify.toml`, incluida la regla para que `/libro` o `/juegos` funcionen al recargar la página.

### 10.1 Antes de publicar (lista de revisión)

1. Corre `npm run dev` y recorre todo: Inicio, Juegos, Historia y Libro, en el computador y en el celular.
2. Busca las palabras **REEMPLAZAR** y **EJEMPLO** en `src/content/` (en VS Code: `Ctrl+Shift+F`). No debe quedar ninguna.
3. Busca los **recuadros rosa a rayas**: son fotos o videos que faltan.
4. Llena `pareja.json` → `metadatos` (título, descripción y foto de la tarjeta al compartir).
5. Si quieres clave, llena `claveAcceso` y `preguntaAcceso`, y **pruébala** en `npm run dev`.
6. Corre `npm run build`: debe terminar con `✓ built`. Si sale un error en rojo, casi siempre es una coma en un JSON (ver **Errores comunes**, capítulo 8).

### 10.2 Subir el proyecto a GitHub (una sola vez)

1. Entra a <https://github.com/new>, ponle un nombre (por ejemplo `regalo`), márcalo como **Private** y pulsa **Create repository**.
2. En la terminal, dentro de la carpeta del proyecto:
   ```bash
   git add -A
   git commit -m "Regalo listo para publicar"
   git remote add origin https://github.com/TU-USUARIO/regalo.git
   git push -u origin main
   ```
   Si el proyecto ya estaba en GitHub, basta con `git add -A`, `git commit -m "..."` y `git push`.

`node_modules/` y `dist/` no se suben (están en `.gitignore`): Vercel y Netlify los crean solos.

### 10.3 Opción A: Vercel

1. Entra a <https://vercel.com/signup> y regístrate **con tu cuenta de GitHub** (plan *Hobby*, gratis).
2. Pulsa **Add New… → Project**, busca tu repositorio y pulsa **Import**. Si no aparece, pulsa **Adjust GitHub App Permissions** y dale acceso.
3. No cambies nada (detecta Vite y lee `vercel.json`). Pulsa **Deploy**.
4. En uno o dos minutos te da una dirección como `https://regalo-tu-usuario.vercel.app`. Para elegir una más bonita: **Settings → Domains → Edit**, por ejemplo `para-juli.vercel.app`.

### 10.4 Opción B: Netlify

1. Entra a <https://app.netlify.com/signup> y regístrate **con tu cuenta de GitHub** (plan gratis).
2. Pulsa **Add new site → Import an existing project → GitHub** y elige tu repositorio.
3. No cambies nada (lee `netlify.toml`: comando `npm run build`, carpeta `dist`). Pulsa **Deploy**.
4. Te da una dirección como `https://nombre-raro-123.netlify.app`. Para cambiarla: **Site configuration → Change site name**.

### 10.5 Comprobar que quedó bien

- Abre la dirección en el celular y en el computador.
- Entra a `/libro` y **recarga**: debe seguir en el libro. Si sale un error 404, revisa que `vercel.json` o `netlify.toml` estén subidos a GitHub.
- Escribe una dirección inventada (`/hola`): debe salir la página romántica de "no existe".
- Mándate el enlace por WhatsApp para ver la vista previa con foto y título.

---

## 11. Cambiar fotos y textos después de publicar

Una vez conectado a Vercel o Netlify, **cada vez que subes cambios a GitHub el sitio se vuelve a publicar solo** (tarda uno o dos minutos). La dirección no cambia.

1. Haz el cambio:
   - **Textos**: edita el JSON de `src/content/` que corresponda (capítulo 4).
   - **Fotos o videos nuevos**: cópialos a `public/fotos/` o `public/libro/` y escribe su ruta en el JSON. Si **reemplazas** una foto usando el mismo nombre de archivo, no tienes que tocar el JSON.
   - **Colores o tipografías**: `src/styles/tema.js`.
2. Pruébalo: `npm run dev`.
3. Súbelo:
   ```bash
   git add -A
   git commit -m "Nuevas fotos"
   git push
   ```
4. Espera a que en Vercel (**Deployments**) o Netlify (**Deploys**) salga **Ready** / **Published**, y recarga.

¿Sin computador a mano? En github.com puedes abrir un JSON, pulsar el lápiz (**Edit**), cambiar el texto y pulsar **Commit changes**; para fotos, entra a `public/fotos` y usa **Add file → Upload files**. Se publica igual, solo.

Si algo sale mal tras publicar, en Vercel (**Deployments**) o Netlify (**Deploys**) puedes volver a la versión anterior con un clic (**Promote to Production** / **Publish deploy**) mientras lo arreglas.
