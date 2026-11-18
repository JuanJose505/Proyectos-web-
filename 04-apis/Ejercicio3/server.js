import express from "express";

const app = express();
app.use(express.json());

// Lista de productos en memoria
let productos = [
  { id: 1, nombre: "Teclado", precio: 80000, stock: 10 },
  { id: 2, nombre: "Mouse", precio: 35000, stock: 25 }
];
let siguienteId = 3;

// 1. GET /productos (Incluye el RETO de filtro: GET /productos?max=50000) -> 200
app.get("/productos", (req, res) => {
  const { max } = req.query;
  if (max !== undefined) {
    const maxPrecio = Number(max);
    const filtrados = productos.filter((p) => p.precio <= maxPrecio);
    return res.status(200).json(filtrados);
  }
  res.status(200).json(productos);
});

// 2. GET /productos/:id (Obtener por ID) -> 200 o 404
app.get("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    return res.status(404).json({ error: "No existe" });
  }
  res.status(200).json(producto);
});

// 3. POST /productos (Crear producto) -> 201 o 400
app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

  // Validación: deben enviarse nombre y precio
  if (!nombre || precio === undefined) {
    return res.status(400).json({ error: "Faltan datos" });
  }
  // Validación: precio y stock >= 0
  if (precio < 0 || (stock !== undefined && stock < 0)) {
    return res.status(400).json({ error: "El precio y el stock deben ser >= 0" });
  }

  const nuevo = {
    id: siguienteId++,
    nombre,
    precio: Number(precio),
    stock: stock !== undefined ? Number(stock) : 0
  };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

// 4. PUT /productos/:id (Actualización total - exige TODOS los campos) -> 200, 400 o 404
app.put("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    return res.status(404).json({ error: "No existe" });
  }

  const { nombre, precio, stock } = req.body;

  // PUT exige todos los campos obligatorios
  if (!nombre || precio === undefined || stock === undefined) {
    return res.status(400).json({ error: "PUT exige todos los campos (nombre, precio, stock)" });
  }
  // Validación: precio y stock >= 0
  if (precio < 0 || stock < 0) {
    return res.status(400).json({ error: "El precio y el stock deben ser >= 0" });
  }

  producto.nombre = nombre;
  producto.precio = Number(precio);
  producto.stock = Number(stock);

  res.status(200).json(producto);
});

// 5. PATCH /productos/:id (Actualización parcial - NO exige todos los campos) -> 200, 400 o 404
app.patch("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    return res.status(404).json({ error: "No existe" });
  }

  const { nombre, precio, stock } = req.body;

  // Valida que sean >= 0 solo si vienen en el body
  if (precio !== undefined && precio < 0) {
    return res.status(400).json({ error: "El precio debe ser >= 0" });
  }
  if (stock !== undefined && stock < 0) {
    return res.status(400).json({ error: "El stock debe ser >= 0" });
  }

  if (nombre !== undefined) producto.nombre = nombre;
  if (precio !== undefined) producto.precio = Number(precio);
  if (stock !== undefined) producto.stock = Number(stock);

  res.status(200).json(producto);
});

// 6. DELETE /productos/:id (Eliminar producto) -> 204 o 404
app.delete("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const i = productos.findIndex((p) => p.id === id);
  if (i === -1) {
    return res.status(404).json({ error: "No existe" });
  }
  productos.splice(i, 1);
  res.status(204).end();
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor listo en http://localhost:${PORT}`));
