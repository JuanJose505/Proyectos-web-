// RESPONSABILIDAD: convertir datos en texto bonito para mostrar.
// Son funciones puras: reciben un valor y devuelven un texto.

const MESES_ABREVIADOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatearPrecio(valor) {
  return "$" + Number(valor).toLocaleString("en-US");
}

// "2025-06-24" -> "24 jun 2025"
function formatearFecha(fechaIso) {
  const [anio, mes, dia] = fechaIso.split("-");
  return Number(dia) + " " + MESES_ABREVIADOS[Number(mes) - 1] + " " + anio;
}

// "3101234567" -> "+57 310 123 4567"
function formatearTelefono(telefono) {
  return "+57 " + telefono.slice(0, 3) + " " + telefono.slice(3, 6) + " " + telefono.slice(6);
}

// "Juan Pérez" -> "JP"
function obtenerIniciales(nombre) {
  const palabras = nombre.trim().split(" ");
  const iniciales = palabras.length > 1 ? palabras[0][0] + palabras[1][0] : palabras[0][0];
  return iniciales.toUpperCase();
}

// Un color (c1 a c5) según el nombre, para el círculo del avatar
function obtenerClaseColor(nombre) {
  return "c" + ((nombre.length % 5) + 1);
}
