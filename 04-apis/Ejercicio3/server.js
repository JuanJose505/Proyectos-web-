
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db.js";

const app = express();
app.use(express.json());

// 1. REGISTRO DE USUARIOS
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO usuarios (email, password) VALUES (?, ?)",
      [email, hash]
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// 2. INICIO DE SESIÓN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const [usuarios] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = usuarios[0];

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// 3. MIDDLEWARE PARA VERIFICAR TOKEN
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Token no proporcionado"
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (error, usuario) => {
    if (error) {
      return res.status(403).json({
        error: "Token inválido o expirado"
      });
    }

    req.usuario = usuario;
    next();
  });
}

// 4. MIDDLEWARE PARA VERIFICAR ADMINISTRADOR
function verificarAdmin(req, res, next) {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({
      error: "No tienes permisos de administrador"
    });
  }

  next();
}

// Lista de productos en memoria
let productos = [
  { id: 1, nombre: "Teclado", precio: 80000, stock: 10 },
  { id: 2, nombre: "Mouse", precio: 35000, stock: 25 }
];

let siguienteId = 3;

// 5. GET /productos (Público)
app.get("/productos", (req, res) => {
  const { max } = req.query;

  if (max !== undefined) {
    const maxPrecio = Number(max);
    const filtrados = productos.filter((p) => p.precio <= maxPrecio);
    return res.status(200).json(filtrados);
  }

  res.status(200).json(productos);
});

// 6. GET /productos/:id (Público)
app.get("/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: "No existe" });
  }

  res.status(200).json(producto);
});

// 7. POST /productos (Requiere token)
app.post("/productos", verificarToken, (req, res) => {
  const { nombre, precio, stock } = req.body;

  if (!nombre || precio === undefined) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  if (precio < 0 || (stock !== undefined && stock < 0)) {
    return res.status(400).json({
      error: "El precio y el stock deben ser >= 0"
    });
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

// 8. PUT /productos/:id (Requiere token)
app.put("/productos/:id", verificarToken, (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: "No existe" });
  }

  const { nombre, precio, stock } = req.body;

  if (!nombre || precio === undefined || stock === undefined) {
    return res.status(400).json({
      error: "PUT exige todos los campos (nombre, precio, stock)"
    });
  }

  if (precio < 0 || stock < 0) {
    return res.status(400).json({
      error: "El precio y el stock deben ser >= 0"
    });
  }

  producto.nombre = nombre;
  producto.precio = Number(precio);
  producto.stock = Number(stock);

  res.status(200).json(producto);
});

// 9. PATCH /productos/:id (Requiere token)
app.patch("/productos/:id", verificarToken, async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body ?? {};

    if (nombre === undefined && precio === undefined && stock === undefined) {
      return res.status(400).json({
        error: "Envía al menos un campo: nombre, precio o stock"
      });
    }

    if (precio !== undefined && precio < 0) {
      return res.status(400).json({ error: "El precio debe ser >= 0" });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ error: "El stock debe ser >= 0" });
    }

    const [r] = await db.query(
      `UPDATE productos
       SET nombre = COALESCE(?, nombre),
           precio = COALESCE(?, precio),
           stock = COALESCE(?, stock)
       WHERE id = ?`,
      [nombre ?? null, precio ?? null, stock ?? null, req.params.id]
    );

    if (r.affectedRows === 0) {
      return res.status(404).json({ error: "No existe" });
    }

    const [filas] = await db.query(
      "SELECT * FROM productos WHERE id = ?",
      [req.params.id]
    );

    res.status(200).json(filas[0]);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// 10. DELETE /productos/:id (Solo administrador)
app.delete(
  "/productos/:id",
  verificarToken,
  verificarAdmin,
  (req, res) => {
    const id = Number(req.params.id);
    const i = productos.findIndex((p) => p.id === id);

    if (i === -1) {
      return res.status(404).json({ error: "No existe" });
    }

    productos.splice(i, 1);
    res.status(204).end();
  }
);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});
