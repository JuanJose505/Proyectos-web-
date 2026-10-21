// RESPONSABILIDAD: construir y actualizar cosas en la pantalla (el DOM).
// No guarda datos ni conoce las reglas de validación.

const ICONOS_CATEGORIA = { "Audio": "🎧", "Vestibles": "⌚", "Cámaras": "📷", "Celulares": "📱" };
const STOCK_BAJO = 20; // con menos unidades que esto, la etiqueta sale naranja

// ----- Herramientas generales -----
function crearElemento(etiqueta, clases, texto) {
  const elemento = document.createElement(etiqueta);
  if (clases) {
    elemento.className = clases;
  }
  if (texto !== undefined) {
    elemento.textContent = texto; // textContent es seguro: no interpreta HTML
  }
  return elemento;
}

function vaciarElemento(elemento) {
  elemento.replaceChildren();
}

function mostrarSi(elemento, condicion) {
  elemento.classList.toggle("oculto", !condicion);
}

function valorDe(idCampo) {
  return document.getElementById(idCampo).value.trim();
}

function escribirValor(idCampo, valor) {
  document.getElementById(idCampo).value = valor;
}

function llenarOpciones(idSelect, textos) {
  const select = document.getElementById(idSelect);
  textos.forEach(function (texto) {
    const opcion = crearElemento("option", "", texto);
    opcion.value = texto;
    select.appendChild(opcion);
  });
}

// ----- Mensajes en pantalla -----
let temporizadorAviso;

function mostrarAviso(texto) {
  const aviso = document.getElementById("aviso");
  aviso.textContent = texto;
  mostrarSi(aviso, true);
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(function () {
    mostrarSi(aviso, false);
  }, 2500);
}

function mostrarError(campo, mensaje) {
  document.getElementById(campo + "-error").textContent = mensaje;
}

function mostrarErrores(errores) {
  Object.keys(errores).forEach(function (campo) {
    mostrarError(campo, errores[campo]);
  });
}

function limpiarErrores() {
  document.querySelectorAll(".error").forEach(function (parrafo) {
    parrafo.textContent = "";
  });
}

// ----- Piezas visuales que se reutilizan en los listados -----
function crearCelda(contenido) {
  const celda = crearElemento("td");
  if (typeof contenido === "string") {
    celda.textContent = contenido;
  } else {
    celda.appendChild(contenido);
  }
  return celda;
}

function crearEtiqueta(texto, color) {
  return crearElemento("span", "etiqueta " + color, texto);
}

function crearAvatar(nombre) {
  return crearElemento("span", "avatar " + obtenerClaseColor(nombre), obtenerIniciales(nombre));
}

function crearInfoFila(titulo, detalle) {
  const info = crearElemento("div", "fila-info");
  info.append(crearElemento("strong", "", titulo), crearElemento("span", "", detalle));
  return info;
}

function crearBotonDeFila(clases, texto) {
  const boton = crearElemento("button", "boton-icono " + clases, texto);
  boton.type = "button";
  return boton;
}

function crearBotonesDeFila() {
  const contenedor = crearElemento("span", "botones-fila");
  contenedor.append(crearBotonDeFila("boton-editar", "✎"), crearBotonDeFila("peligro boton-eliminar", "🗑"));
  return contenedor;
}

function crearMiniaturaProducto(producto) {
  const miniatura = crearElemento("span", "miniatura");
  if (producto.imagen) {
    const imagen = crearElemento("img");
    imagen.src = producto.imagen;
    imagen.alt = "";
    miniatura.appendChild(imagen);
  } else {
    miniatura.textContent = ICONOS_CATEGORIA[producto.categoria];
  }
  return miniatura;
}

function crearEtiquetaStock(unidades, sufijo) {
  const color = unidades < STOCK_BAJO ? "naranja" : "verde";
  return crearEtiqueta(unidades + " " + sufijo, color);
}
