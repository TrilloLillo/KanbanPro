require("dotenv").config();
const express = require("express");
const { engine } = require("express-handlebars");
const fs = require("fs");
const path = require("path");
const tableroRoutes = require('./src/routes/tableroRoutes');
const tarjetaRoutes = require('./src/routes/cardRoutes');
const listaRoutes = require('./src/routes/listaRoutes');
const authenticateToken = require("./src/middlewares/auth");
const authRoutes = require('./src/routes/authRoutes');
const cookieParser = require("cookie-parser");
const { Tablero, Lista, Card, Usuario } = require('./src/models');




const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURACIÓN DE MOTOR DE VISTAS (HBS) ---
app.engine("hbs", engine({
  extname: ".hbs",
  helpers: {
    eq: (a, b) => a === b,
  },
}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// --- MIDDLEWARES ---
app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.json());
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
      include: [{ model: Lista, include: [Card] }],
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
    const ORDEN_LISTAS = ['Por hacer', 'Haciendo', 'Hecho'];
    const tableros = await Tablero.findAll({
      where: { usuarioId: req.usuarioId },
      include: [
        { model: Lista, include: [Card] },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Función para ordenar listas según el orden deseado
    function ordenarListas(listas) {
      return (listas || []).sort((a, b) => {
        const iA = ORDEN_LISTAS.indexOf(a.titulo);
        const iB = ORDEN_LISTAS.indexOf(b.titulo);
        return (iA === -1 ? 99 : iA) - (iB === -1 ? 99 : iB);
      });
    }

    // Auto-crear listas por defecto para tableros que no tengan ninguna
    for (const tablero of tableros) {
      const listas = await Lista.findAll({ where: { tableroId: tablero.id } });
      if (listas.length === 0) {
        console.log(`>>> Tablero "${tablero.titulo}" (id=${tablero.id}) sin listas, creando las 3 por defecto...`);
        await Lista.bulkCreate([
          { titulo: 'Por hacer', tableroId: tablero.id },
          { titulo: 'Haciendo',  tableroId: tablero.id },
          { titulo: 'Hecho',     tableroId: tablero.id },
        ]);
        // Recargar el tablero con sus nuevas listas
        await tablero.reload({ include: [{ model: Lista, include: [Card] }] });
      }
    }

    // Pasar objetos planos a la vista para Handlebars
    let plainTableros = tableros.map((t) => t.get({ plain: true }));

    // Normalizar claves: asegurarnos de que siempre existan 'Listas' y 'Cards'
    plainTableros = plainTableros.map((tb) => {
      // Sequelize puede devolver la clave como Lista, Listas, lista o listas
      if (!tb.Listas) tb.Listas = tb.Lista || tb.listas || tb.lista || [];
      if (tb.Listas && Array.isArray(tb.Listas)) {
        tb.Listas = ordenarListas(tb.Listas).map((l) => {
          if (!l.Cards) l.Cards = l.Card || l.cards || l.card || [];
          l.Cards = l.Cards || [];
          return l;
        });
      } else {
        tb.Listas = [];
      }
      return tb;
    });

    // Debug: imprimir estructura que se pasa a la vista (útil para verificar por qué no aparecen listas)
    console.log('DEBUG plainTableros:', JSON.stringify(plainTableros, null, 2));

    // Obtener nombre del usuario para saludar
    const usuario = await Usuario.findByPk(req.usuarioId);
    const userName = usuario ? usuario.name : '';

    // Elegir tablero actual (por ahora el primero) y marcar tableros activos
    const tableroActual = plainTableros.length ? plainTableros[0] : { id: null, titulo: '', Listas: [] };
    plainTableros = plainTableros.map(tb => ({ ...tb, active: tb.id === tableroActual.id }));

    res.render("dashboard", {
      title: "Mi Tablero",
      tableros: plainTableros,
      tableroActual,
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
const { sequelize } = require('./src/models');

sequelize.sync().then(() => {
  console.log('Base de datos sincronizada (tablas creadas)');
  app.listen(PORT, () => {
    console.log(`KanbanPro corriendo en http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Error al sincronizar la base de datos:', err);
});

module.exports = app; // Exportar app para pruebas unitarias