/* Iconos del nodo de cada momento. Se eligen en timeline.json con "icono".
   Si el nombre no existe, sale el corazon. */

const ICONOS = {
  corazon: (
    <path d="M12 21s-7.5-4.7-9.4-9.1C1.1 8.3 3 4.8 6.4 4.1c2.2-.5 4.3.6 5.6 2.4 1.3-1.8 3.4-2.9 5.6-2.4 3.4.7 5.3 4.2 3.8 7.8C19.5 16.3 12 21 12 21z" />
  ),
  estrella: <path d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  anillo: (
    <>
      <path d="M12 2.5l3 3-3 3.2-3-3.2z" />
      <path
        fillRule="evenodd"
        d="M12 8.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm0 2.2a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6z"
      />
    </>
  ),
  avion: (
    <path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0v5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z" />
  ),
  casa: <path d="M12 3l9 8h-3v9h-4.5v-6h-3v6H6v-9H3z" />,
  regalo: (
    <path d="M3 8h7.5v4H3zm10.5 0H21v4h-7.5zM4.5 13.5h6V21h-6zm9 0h6V21h-6zM12 7.5c-1.5-3-5-3.5-5-1.2 0 1.7 3 1.7 5 1.2zm0 0c1.5-3 5-3.5 5-1.2 0 1.7-3 1.7-5 1.2z" />
  ),
  camara: (
    <path
      fillRule="evenodd"
      d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm8 2.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"
    />
  ),
  musica: (
    <path d="M20 3v12.5a2.5 2.5 0 1 1-2-2.45V7.3l-8 1.8v8.4a2.5 2.5 0 1 1-2-2.45V5.4z" />
  ),
};

export default function IconoHito({ nombre, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      {ICONOS[nombre] || ICONOS.corazon}
    </svg>
  );
}
