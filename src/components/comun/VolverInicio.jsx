import { Link } from "react-router-dom";
import pareja from "../../content/pareja.json";

/** Boton "Volver al inicio". El texto sale de pareja.json -> textosInterfaz. */
export default function VolverInicio() {
  return (
    <Link
      to="/"
      className="fixed left-3 top-3 z-40 flex min-h-11 items-center gap-2 rounded-full border border-[var(--lib-dorado)]/40 bg-[var(--lib-papel)]/85 px-3 py-2 text-xs font-medium text-[var(--lib-tinta)] shadow-sm backdrop-blur-sm transition hover:bg-[var(--lib-papel)]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {pareja.textosInterfaz?.volverInicio}
    </Link>
  );
}
