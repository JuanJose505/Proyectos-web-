// RESPONSABILIDAD: solo hablar con localStorage.
// No sabe nada de productos, clientes ni de la pantalla.

function leerLista(clave) {
  const textoGuardado = localStorage.getItem(clave);
  if (textoGuardado === null) {
    return [];
  }
  try {
    return JSON.parse(textoGuardado);
  } catch (error) {
    return []; // si el texto guardado está dañado, empiezo con una lista vacía
  }
}

function guardarLista(clave, lista) {
  localStorage.setItem(clave, JSON.stringify(lista));
}

function existeLista(clave) {
  return localStorage.getItem(clave) !== null;
}
