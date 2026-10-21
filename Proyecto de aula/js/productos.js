// RESPONSABILIDAD: lo propio de la pantalla de Productos.

const formularioProducto = document.getElementById("formulario");
const campoImagen = document.getElementById("imagen");
const vistaPrevia = document.getElementById("vista-previa");
let imagenDelFormulario = ""; // imagen elegida en el formulario ("" = sin imagen)

// ----- Listado -----
function crearCeldaProducto(producto) {
  const contenedor = crearElemento("span", "persona");
  contenedor.append(crearMiniaturaProducto(producto), crearElemento("strong", "", producto.nombre));
  return crearCelda(contenedor);
}

function crearFilaProducto(producto) {
  const fila = crearElemento("tr");
  fila.dataset.id = producto.id;
  fila.append(
    crearCeldaProducto(producto),
    crearCelda(producto.categoria),
    crearCelda(formatearPrecio(producto.precio)),
    crearCelda(crearEtiquetaStock(producto.unidades, "unidades")),
    crearCelda(crearBotonesDeFila())
  );
  fila.lastChild.classList.add("derecha");
  return fila;
}

// "4 productos registrados · 4 categorías"
function actualizarContadorProductos(productos) {
  const categorias = new Set(productos.map(function (producto) { return producto.categoria; }));
  document.getElementById("contador").textContent =
    productos.length + " productos registrados · " + categorias.size + " categorías";
}

// ----- Formulario -----
function leerFormularioProducto() {
  return {
    nombre: valorDe("nombre"),
    categoria: valorDe("categoria"),
    precio: valorDe("precio"),
    unidades: valorDe("unidades"),
    imagen: imagenDelFormulario
  };
}

function convertirProducto(datos) {
  return { ...datos, precio: Number(datos.precio), unidades: Number(datos.unidades) };
}

function mostrarImagenEnFormulario(imagen) {
  imagenDelFormulario = imagen;
  mostrarSi(vistaPrevia, imagen !== "");
  if (imagen === "") {
    vistaPrevia.removeAttribute("src");
  } else {
    vistaPrevia.src = imagen;
  }
}

function llenarFormularioProducto(producto) {
  escribirValor("nombre", producto.nombre);
  escribirValor("categoria", producto.categoria);
  escribirValor("precio", producto.precio);
  escribirValor("unidades", producto.unidades);
  mostrarImagenEnFormulario(producto.imagen || "");
}

function alElegirImagen() {
  const archivo = campoImagen.files[0];
  mostrarError("imagen", "");
  if (archivo === undefined) {
    return;
  }
  const problema = validarArchivoImagen(archivo);
  if (problema !== "") {
    mostrarError("imagen", problema);
    campoImagen.value = "";
    return;
  }
  reducirImagen(archivo)
    .then(mostrarImagenEnFormulario)
    .catch(function () { mostrarError("imagen", "No se pudo leer la imagen."); });
}

campoImagen.addEventListener("change", alElegirImagen);
// Cada vez que el formulario se reinicia, también se limpia la imagen
formularioProducto.addEventListener("reset", function () { mostrarImagenEnFormulario(""); });

iniciarCrud({
  clave: "productos",
  camposBusqueda: ["nombre", "categoria"],
  textos: {
    nuevo: "Registrar producto",
    editar: "Editar producto",
    registrado: "Producto registrado correctamente.",
    actualizado: "Cambios guardados correctamente.",
    eliminado: "Producto eliminado.",
    confirmarEliminar: function (producto) { return "¿Seguro que quieres eliminar " + producto.nombre + "?"; }
  },
  crearFila: crearFilaProducto,
  leerFormulario: leerFormularioProducto,
  llenarFormulario: llenarFormularioProducto,
  validar: validarProducto,
  convertir: convertirProducto,
  alPintar: actualizarContadorProductos
});
