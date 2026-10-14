// ===== Elementos que voy a usar =====
const vistaListado = document.getElementById("vista-listado");
const vistaFormulario = document.getElementById("vista-formulario");
const tabla = document.getElementById("tabla-ordenes");
const formulario = document.getElementById("formulario");
const filtro = document.getElementById("filtro-estado");
const modal = document.getElementById("modal");

let filaEditando = null; // si es null, el formulario está registrando una nueva
let filaAEliminar = null;
let siguienteOrden = 7830; // número de la próxima orden

const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

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

// "2025-06-24" -> "24 jun 2025"
function formatearFecha(fecha) {
  const partes = fecha.split("-");
  return Number(partes[2]) + " " + meses[Number(partes[1]) - 1] + " " + partes[0];
}

// ===== Dibujar una fila de la tabla con los datos de una orden =====
function dibujarFila(fila, o) {
  fila.dataset.cliente = o.cliente;
  fila.dataset.producto = o.producto;
  fila.dataset.fecha = o.fecha;
  fila.dataset.total = o.total;
  fila.dataset.estado = o.estado;

  let texto = "Entregada";
  let color = "verde";
  if (o.estado === "proceso") {
    texto = "En proceso";
    color = "lila";
  } else if (o.estado === "pendiente") {
    texto = "Pendiente";
    color = "naranja";
  } else if (o.estado === "cancelada") {
    texto = "Cancelada";
    color = "rojo";
  }

  fila.innerHTML =
    '<td class="id-orden">' + fila.dataset.id + '</td>' +
    '<td><span class="persona"><span class="avatar c' + (o.cliente.length % 5 + 1) + '">' + iniciales(o.cliente) + '</span><span class="nombre-cliente"></span></span></td>' +
    '<td>' + o.producto + '</td>' +
    '<td>' + formatearFecha(o.fecha) + '</td>' +
    '<td><strong>$' + Number(o.total).toLocaleString("en-US") + '</strong></td>' +
    '<td><span class="etiqueta ' + color + '">' + texto + '</span></td>' +
    '<td class="derecha"><span class="botones-fila">' +
    '<button class="boton-icono boton-editar">✎</button>' +
    '<button class="boton-icono peligro boton-eliminar">🗑</button></span></td>';

  fila.querySelector(".nombre-cliente").textContent = o.cliente;
}

// ===== Filtro por estado =====
function aplicarFiltro() {
  const filas = tabla.querySelectorAll("tr");
  for (let i = 0; i < filas.length; i++) {
    if (filtro.value === "todas" || filas[i].dataset.estado === filtro.value) {
      filas[i].classList.remove("oculto");
    } else {
      filas[i].classList.add("oculto");
    }
  }
}

filtro.addEventListener("change", aplicarFiltro);

// ===== Botones del formulario =====
document.getElementById("boton-nuevo").addEventListener("click", function () {
  filaEditando = null;
  formulario.reset();
  mostrarFormulario("Registrar orden");
});

document.getElementById("boton-cancelar").addEventListener("click", mostrarListado);

// ===== Clic dentro de la tabla: ¿fue en editar o en eliminar? =====
tabla.addEventListener("click", function (evento) {
  const fila = evento.target.closest("tr");

  if (evento.target.closest(".boton-editar")) {
    filaEditando = fila;
    document.getElementById("cliente").value = fila.dataset.cliente;
    document.getElementById("producto").value = fila.dataset.producto;
    document.getElementById("fecha").value = fila.dataset.fecha;
    document.getElementById("total").value = fila.dataset.total;
    document.getElementById("estado").value = fila.dataset.estado;
    mostrarFormulario("Editar orden");
  }

  if (evento.target.closest(".boton-eliminar")) {
    filaAEliminar = fila;
    document.getElementById("modal-texto").textContent = "¿Seguro que quieres eliminar la orden " + fila.dataset.id + "?";
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
  mostrarAviso("Orden eliminada.");
});

// ===== Guardar (registrar o editar) con validación =====
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const o = {
    cliente: document.getElementById("cliente").value.trim(),
    producto: document.getElementById("producto").value,
    fecha: document.getElementById("fecha").value,
    total: document.getElementById("total").value,
    estado: document.getElementById("estado").value
  };

  let todoBien = true;
  limpiarErrores();

  if (o.cliente.length < 3) {
    mostrarError("cliente", "El nombre del cliente debe tener al menos 3 letras.");
    todoBien = false;
  }

  if (o.producto === "") {
    mostrarError("producto", "Selecciona un producto.");
    todoBien = false;
  }

  if (o.fecha === "") {
    mostrarError("fecha", "Selecciona la fecha.");
    todoBien = false;
  }

  if (o.total === "") {
    mostrarError("total", "Escribe el total.");
    todoBien = false;
  } else if (Number(o.total) <= 0) {
    mostrarError("total", "El total debe ser mayor que 0.");
    todoBien = false;
  }

  if (o.estado === "") {
    mostrarError("estado", "Selecciona el estado.");
    todoBien = false;
  }

  if (todoBien === false) {
    return;
  }

  if (filaEditando === null) {
    const fila = document.createElement("tr");
    fila.dataset.id = "#ORD-" + siguienteOrden;
    siguienteOrden = siguienteOrden + 1;
    dibujarFila(fila, o);
    tabla.prepend(fila);
    mostrarAviso("Orden registrada correctamente.");
  } else {
    dibujarFila(filaEditando, o);
    mostrarAviso("Cambios guardados correctamente.");
  }

  aplicarFiltro();
  mostrarListado();
});
