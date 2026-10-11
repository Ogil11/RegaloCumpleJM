/**
 * Iconos de las tarjetas de juegos. En juegos.json -> "icono" puedes
 * poner: cartas, pregunta, rompecabezas, ruleta, sobre, pluma, corazon,
 * estrella. Si no pones ninguno, se usa el del tipo de juego.
 */
const TRAZOS = {
  cartas: (
    <>
      <rect x="3" y="5" width="11" height="15" rx="2" transform="rotate(-8 8.5 12.5)" />
      <rect x="10" y="4" width="11" height="15" rx="2" transform="rotate(8 15.5 11.5)" />
      <path d="M15.6 9.8c-.6-.8-2-.6-2 .6 0 1 2 2.2 2 2.2s2-1.2 2-2.2c0-1.2-1.4-1.4-2-.6z" />
    </>
  ),
  pregunta: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7" />
      <circle cx="12" cy="17" r="0.6" />
    </>
  ),
  rompecabezas: (
    <path d="M4 8h3.5a2 2 0 1 1 4 0H15v3.5a2 2 0 1 1 0 4V20H11.5a2 2 0 1 0-4 0H4v-4.5a2 2 0 1 0 0-4z" />
  ),
  ruleta: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 5v16M4 13h16M6.3 7.3l11.4 11.4M17.7 7.3 6.3 18.7" />
      <path d="M10 2h4l-2 3z" />
    </>
  ),
  sobre: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="1.5" />
      <path d="m3.5 7 8.5 6.5L20.5 7" />
    </>
  ),
  pluma: (
    <>
      <path d="M19 4c-6 1-11 6-12 13l-2 3" />
      <path d="M19 4c0 6-4 11-10 12" />
      <path d="M9 12h5" />
    </>
  ),
  corazon: (
    <path d="M12 20s-7-4.4-8.8-8.5C1.8 8.2 3.6 5 6.7 4.4c2-.4 4 .6 5.3 2.2 1.3-1.6 3.3-2.6 5.3-2.2 3.1.6 4.9 3.8 3.5 7.1C19 15.6 12 20 12 20z" />
  ),
  estrella: <path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" />,
};

const POR_TIPO = {
  memorama: "cartas",
  memoria: "cartas",
  quiz: "pregunta",
  trivia: "pregunta",
  rompecabezas: "rompecabezas",
  ruleta: "ruleta",
  cartas: "sobre",
  frases: "pluma",
};

export default function IconoJuego({ icono, tipo, className = "h-6 w-6" }) {
  const trazo = TRAZOS[icono] ?? TRAZOS[POR_TIPO[tipo]] ?? TRAZOS.corazon;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {trazo}
    </svg>
  );
}
