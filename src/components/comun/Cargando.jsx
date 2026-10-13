import pareja from "../../content/pareja.json";
import { Corazon } from "../libro/Adornos";

/**
 * Corazon que late mientras llega una pantalla. Aparece con un pequeno
 * retraso (ver .cargando en index.css) para no parpadear si carga rapido.
 * - texto: por defecto pareja.json -> textosInterfaz.cargando.
 */
export default function Cargando({ texto = pareja.textosInterfaz?.cargando, className = "min-h-[100dvh]" }) {
  return (
    <div role="status" className={`cargando flex w-full flex-col items-center justify-center gap-4 ${className}`}>
      <Corazon className="cargando-latido h-12 w-12" />
      {texto ? <p className="lib-mano text-2xl text-[var(--lib-tinta-suave)]">{texto}</p> : null}
    </div>
  );
}
