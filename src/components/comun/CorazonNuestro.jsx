import pareja from "../../content/pareja.json";
import { Corazon } from "../libro/Adornos";

/** El corazon que los representa: pareja.json -> corazon (por ejemplo "💗"). */
export const corazonPareja = pareja.corazon || "";

/**
 * Muestra el corazon de pareja.json llenando la caja que le den con
 * className (h-10 w-10, por ejemplo). Se ve con los emojis del celular
 * de quien lo abre. Si "corazon" esta vacio, sale el corazon dibujado.
 */
export default function CorazonNuestro({ className = "" }) {
  if (!corazonPareja) return <Corazon className={className} />;
  return (
    <span aria-hidden="true" className={`corazon-nuestro ${className}`}>
      <span>{corazonPareja}</span>
    </span>
  );
}
