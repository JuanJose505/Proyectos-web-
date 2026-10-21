// RESPONSABILIDAD: la lógica de los datos (crear, editar, eliminar, buscar).
// Trabaja con listas y usa almacenamiento.js para guardarlas.
// No toca la pantalla. Sirve igual para productos, clientes y órdenes (la "clave" dice cuál).

function crearId() {
  return Date.now().toString();
}

function agregarRegistro(clave, datos) {
  const lista = leerLista(clave);
  const registro = { id: crearId(), ...datos };
  lista.unshift(registro); // el nuevo va de primero
  guardarLista(clave, lista);
  return registro;
}

function actualizarRegistro(clave, id, datosNuevos) {
  const listaActualizada = leerLista(clave).map(function (registro) {
    return registro.id === id ? { ...registro, ...datosNuevos } : registro;
  });
  guardarLista(clave, listaActualizada);
}

function eliminarRegistro(clave, id) {
  const listaSinElRegistro = leerLista(clave).filter(function (registro) {
    return registro.id !== id;
  });
  guardarLista(clave, listaSinElRegistro);
}

function buscarRegistroPorId(clave, id) {
  return leerLista(clave).find(function (registro) {
    return registro.id === id;
  });
}

// Deja solo los registros que contienen el texto en alguno de los campos indicados
function filtrarRegistros(registros, texto, campos) {
  const busqueda = texto.trim().toLowerCase();
  if (busqueda === "") {
    return registros;
  }
  return registros.filter(function (registro) {
    return campos.some(function (campo) {
      return String(registro[campo]).toLowerCase().includes(busqueda);
    });
  });
}
