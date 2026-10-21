// RESPONSABILIDAD: decidir si lo que escribió el usuario es válido.
// Cada función recibe datos y devuelve un mensaje de error ("" si está bien).
// No toca la pantalla ni localStorage.

const TAMANO_MAXIMO_IMAGEN = 5 * 1024 * 1024; // 5 MB

// ----- Reglas pequeñas que se reutilizan -----
function validarTextoMinimo(texto, minimo, mensaje) {
  return texto.length < minimo ? mensaje : "";
}

function validarObligatorio(valor, mensaje) {
  return valor === "" ? mensaje : "";
}

function validarMayorQueCero(valor, mensajeVacio, mensajeInvalido) {
  if (valor === "") {
    return mensajeVacio;
  }
  return Number(valor) <= 0 ? mensajeInvalido : "";
}

function validarEnteroNoNegativo(valor) {
  if (valor === "") {
    return "Escribe las unidades disponibles.";
  }
  const numero = Number(valor);
  return Number.isInteger(numero) && numero >= 0 ? "" : "Las unidades deben ser un número entero, 0 o más.";
}

function validarCorreo(correo) {
  if (correo === "") {
    return "Escribe el correo.";
  }
  const esValido = correo.includes("@") && correo.includes(".") && !correo.includes(" ");
  return esValido ? "" : "Escribe un correo válido, por ejemplo nombre@correo.com.";
}

function validarTelefono(telefono) {
  if (telefono === "") {
    return "Escribe el teléfono.";
  }
  const esValido = telefono.length === 10 && !isNaN(telefono);
  return esValido ? "" : "El teléfono debe tener 10 números, sin espacios.";
}

function validarArchivoImagen(archivo) {
  if (!archivo.type.startsWith("image/")) {
    return "El archivo debe ser una imagen (JPG, PNG, WEBP...).";
  }
  return archivo.size > TAMANO_MAXIMO_IMAGEN ? "La imagen no puede pesar más de 5 MB." : "";
}

// Junta los errores en un objeto: { campo: mensaje }. Si está vacío, todo está bien.
function registrarError(errores, campo, mensaje) {
  if (mensaje !== "") {
    errores[campo] = mensaje;
  }
}

// ----- Validación de cada formulario -----
function validarProducto(datos) {
  const errores = {};
  registrarError(errores, "nombre", validarTextoMinimo(datos.nombre, 3, "El nombre debe tener al menos 3 letras."));
  registrarError(errores, "categoria", validarObligatorio(datos.categoria, "Selecciona una categoría."));
  registrarError(errores, "precio", validarMayorQueCero(datos.precio, "Escribe el precio.", "El precio debe ser mayor que 0."));
  registrarError(errores, "unidades", validarEnteroNoNegativo(datos.unidades));
  return errores;
}

function validarCliente(datos) {
  const errores = {};
  registrarError(errores, "nombre", validarTextoMinimo(datos.nombre, 3, "El nombre debe tener al menos 3 letras."));
  registrarError(errores, "correo", validarCorreo(datos.correo));
  registrarError(errores, "telefono", validarTelefono(datos.telefono));
  return errores;
}

function validarOrden(datos) {
  const errores = {};
  registrarError(errores, "cliente", validarObligatorio(datos.cliente, "Selecciona un cliente."));
  registrarError(errores, "producto", validarObligatorio(datos.producto, "Selecciona un producto."));
  registrarError(errores, "fecha", validarObligatorio(datos.fecha, "Selecciona la fecha."));
  registrarError(errores, "total", validarMayorQueCero(datos.total, "Escribe el total.", "El total debe ser mayor que 0."));
  registrarError(errores, "estado", validarObligatorio(datos.estado, "Selecciona un estado."));
  return errores;
}
