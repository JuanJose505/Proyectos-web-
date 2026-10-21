// RESPONSABILIDAD: lo propio de la pantalla de Clientes.

function crearFilaCliente(cliente) {
  const fila = crearElemento("div", "fila");
  fila.dataset.id = cliente.id;
  fila.append(
    crearAvatar(cliente.nombre),
    crearInfoFila(cliente.nombre, cliente.correo + " · " + formatearTelefono(cliente.telefono)),
    crearEtiqueta("Activo", "verde"),
    crearBotonesDeFila()
  );
  return fila;
}

function leerFormularioCliente() {
  return {
    nombre: valorDe("nombre"),
    correo: valorDe("correo"),
    telefono: valorDe("telefono")
  };
}

function llenarFormularioCliente(cliente) {
  escribirValor("nombre", cliente.nombre);
  escribirValor("correo", cliente.correo);
  escribirValor("telefono", cliente.telefono);
}

iniciarCrud({
  clave: "clientes",
  camposBusqueda: ["nombre", "correo", "telefono"],
  textos: {
    nuevo: "Registrar cliente",
    editar: "Editar cliente",
    registrado: "Cliente registrado correctamente.",
    actualizado: "Cambios guardados correctamente.",
    eliminado: "Cliente eliminado.",
    confirmarEliminar: function (cliente) { return "¿Seguro que quieres eliminar a " + cliente.nombre + "?"; }
  },
  crearFila: crearFilaCliente,
  leerFormulario: leerFormularioCliente,
  llenarFormulario: llenarFormularioCliente,
  validar: validarCliente
});
