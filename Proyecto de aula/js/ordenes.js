// RESPONSABILIDAD: lo propio de la pantalla de Órdenes.

const ESTADOS_ORDEN = {
  entregada: { texto: "Entregada", color: "verde" },
  proceso: { texto: "En proceso", color: "lila" },
  pendiente: { texto: "Pendiente", color: "naranja" },
  cancelada: { texto: "Cancelada", color: "rojo" }
};

const filtroEstado = document.getElementById("filtro-estado");

// ----- Listado -----
function crearCeldaCliente(nombreCliente) {
  const contenedor = crearElemento("span", "persona");
  contenedor.append(crearAvatar(nombreCliente), crearElemento("span", "", nombreCliente));
  return crearCelda(contenedor);
}

function crearFilaOrden(orden) {
  const estado = ESTADOS_ORDEN[orden.estado];
  const fila = crearElemento("tr");
  fila.dataset.id = orden.id;
  fila.append(
    crearCelda(orden.codigo),
    crearCeldaCliente(orden.cliente),
    crearCelda(orden.producto),
    crearCelda(formatearFecha(orden.fecha)),
    crearCelda(formatearPrecio(orden.total)),
    crearCelda(crearEtiqueta(estado.texto, estado.color)),
    crearCelda(crearBotonesDeFila())
  );
  fila.firstChild.classList.add("id-orden");
  fila.lastChild.classList.add("derecha");
  return fila;
}

function pasaFiltroDeEstado(orden) {
  return filtroEstado.value === "todas" || orden.estado === filtroEstado.value;
}

// ----- Formulario -----
// "#ORD-7829" -> la siguiente es "#ORD-7830"
function calcularCodigoOrden(ordenes) {
  const numeros = ordenes.map(function (orden) { return Number(orden.codigo.replace("#ORD-", "")); });
  const mayor = numeros.length > 0 ? Math.max(...numeros) : 7000;
  return "#ORD-" + (mayor + 1);
}

function agregarCodigoDeOrden(datos) {
  return { ...datos, codigo: calcularCodigoOrden(leerLista("ordenes")) };
}

function leerFormularioOrden() {
  return {
    cliente: valorDe("cliente"),
    producto: valorDe("producto"),
    fecha: valorDe("fecha"),
    total: valorDe("total"),
    estado: valorDe("estado")
  };
}

function convertirOrden(datos) {
  return { ...datos, total: Number(datos.total) };
}

function llenarFormularioOrden(orden) {
  escribirValor("cliente", orden.cliente);
  escribirValor("producto", orden.producto);
  escribirValor("fecha", orden.fecha);
  escribirValor("total", orden.total);
  escribirValor("estado", orden.estado);
}

// Los clientes y productos que se pueden elegir vienen de lo que hay guardado
function llenarOpcionesDelFormulario() {
  llenarOpciones("cliente", leerLista("clientes").map(function (cliente) { return cliente.nombre; }));
  llenarOpciones("producto", leerLista("productos").map(function (producto) { return producto.nombre; }));
}

llenarOpcionesDelFormulario();

const pantallaOrdenes = iniciarCrud({
  clave: "ordenes",
  camposBusqueda: ["codigo", "cliente", "producto"],
  textos: {
    nuevo: "Registrar orden",
    editar: "Editar orden",
    registrado: "Orden registrada correctamente.",
    actualizado: "Cambios guardados correctamente.",
    eliminado: "Orden eliminada.",
    confirmarEliminar: function (orden) { return "¿Seguro que quieres eliminar la orden " + orden.codigo + "?"; }
  },
  crearFila: crearFilaOrden,
  leerFormulario: leerFormularioOrden,
  llenarFormulario: llenarFormularioOrden,
  validar: validarOrden,
  convertir: convertirOrden,
  prepararNuevo: agregarCodigoDeOrden,
  filtroAdicional: pasaFiltroDeEstado,
  alPintar: actualizarInsigniaOrdenes
});

filtroEstado.addEventListener("change", pantallaOrdenes.pintarListado);
