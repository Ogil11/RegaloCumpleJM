/**
 * Fechas en formato AAAA-MM-DD, leidas en hora local (new Date("2023-01-01")
 * las lee en UTC y en America sale el dia anterior).
 */
export function leerFecha(texto) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(texto ?? "").trim());
  if (!partes) return null;
  const [, a, m, d] = partes.map(Number);
  const fecha = new Date(a, m - 1, d);
  // Descarta fechas imposibles como 2023-02-31.
  return fecha.getMonth() === m - 1 ? fecha : null;
}

/** "1 de enero de 2023" (o como lo escriba el idioma elegido). */
export function formatearFecha(fecha, idioma) {
  if (!fecha) return "";
  try {
    return new Intl.DateTimeFormat(idioma || undefined, { day: "numeric", month: "long", year: "numeric" }).format(fecha);
  } catch {
    return fecha.toLocaleDateString();
  }
}

function diasDelMes(anio, mes) {
  return new Date(anio, mes + 1, 0).getDate();
}

/** Suma meses sin desbordar: 31 de enero + 1 mes = 28/29 de febrero. */
function sumarMeses(fecha, meses) {
  const total = fecha.getMonth() + meses;
  const anio = fecha.getFullYear() + Math.floor(total / 12);
  const mes = ((total % 12) + 12) % 12;
  return new Date(anio, mes, Math.min(fecha.getDate(), diasDelMes(anio, mes)));
}

/** Años, meses y dias completos entre `inicio` y `hoy`. null si inicio es futuro. */
export function tiempoJuntos(inicio, hoy = new Date()) {
  const fin = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  if (!inicio || fin < inicio) return null;
  let meses = (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth());
  if (fin.getDate() < inicio.getDate()) meses -= 1;
  const ancla = sumarMeses(inicio, meses);
  // Math.round evita el desfase de una hora en los cambios de horario.
  const dias = Math.round((fin - ancla) / 86400000);
  return { anios: Math.floor(meses / 12), meses: meses % 12, dias };
}
