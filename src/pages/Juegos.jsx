import pareja from "../content/pareja.json";
import VolverInicio from "../components/comun/VolverInicio";

export default function Juegos() {
  // Placeholder: los juegos se construyen en src/components/juegos y se leen de src/content/juegos.json
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4">
      <VolverInicio />
      <h1 className="font-romantica text-4xl text-rose-900">{pareja.secciones.juegos.titulo}</h1>
    </main>
  );
}
