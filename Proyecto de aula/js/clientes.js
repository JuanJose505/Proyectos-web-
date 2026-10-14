// ===== Elementos que voy a usar =====
const vistaListado = document.getElementById("vista-listado");
const vistaFormulario = document.getElementById("vista-formulario");
const lista = document.getElementById("lista-clientes");
const formulario = document.getElementById("formulario");
const modal = document.getElementById("modal");

let filaEditando = null; // si es null, el formulario está registrando uno nuevo
let filaAEliminar = null;

// ===== Cambiar entre el listado y el formulario =====
function mostrarListado() {
  vistaFormulario.classList.add("oculto");
  vistaListado.classList.remove("oculto");
  window.scrollTo(0, 0);
}

function mostrarFormulario(titulo) {
  document.getElementById("titulo-formulario").textContent = titulo;
  limpiarErrores();
  vistaListado.classList.add("oculto");
  vistaFormulario.classList.remove("oculto");
  window.scrollTo(0, 0);
}

// ===== Dibujar un cliente en la lista =====
function dibujarFila(fila, c) {
  fila.dataset.nombre = c.nombre;
  fila.dataset.correo = c.correo;
  fila.dataset.telefono = c.telefono;

  const telefono = "+57 " + c.telefono.slice(0, 3) + " " + c.telefono.slice(3, 6) + " " + c.telefono.slice(6);

  fila.innerHTML =
    '<span class="avatar c' + (c.nombre.length % 5 + 1) + '">' + iniciales(c.nombre) + '</span>' +
    '<div class="fila-info"><strong></strong><span></span></div>' +
    '<span class="etiqueta verde">Activo</span>' +
    '<span class="botones-fila">' +
    '<button class="boton-icono boton-editar">✎</button>' +
    '<button class="boton-icono peligro boton-eliminar">🗑</button></span>';

  fila.querySelector("strong").textContent = c.nombre;
  fila.querySelector(".fila-info span").textContent = c.correo + " · " + telefono;
}

// ===== Botones del formulario =====
document.getElementById("boton-nuevo").addEventListener("click", function () {
  filaEditando = null;
  formulario.reset();
  mostrarFormulario("Registrar cliente");
});

document.getElementById("boton-cancelar").addEventListener("click", mostrarListado);

// ===== Clic dentro de la lista: ¿fue en editar o en eliminar? =====
lista.addEventListener("click", function (evento) {
  const fila = evento.target.closest(".fila");

  if (evento.target.closest(".boton-editar")) {
    filaEditando = fila;
    document.getElementById("nombre").value = fila.dataset.nombre;
    document.getElementById("correo").value = fila.dataset.correo;
    document.getElementById("telefono").value = fila.dataset.telefono;
    mostrarFormulario("Editar cliente");
  }

  if (evento.target.closest(".boton-eliminar")) {
    filaAEliminar = fila;
    document.getElementById("modal-texto").textContent = "¿Seguro que quieres eliminar a " + fila.dataset.nombre + "?";
    modal.classList.remove("oculto");
  }
});

// ===== Ventana de confirmación para eliminar =====
document.getElementById("modal-cancelar").addEventListener("click", function () {
  modal.classList.add("oculto");
});

document.getElementById("modal-aceptar").addEventListener("click", function () {
  filaAEliminar.remove();
  modal.classList.add("oculto");
  mostrarAviso("Cliente eliminado.");
});

// ===== Guardar (registrar o editar) con validación =====
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const c = {
    nombre: document.getElementById("nombre").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    telefono: document.getElementById("telefono").value.trim()
  };

  let todoBien = true;
  limpiarErrores();

  if (c.nombre.length < 3) {
    mostrarError("nombre", "El nombre debe tener al menos 3 letras.");
    todoBien = false;
  }

  if (c.correo === "") {
    mostrarError("correo", "Escribe el correo.");
    todoBien = false;
  } else if (!c.correo.includes("@") || !c.correo.includes(".") || c.correo.includes(" ")) {
    mostrarError("correo", "Escribe un correo válido, por ejemplo nombre@correo.com.");
    todoBien = false;
  }

  if (c.telefono === "") {
    mostrarError("telefono", "Escribe el teléfono.");
    todoBien = false;
  } else if (c.telefono.length !== 10 || isNaN(c.telefono)) {
    mostrarError("telefono", "El teléfono debe tener 10 números, sin espacios.");
    todoBien = false;
  }

  if (todoBien === false) {
    return;
  }

  if (filaEditando === null) {
    const fila = document.createElement("div");
    fila.className = "fila";
    dibujarFila(fila, c);
    lista.prepend(fila);
    mostrarAviso("Cliente registrado correctamente.");
  } else {
    dibujarFila(filaEditando, c);
    mostrarAviso("Cambios guardados correctamente.");
  }

  mostrarListado();
});
