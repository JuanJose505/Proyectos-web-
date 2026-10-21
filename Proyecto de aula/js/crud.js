// RESPONSABILIDAD: el flujo de una pantalla con listado, formulario, editar y eliminar.
// Es genérico: no sabe si trabaja con productos, clientes u órdenes.
// Cada pantalla le entrega una "configuración" con lo que cambia entre ellas.
//
// Configuración que recibe:
//   clave, camposBusqueda, textos, crearFila, leerFormulario, llenarFormulario, validar
//   (opcionales) convertir, prepararNuevo, filtroAdicional, alPintar

function iniciarCrud(config) {
  const vistaListado = document.getElementById("vista-listado");
  const vistaFormulario = document.getElementById("vista-formulario");
  const listado = document.getElementById("listado");
  const mensajeVacio = document.getElementById("mensaje-vacio");
  const buscador = document.getElementById("buscador");
  const formulario = document.getElementById("formulario");
  const modal = document.getElementById("modal");

  let idEditando = null; // null = el formulario está registrando uno nuevo
  let idAEliminar = null;

  // ----- Listado -----
  function obtenerRegistrosVisibles(todos) {
    const buscados = filtrarRegistros(todos, buscador.value, config.camposBusqueda);
    return config.filtroAdicional ? buscados.filter(config.filtroAdicional) : buscados;
  }

  function pintarListado() {
    const todos = leerLista(config.clave);
    const visibles = obtenerRegistrosVisibles(todos);
    vaciarElemento(listado);
    visibles.forEach(function (registro) {
      listado.appendChild(config.crearFila(registro));
    });
    mostrarSi(mensajeVacio, visibles.length === 0);
    if (config.alPintar) {
      config.alPintar(todos);
    }
  }

  // ----- Cambiar entre el listado y el formulario -----
  function mostrarListado() {
    mostrarSi(vistaFormulario, false);
    mostrarSi(vistaListado, true);
    window.scrollTo(0, 0);
  }

  function mostrarFormulario(titulo) {
    document.getElementById("titulo-formulario").textContent = titulo;
    limpiarErrores();
    mostrarSi(vistaListado, false);
    mostrarSi(vistaFormulario, true);
    window.scrollTo(0, 0);
  }

  function abrirFormularioNuevo() {
    idEditando = null;
    formulario.reset();
    mostrarFormulario(config.textos.nuevo);
  }

  function abrirFormularioEdicion(id) {
    idEditando = id;
    formulario.reset();
    config.llenarFormulario(buscarRegistroPorId(config.clave, id));
    mostrarFormulario(config.textos.editar);
  }

  // ----- Guardar -----
  function guardarRegistro(datos) {
    try {
      if (idEditando === null) {
        agregarRegistro(config.clave, config.prepararNuevo ? config.prepararNuevo(datos) : datos);
        mostrarAviso(config.textos.registrado);
      } else {
        actualizarRegistro(config.clave, idEditando, datos);
        mostrarAviso(config.textos.actualizado);
      }
    } catch (error) {
      mostrarAviso("No se pudo guardar: el almacenamiento del navegador está lleno.");
      return;
    }
    pintarListado();
    mostrarListado();
  }

  function manejarEnvioDelFormulario(evento) {
    evento.preventDefault(); // para que la página no se recargue
    const datos = config.leerFormulario();
    const errores = config.validar(datos);
    limpiarErrores();
    mostrarErrores(errores);
    if (Object.keys(errores).length === 0) {
      guardarRegistro(config.convertir ? config.convertir(datos) : datos);
    }
  }

  // ----- Eliminar -----
  function pedirConfirmacion(id) {
    idAEliminar = id;
    const registro = buscarRegistroPorId(config.clave, id);
    document.getElementById("modal-texto").textContent = config.textos.confirmarEliminar(registro);
    mostrarSi(modal, true);
  }

  function confirmarEliminacion() {
    eliminarRegistro(config.clave, idAEliminar);
    mostrarSi(modal, false);
    pintarListado();
    mostrarAviso(config.textos.eliminado);
  }

  // ----- Clic en una fila: ¿fue en editar o en eliminar? -----
  function manejarClicEnListado(evento) {
    const fila = evento.target.closest("[data-id]");
    if (fila === null) {
      return;
    }
    if (evento.target.closest(".boton-editar")) {
      abrirFormularioEdicion(fila.dataset.id);
    } else if (evento.target.closest(".boton-eliminar")) {
      pedirConfirmacion(fila.dataset.id);
    }
  }

  // ----- Conectar los eventos -----
  document.getElementById("boton-nuevo").addEventListener("click", abrirFormularioNuevo);
  document.getElementById("boton-cancelar").addEventListener("click", mostrarListado);
  document.getElementById("modal-cancelar").addEventListener("click", function () { mostrarSi(modal, false); });
  document.getElementById("modal-aceptar").addEventListener("click", confirmarEliminacion);
  formulario.addEventListener("submit", manejarEnvioDelFormulario);
  listado.addEventListener("click", manejarClicEnListado);
  buscador.addEventListener("input", pintarListado); // filtra mientras se escribe

  pintarListado();
  return { pintarListado: pintarListado };
}
