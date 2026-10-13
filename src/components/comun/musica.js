import pareja from "../../content/pareja.json";
import { tema } from "../../styles/tema";

/**
 * Un solo reproductor para la musica de fondo (pareja.json -> musicaFondo),
 * compartido por la pantalla de entrada y el boton de silencio.
 */
const CLAVE = "musica:silenciada";
let audio = null;

export function musicaSilenciada() {
  try {
    return localStorage.getItem(CLAVE) === "1";
  } catch {
    return false;
  }
}

export function guardarSilencio(silenciada) {
  try {
    localStorage.setItem(CLAVE, silenciada ? "1" : "0");
  } catch {
    /* modo privado: la preferencia solo dura esta sesión */
  }
}

/** El <audio> de la cancion, creado la primera vez que se pide. null si no hay cancion. */
export function audioMusica() {
  if (!pareja.musicaFondo || typeof Audio === "undefined") return null;
  if (!audio) {
    audio = new Audio(pareja.musicaFondo);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = tema.volumenMusica;
  }
  return audio;
}

/**
 * Empieza la musica. Hay que llamarla DENTRO de un clic o una tecla:
 * los navegadores (sobre todo Safari en iPhone) solo dejan sonar audio
 * como respuesta directa a un gesto de la persona.
 */
export function iniciarMusica() {
  if (musicaSilenciada()) return;
  audioMusica()
    ?.play()
    .catch(() => {
      /* sin archivo o bloqueado: MusicaFondo lo reintenta con el siguiente toque */
    });
}
