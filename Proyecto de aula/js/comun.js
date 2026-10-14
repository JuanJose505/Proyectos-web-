// Código que usan todas las páginas

// ----- Menú del celular -----
const botonMenu = document.getElementById("boton-menu");
const sidebar = document.getElementById("sidebar");
const fondo = document.getElementById("fondo");

botonMenu.addEventListener("click", function () {
  if (window.innerWidth > 860) {
    // Escritorio: oculta o muestra la barra de la izquierda
    document.body.classList.toggle("menu-oculto");
  } else {
    // Celular y tableta: el menú se desliza encima de la página
    sidebar.classList.toggle("abierto");
    fondo.classList.toggle("oculto");
  }
});

fondo.addEventListener("click", function () {
  sidebar.classList.remove("abierto");
  fondo.classList.add("oculto");
});

// ----- Mensaje corto en pantalla (se esconde solo) -----
const aviso = document.getElementById("aviso");

function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.classList.remove("oculto");
  setTimeout(function () {
    aviso.classList.add("oculto");
  }, 2500);
}

// ----- Ayudas para los formularios -----
// Escribe un mensaje de error debajo de un campo
function mostrarError(campo, mensaje) {
  document.getElementById(campo + "-error").textContent = mensaje;
}

// Borra todos los mensajes de error
function limpiarErrores() {
  const errores = document.querySelectorAll(".error");
  for (let i = 0; i < errores.length; i++) {
    errores[i].textContent = "";
  }
}

// "Juan Pérez" -> "JP"
function iniciales(nombre) {
  const partes = nombre.trim().split(" ");
  let letras = partes[0][0];
  if (partes.length > 1) {
    letras = letras + partes[1][0];
  }
  return letras.toUpperCase();
}
