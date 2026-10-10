/**
 * Reparte `n` fotos sobre el contorno de un corazon.
 * Devuelve el tamano de cada foto (% del ancho) y el centro de cada una
 * ({ x, y } en % de la caja), listo para posicionar con left/top, y el
 * centro del hueco del medio (null si ahi tambien hay fotos).
 * Si hay muchas fotos, las que sobran forman un segundo corazon por dentro.
 */

const MUESTRAS = 360;

// Curva clasica del corazon. y crece hacia abajo (como en pantalla).
function punto(t) {
  return {
    x: 16 * Math.sin(t) ** 3,
    y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
  };
}

const CURVA = Array.from({ length: MUESTRAS + 1 }, (_, i) => punto((i / MUESTRAS) * Math.PI * 2));
const LIMITES = CURVA.reduce(
  (l, p) => ({
    minX: Math.min(l.minX, p.x),
    maxX: Math.max(l.maxX, p.x),
    minY: Math.min(l.minY, p.y),
    maxY: Math.max(l.maxY, p.y),
  }),
  { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
);
const ANCHO = LIMITES.maxX - LIMITES.minX;
const ALTO = LIMITES.maxY - LIMITES.minY;
const CENTRO = { x: 0, y: (LIMITES.minY + LIMITES.maxY) / 2 };

// Longitud acumulada de la curva, para repartir las fotos a distancias iguales.
const ACUMULADA = CURVA.reduce((acc, p, i) => {
  if (i === 0) return [0];
  const q = CURVA[i - 1];
  acc.push(acc[i - 1] + Math.hypot(p.x - q.x, p.y - q.y));
  return acc;
}, []);
const PERIMETRO = ACUMULADA[ACUMULADA.length - 1];

function repartir(cantidad, escala) {
  const puntos = [];
  for (let k = 0; k < cantidad; k++) {
    const meta = (k / cantidad) * PERIMETRO;
    let i = ACUMULADA.findIndex((d) => d >= meta);
    if (i < 0) i = MUESTRAS;
    const p = CURVA[i];
    puntos.push({ x: CENTRO.x + (p.x - CENTRO.x) * escala, y: CENTRO.y + (p.y - CENTRO.y) * escala });
  }
  return puntos;
}

/** Proporcion ancho/alto de la caja que contiene el corazon. */
export const PROPORCION_CORAZON = ANCHO / ALTO;

export function posicionesCorazon(n) {
  if (n <= 0) return { tamano: 0, puntos: [], centro: null };
  const exterior = n <= 14 ? n : Math.ceil(n * 0.62);
  const interior = n - exterior;

  // Tamano: lo justo para que se toquen un poco en el contorno.
  const tamano = Math.max(12, Math.min(21, ((PERIMETRO / exterior) * 0.82 * 100) / ANCHO));
  // Las fotos son cuadradas: en vertical ocupan mas % porque la caja es mas baja que ancha.
  const margenX = tamano / 2;
  const margenY = (tamano * PROPORCION_CORAZON) / 2;

  const aCaja = (p) => ({
    x: margenX + ((p.x - LIMITES.minX) / ANCHO) * (100 - 2 * margenX),
    y: margenY + ((p.y - LIMITES.minY) / ALTO) * (100 - 2 * margenY),
  });

  const puntos = [...repartir(exterior, 1), ...(interior === 1 ? [CENTRO] : repartir(interior, 0.5))];
  // centro: hueco del medio, para el texto (solo si no hay fotos por dentro).
  return { tamano, puntos: puntos.map(aCaja), centro: interior ? null : aCaja(CENTRO) };
}
