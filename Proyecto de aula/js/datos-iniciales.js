// RESPONSABILIDAD: los datos de ejemplo con los que arranca la app la primera vez.
// Solo se usan si localStorage está vacío. Si no los quieres, borra este archivo
// y quita su <script> de los HTML.

const DATOS_INICIALES = {
  productos: [
    { id: "p1", nombre: "Sony WH-1000XM5", categoria: "Audio", precio: 349, unidades: 84, imagen: "" },
    { id: "p2", nombre: "Apple Watch Series 9", categoria: "Vestibles", precio: 399, unidades: 42, imagen: "" },
    { id: "p3", nombre: "Sony Alpha a7 IV", categoria: "Cámaras", precio: 2498, unidades: 18, imagen: "" },
    { id: "p4", nombre: "iPhone 16 Pro", categoria: "Celulares", precio: 999, unidades: 67, imagen: "" }
  ],
  clientes: [
    { id: "c1", nombre: "Olivia Rhye", correo: "olivia.rhye@example.com", telefono: "3000000000" },
    { id: "c2", nombre: "Phoenix Baker", correo: "phoenix.baker@example.com", telefono: "3000000000" },
    { id: "c3", nombre: "Lana Steiner", correo: "lana.steiner@example.com", telefono: "3000000000" },
    { id: "c4", nombre: "Demi Wilkinson", correo: "demi.wilkinson@example.com", telefono: "3000000000" },
    { id: "c5", nombre: "Candice Wu", correo: "candice.wu@example.com", telefono: "3000000000" }
  ],
  ordenes: [
    { id: "o5", codigo: "#ORD-7829", cliente: "Olivia Rhye", producto: "Sony WH-1000XM5", fecha: "2025-06-24", total: 349, estado: "entregada" },
    { id: "o4", codigo: "#ORD-7828", cliente: "Phoenix Baker", producto: "Apple Watch Series 9", fecha: "2025-06-24", total: 399, estado: "proceso" },
    { id: "o3", codigo: "#ORD-7827", cliente: "Lana Steiner", producto: "Sony Alpha a7 IV", fecha: "2025-06-23", total: 2498, estado: "entregada" },
    { id: "o2", codigo: "#ORD-7826", cliente: "Demi Wilkinson", producto: "iPhone 16 Pro", fecha: "2025-06-23", total: 999, estado: "pendiente" },
    { id: "o1", codigo: "#ORD-7825", cliente: "Candice Wu", producto: "Sony WH-1000XM5", fecha: "2025-06-22", total: 349, estado: "cancelada" }
  ]
};

function sembrarDatosIniciales() {
  Object.keys(DATOS_INICIALES).forEach(function (clave) {
    if (!existeLista(clave)) {
      guardarLista(clave, DATOS_INICIALES[clave]);
    }
  });
}

sembrarDatosIniciales();
