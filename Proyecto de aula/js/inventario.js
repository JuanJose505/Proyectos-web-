// RESPONSABILIDAD: lo propio de la pantalla de Inventario.
// Solo muestra los productos guardados (no registra nada) y tiene buscador.

const listadoInventario = document.getElementById("listado");
const buscadorInventario = document.getElementById("buscador");
const mensajeVacioInventario = document.getElementById("mensaje-vacio");

function crearFilaInventario(producto) {
  const fila = crearElemento("div", "fila");
  fila.append(
    crearMiniaturaProducto(producto),
    crearInfoFila(producto.nombre, producto.categoria),
    crearEtiquetaStock(producto.unidades, "en stock")
  );
  return fila;
}

function pintarInventario() {
  const productos = filtrarRegistros(leerLista("productos"), buscadorInventario.value, ["nombre", "categoria"]);
  vaciarElemento(listadoInventario);
  productos.forEach(function (producto) {
    listadoInventario.appendChild(crearFilaInventario(producto));
  });
  mostrarSi(mensajeVacioInventario, productos.length === 0);
}

buscadorInventario.addEventListener("input", pintarInventario);
pintarInventario();
