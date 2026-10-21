// RESPONSABILIDAD: preparar las imágenes para guardarlas.
// localStorage tiene poco espacio (~5 MB), así que la imagen se reduce
// y se convierte en texto (data URL) antes de guardarla.

function leerArchivoComoTexto(archivo) {
  return new Promise(function (resolver, rechazar) {
    const lector = new FileReader();
    lector.onload = function () { resolver(lector.result); };
    lector.onerror = rechazar;
    lector.readAsDataURL(archivo);
  });
}

function cargarImagen(direccion) {
  return new Promise(function (resolver, rechazar) {
    const imagen = new Image();
    imagen.onload = function () { resolver(imagen); };
    imagen.onerror = rechazar;
    imagen.src = direccion;
  });
}

function dibujarImagenReducida(imagen, ladoMaximo) {
  const escala = Math.min(1, ladoMaximo / Math.max(imagen.width, imagen.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(imagen.width * escala);
  lienzo.height = Math.round(imagen.height * escala);
  const contexto = lienzo.getContext("2d");
  contexto.fillStyle = "#ffffff"; // fondo blanco para las imágenes con transparencia
  contexto.fillRect(0, 0, lienzo.width, lienzo.height);
  contexto.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
  return lienzo.toDataURL("image/jpeg", 0.8);
}

// Devuelve una promesa con la imagen reducida (máximo 320 px de lado)
function reducirImagen(archivo) {
  return leerArchivoComoTexto(archivo)
    .then(cargarImagen)
    .then(function (imagen) {
      return dibujarImagenReducida(imagen, 320);
    });
}
