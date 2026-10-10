import { useSyncExternalStore } from "react";

// Mismo punto de corte que la clase md: de Tailwind.
const CONSULTA = "(min-width: 768px)";

function suscribir(avisar) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", avisar);
  return () => mq.removeEventListener("change", avisar);
}

/** true en escritorio/tablet ancha, false en celular. */
export default function usePantallaAncha() {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => false
  );
}
