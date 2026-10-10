import { forwardRef } from "react";
import { tema } from "../../styles/tema";
import { useEstadoPagina } from "./estadoLibro";
import PaginaPortada from "./PaginaPortada";
import PaginaDedicatoria from "./PaginaDedicatoria";
import PaginaTexto from "./PaginaTexto";
import PaginaPoema from "./PaginaPoema";
import PaginaCarta from "./PaginaCarta";
import PaginaFoto from "./PaginaFoto";
import PaginaCollage from "./PaginaCollage";
import PaginaDibujo from "./PaginaDibujo";
import PaginaVideo from "./PaginaVideo";
import PaginaSeparador from "./PaginaSeparador";
import PaginaContraportada from "./PaginaContraportada";

/** tipo del JSON -> componente que lo dibuja. */
const TIPOS = {
  portada: PaginaPortada,
  dedicatoria: PaginaDedicatoria,
  texto: PaginaTexto,
  poema: PaginaPoema,
  carta: PaginaCarta,
  foto: PaginaFoto,
  collage: PaginaCollage,
  dibujo: PaginaDibujo,
  video: PaginaVideo,
  separador: PaginaSeparador,
  contraportada: PaginaContraportada,
};

/** Hojas rigidas: tapas y separadores de cartulina. */
const RIGIDAS = new Set(["portada", "contraportada", "separador"]);
/** Hojas que no llevan papel crema ni numero (son tapa). */
const TAPAS = new Set(["portada", "contraportada"]);

/**
 * Envoltorio de UNA hoja del libro.
 * react-pageflip necesita que cada hijo acepte una ref a un nodo DOM,
 * de ahi el forwardRef. El atributo data-density le dice a la libreria
 * si la hoja es rigida (tapa) o blanda (papel que se curva).
 */
const Pagina = forwardRef(function Pagina({ pagina, indice, total }, ref) {
  const { visible, cerca, lado } = useEstadoPagina(indice);

  const Componente = TIPOS[pagina.tipo] || PaginaTexto;
  const esTapa = TAPAS.has(pagina.tipo);
  const rigida = pagina.dura === true || RIGIDAS.has(pagina.tipo);

  const clasePliegue = esTapa
    ? ""
    : lado === "izq"
      ? "lib-pliegue-izq"
      : lado === "der"
        ? "lib-pliegue-der"
        : "lib-pliegue-unica";

  return (
    <div
      ref={ref}
      className="lib-hoja"
      data-density={rigida ? "hard" : "soft"}
      data-tipo={pagina.tipo}
    >
      <div
        className={`lib-hoja-interior relative h-full w-full ${
          esTapa ? "" : "lib-papel"
        } ${clasePliegue}`}
      >
        {!esTapa && tema.decoraciones.texturaPapel ? (
          <div className="lib-textura" aria-hidden="true" />
        ) : null}

        <div className="relative z-10 h-full w-full">
          <Componente
            pagina={pagina}
            indice={indice}
            total={total}
            cerca={cerca}
            visible={visible}
          />
        </div>

        {!esTapa && pagina.tipo !== "separador" ? (
          <span
            className={`lib-titulo absolute bottom-[3%] z-10 text-[10px] tracking-[0.2em] text-[var(--lib-tinta-suave)] ${
              lado === "izq" ? "left-[8%]" : "right-[8%]"
            }`}
          >
            {indice}
          </span>
        ) : null}
      </div>
    </div>
  );
});

export default Pagina;
