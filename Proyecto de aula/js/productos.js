// ===== Elementos que voy a usar =====
const vistaListado = document.getElementById("vista-listado");
const vistaFormulario = document.getElementById("vista-formulario");
const tabla = document.getElementById("tabla-productos");
const formulario = document.getElementById("formulario");
const modal = document.getElementById("modal");

let filaEditando = null; // si es null, el formulario está registrando uno nuevo
let filaAEliminar = null;
let imagenActual = ""; // dirección de la imagen elegida ("" = sin imagen)

const campoImagen = document.getElementById("imagen");
const vistaPrevia = document.getElementById("vista-previa");

const iconos = { "Audio": "🎧", "Vestibles": "⌚", "Cámaras": "📷", "Celulares": "📱" };

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

// Muestra u oculta la vista previa de la imagen en el formulario
function mostrarVistaPrevia(direccion) {
  imagenActual = direccion;
  if (direccion === "") {
    vistaPrevia.classList.add("oculto");
  } else {
    vistaPrevia.src = direccion;
    vistaPrevia.classList.remove("oculto");
  }
}

// ===== Elegir una imagen =====
campoImagen.addEventListener("change", function () {
  const archivo = campoImagen.files[0];
  mostrarError("imagen", "");

  if (archivo === undefined) {
    return;
  }

  if (!archivo.type.startsWith("image/")) {
    mostrarError("imagen", "El archivo debe ser una imagen (JPG, PNG, WEBP...).");
    campoImagen.value = "";
  } else if (archivo.size > 2 * 1024 * 1024) {
    mostrarError("imagen", "La imagen no puede pesar más de 2 MB.");
    campoImagen.value = "";
  } else {
    mostrarVistaPrevia(URL.createObjectURL(archivo));
  }
});

// ===== Dibujar una fila de la tabla con los datos de un producto =====
function dibujarFila(fila, p) {
  fila.dataset.nombre = p.nombre;
  fila.dataset.categoria = p.categoria;
  fila.dataset.precio = p.precio;
  fila.dataset.unidades = p.unidades;
  fila.dataset.imagen = p.imagen;

  // Si hay imagen la muestro; si no, el emoji de la categoría
  let miniatura = iconos[p.categoria];
  if (p.imagen !== "") {
    miniatura = '<img src="' + p.imagen + '" alt="">';
  }

  let color = "verde";
  if (Number(p.unidades) < 20) {
    color = "naranja";
  }

  fila.innerHTML =
    '<td><span class="persona"><span class="miniatura">' + miniatura + '</span><strong></strong></span></td>' +
    '<td>' + p.categoria + '</td>' +
    '<td>$' + Number(p.precio).toLocaleString("en-US") + '</td>' +
    '<td><span class="etiqueta ' + color + '">' + p.unidades + ' unidades</span></td>' +
    '<td class="derecha"><span class="botones-fila">' +
    '<button class="boton-icono boton-editar">✎</button>' +
    '<button class="boton-icono peligro boton-eliminar">🗑</button></span></td>';

  // El nombre lo escribo con textContent para que sea seguro
  fila.querySelector("strong").textContent = p.nombre;
}

// "4 productos registrados · 4 categorías"
function actualizarContador() {
  const filas = tabla.querySelectorAll("tr");
  const categorias = [];
  for (let i = 0; i < filas.length; i++) {
    if (!categorias.includes(filas[i].dataset.categoria)) {
      categorias.push(filas[i].dataset.categoria);
    }
  }
  document.getElementById("contador").textContent =
    filas.length + " productos registrados · " + categorias.length + " categorías";
}

// ===== Botones del formulario =====
document.getElementById("boton-nuevo").addEventListener("click", function () {
  filaEditando = null;
  formulario.reset();
  mostrarVistaPrevia("");
  mostrarFormulario("Registrar producto");
});

document.getElementById("boton-cancelar").addEventListener("click", mostrarListado);

// ===== Clic dentro de la tabla: ¿fue en editar o en eliminar? =====
tabla.addEventListener("click", function (evento) {
  const fila = evento.target.closest("tr");

  if (evento.target.closest(".boton-editar")) {
    filaEditando = fila;
    document.getElementById("nombre").value = fila.dataset.nombre;
    document.getElementById("categoria").value = fila.dataset.categoria;
    document.getElementById("precio").value = fila.dataset.precio;
    document.getElementById("unidades").value = fila.dataset.unidades;
    campoImagen.value = "";
    mostrarVistaPrevia(fila.dataset.imagen || "");
    mostrarFormulario("Editar producto");
  }

  if (evento.target.closest(".boton-eliminar")) {
    filaAEliminar = fila;
    document.getElementById("modal-texto").textContent = "¿Seguro que quieres eliminar " + fila.dataset.nombre + "?";
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
  actualizarContador();
  mostrarAviso("Producto eliminado.");
});

// ===== Guardar (registrar o editar) con validación =====
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // para que la página no se recargue

  const p = {
    nombre: document.getElementById("nombre").value.trim(),
    categoria: document.getElementById("categoria").value,
    precio: document.getElementById("precio").value,
    unidades: document.getElementById("unidades").value,
    imagen: imagenActual
  };

  let todoBien = true;
  limpiarErrores();

  if (p.nombre.length < 3) {
    mostrarError("nombre", "El nombre debe tener al menos 3 letras.");
    todoBien = false;
  }

  if (p.categoria === "") {
    mostrarError("categoria", "Selecciona una categoría.");
    todoBien = false;
  }

  if (p.precio === "") {
    mostrarError("precio", "Escribe el precio.");
    todoBien = false;
  } else if (Number(p.precio) <= 0) {
    mostrarError("precio", "El precio debe ser mayor que 0.");
    todoBien = false;
  }

  if (p.unidades === "") {
    mostrarError("unidades", "Escribe las unidades disponibles.");
    todoBien = false;
  } else if (Number(p.unidades) < 0 || !Number.isInteger(Number(p.unidades))) {
    mostrarError("unidades", "Las unidades deben ser un número entero, 0 o más.");
    todoBien = false;
  }

  if (todoBien === false) {
    return; // me quedo en el formulario mostrando los errores
  }

  if (filaEditando === null) {
    // Registrar: creo una fila nueva y la pongo de primera en la tabla
    const fila = document.createElement("tr");
    dibujarFila(fila, p);
    tabla.prepend(fila);
    mostrarAviso("Producto registrado correctamente.");
  } else {
    // Editar: vuelvo a dibujar la fila que estaba editando
    dibujarFila(filaEditando, p);
    mostrarAviso("Cambios guardados correctamente.");
  }

  actualizarContador();
  mostrarListado();
});

// ===== Buscador =====
document.getElementById("buscador").addEventListener("input", function () {
  const texto = this.value.toLowerCase();
  const filas = tabla.querySelectorAll("tr");

  for (let i = 0; i < filas.length; i++) {
    if (filas[i].textContent.toLowerCase().includes(texto)) {
      filas[i].classList.remove("oculto");
    } else {
      filas[i].classList.add("oculto");
    }
  }
});
