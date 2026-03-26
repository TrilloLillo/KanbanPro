require("dotenv").config();
const express = require("express");
const { engine } = require("express-handlebars");
const fs = require("fs");
const path = require("path");
const tableroRoutes = require('./src/routes/tableroRoutes');
const tarjetaRoutes = require('./src/routes/tarjetaRoutes');
const listaRoutes = require('./src/routes/listaRoutes');
const authenticateToken = require("./src/middlewares/auth");
const authRoutes = require('./src/routes/authRoutes');
const cookieParser = require("cookie-parser");
const { Tablero, Lista, Tarjeta, Usuario } = require('./src/models');




const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURACIÓN DE MOTOR DE VISTAS (HBS) ---
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// --- MIDDLEWARES ---
app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/tableros', tableroRoutes);
app.use('/api/tarjetas', tarjetaRoutes);
app.use('/api/listas', listaRoutes);
app.use('/api/auth', authRoutes);

// --- RUTAS DE NAVEGACIÓN (HU-01) ---

app.get("/", (req, res) => {
  res.render("home", { title: "Bienvenido a KanbanPro" });
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Registro" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Iniciar Sesión" });
});

// Ruta de depuración: devuelve tableros/listas/tarjetas del usuario autenticado (solo en desarrollo)
app.get('/debug/my-data', authenticateToken, async (req, res) => {
  try {
    const tableros = await Tablero.findAll({
      where: { usuarioId: req.usuarioId },
      include: [{ model: Lista, include: [Tarjeta] }],
    });
    const plain = tableros.map(t => t.get({ plain: true }));
    return res.json({ ok: true, tableros: plain });
  } catch (err) {
    console.error('Error en /debug/my-data', err);
    return res.status(500).json({ ok: false, error: 'server error' });
  }
});

// --- RUTA DASHBOARD: LEER DATOS (HU-02) ---

app.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    // Obtener los tableros del usuario logueado junto a sus listas y tarjetas
    const tableros = await Tablero.findAll({
      where: { usuarioId: req.usuarioId },
      include: [
        { model: Lista, include: [Tarjeta] },
      ],
    });

    // Pasar objetos planos a la vista para Handlebars
    let plainTableros = tableros.map((t) => t.get({ plain: true }));

    // Normalizar claves: asegurarnos de que siempre existan 'Listas' y 'Tarjetas'
    plainTableros = plainTableros.map((tb) => {
      // some versions or configs may lowercase association keys
      if (!tb.Listas && tb.listas) tb.Listas = tb.listas;
      if (tb.Listas && Array.isArray(tb.Listas)) {
        tb.Listas = tb.Listas.map((l) => {
          if (!l.Tarjetas && l.tarjetas) l.Tarjetas = l.tarjetas;
          // ensure arrays exist
          l.Tarjetas = l.Tarjetas || [];
          return l;
        });
      } else {
        tb.Listas = tb.Listas || [];
      }
      return tb;
    });

    // Debug: imprimir estructura que se pasa a la vista (útil para verificar por qué no aparecen listas)
    console.log('DEBUG plainTableros:', JSON.stringify(plainTableros, null, 2));

    // Obtener nombre del usuario para saludar
    const usuario = await Usuario.findByPk(req.usuarioId);
    const userName = usuario ? usuario.name : '';

    res.render("dashboard", {
      title: "Mi Tablero",
      tableros: plainTableros,
      userName,
    });
  } catch (error) {
    console.error("Error al obtener dashboard:", error);
    res.status(500).render("dashboard", { title: "Mi Tablero", tableros: [] });
  }
});

// --- RUTA POST: PERSISTENCIA (HU-03) ---

app.post("/nueva-tarjeta", (req, res) => {
  const { title } = req.body; // Captura el "name" del input del formulario

  // Ciclo: Leer-Modificar-Escribir
  // 1. Leer actual
  const rawData = fs.readFileSync(
    path.join(__dirname, "data/data.json"),
    "utf-8",
  );
  const data = JSON.parse(rawData);

  // 2. Modificar (creamos el nuevo objeto tarea)
  const newTask = {
    id: Date.now(), // ID único temporal
    title: title,
    status: "To Do",
  };
  data.tasks.push(newTask);

  // 3. Escribir (convertir a string y guardar)
  fs.writeFileSync(
    path.join(__dirname, "data/data.json"),
    JSON.stringify(data, null, 2),
  );

  // 4. Redirigir para actualizar la vista
  res.redirect("/dashboard");
});

// --- INICIO DEL SERVIDOR ---
app.listen(PORT, () => {
  console.log(`🚀 KanbanPro corriendo en http://localhost:${PORT}`);
});
