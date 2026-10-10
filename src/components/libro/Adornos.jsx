import { tema } from "../../styles/tema";

/* Adornos en SVG/CSS. Se apagan desde tema.decoraciones. */

export function Corazon({ className = "", color = "var(--lib-rosa)", ...resto }) {
  if (!tema.decoraciones.corazones) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...resto}>
      <path
        d="M12 21s-7.5-4.7-9.4-9.1C1.1 8.3 3 4.8 6.4 4.1c2.2-.5 4.3.6 5.6 2.4 1.3-1.8 3.4-2.9 5.6-2.4 3.4.7 5.3 4.2 3.8 7.8C19.5 16.3 12 21 12 21z"
        fill={color}
      />
    </svg>
  );
}

export function Flor({
  className = "",
  color = "var(--lib-dorado-claro)",
  centro = "var(--lib-dorado)",
  ...resto
}) {
  if (!tema.decoraciones.flores) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...resto}>
      <g fill={color}>
        {[0, 72, 144, 216, 288].map((g) => (
          <ellipse key={g} cx="12" cy="6.2" rx="3.1" ry="5.1" transform={`rotate(${g} 12 12)`} />
        ))}
      </g>
      <circle cx="12" cy="12" r="2.5" fill={centro} />
    </svg>
  );
}

export function Hoja({ className = "", color = "var(--lib-salvia)", ...resto }) {
  if (!tema.decoraciones.flores) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...resto}>
      <path d="M12 2c6 4 8 9 8 13 0 4-3 7-8 7s-8-3-8-7c0-4 2-9 8-13z" fill={color} opacity="0.75" />
      <path d="M12 3v18" stroke="color-mix(in srgb, var(--lib-brillo) 55%, transparent)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

/** Cinta washi decorativa. `indice` elige el color de tema.decoraciones. */
export function WashiTape({ className = "", indice = 0, rotacion = -4, style }) {
  if (!tema.decoraciones.washiTape) return null;
  const colores = tema.decoraciones.coloresWashi;
  const color = colores[indice % colores.length];
  return (
    <span
      aria-hidden="true"
      className={`lib-washi absolute block ${className}`}
      style={{ backgroundColor: color, transform: `rotate(${rotacion}deg)`, ...style }}
    />
  );
}

/** Esquinas de album para sujetar una foto. */
export function EsquinasFoto() {
  if (!tema.decoraciones.esquinasFoto) return null;
  const base = "absolute h-5 w-5 pointer-events-none border-[color-mix(in_srgb,var(--lib-dorado)_55%,transparent)]";
  return (
    <>
      <span aria-hidden="true" className={`${base} left-0 top-0 border-l-2 border-t-2`} />
      <span aria-hidden="true" className={`${base} right-0 top-0 border-r-2 border-t-2`} />
      <span aria-hidden="true" className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <span aria-hidden="true" className={`${base} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}

/** Filigrana para separar bloques de texto. */
export function Filigrana({ className = "" }) {
  if (!tema.decoraciones.filigrana) return null;
  return (
    <svg viewBox="0 0 120 12" aria-hidden="true" className={className}>
      <path d="M2 6h38M80 6h38" stroke="var(--lib-dorado)" strokeWidth="1" opacity="0.7" fill="none" />
      <path
        d="M60 1.5c3 2 5 3.2 5 4.5S63 8.5 60 10.5C57 8.5 55 7.3 55 6s2-2.5 5-4.5z"
        fill="var(--lib-rosa)"
        opacity="0.85"
      />
      <circle cx="47" cy="6" r="1.6" fill="var(--lib-dorado)" opacity="0.8" />
      <circle cx="73" cy="6" r="1.6" fill="var(--lib-dorado)" opacity="0.8" />
    </svg>
  );
}

/** Adornos sueltos en las esquinas de una pagina. */
export function AdornosEsquina({ variante = 0 }) {
  const variantes = [
    <>
      <Flor className="absolute -left-1 -top-1 h-12 w-12 opacity-40" />
      <Corazon className="absolute bottom-3 right-3 h-4 w-4 opacity-45" />
    </>,
    <>
      <Hoja className="absolute right-2 top-2 h-10 w-10 opacity-35" />
      <Corazon className="absolute bottom-4 left-4 h-3 w-3 opacity-40" />
    </>,
    <>
      <Corazon className="absolute right-4 top-4 h-5 w-5 opacity-35" />
      <Flor className="absolute bottom-2 left-2 h-10 w-10 opacity-30" />
    </>,
  ];
  return <div aria-hidden="true">{variantes[variante % variantes.length]}</div>;
}
