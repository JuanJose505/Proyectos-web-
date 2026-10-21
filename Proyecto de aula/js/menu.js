// RESPONSABILIDAD: el menú lateral (se usa en todas las páginas).

const barraLateral = document.getElementById("sidebar");
const fondoOscuro = document.getElementById("fondo");

function alternarMenu() {
  if (window.innerWidth > 860) {
    document.body.classList.toggle("menu-oculto"); // escritorio: oculta o muestra la barra
  } else {
    barraLateral.classList.toggle("abierto"); // celular: el menú se desliza encima
    fondoOscuro.classList.toggle("oculto");
  }
}

function cerrarMenuMovil() {
  barraLateral.classList.remove("abierto");
  fondoOscuro.classList.add("oculto");
}

// El número junto a "Órdenes" son las órdenes que todavía hay que atender
function actualizarInsigniaOrdenes() {
  const ordenesPorAtender = leerLista("ordenes").filter(function (orden) {
    return orden.estado === "pendiente" || orden.estado === "proceso";
  });
  document.getElementById("insignia-ordenes").textContent = ordenesPorAtender.length;
}

document.getElementById("boton-menu").addEventListener("click", alternarMenu);
fondoOscuro.addEventListener("click", cerrarMenuMovil);
actualizarInsigniaOrdenes();
