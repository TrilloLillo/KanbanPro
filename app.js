const express = require("express");
const { engine } = require("express-handlebars");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// --- CONFIGURACIÓN DE MOTOR DE VISTAS (HBS) ---
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// --- MIDDLEWARES ---
app.use(express.static(path.join(__dirname, "public"))); // Para CSS e imágenes
app.use(express.urlencoded({ extended: true })); // CRÍTICO: Para capturar datos de formularios POST

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

// --- RUTA DASHBOARD: LEER DATOS (HU-02) ---

app.get("/dashboard", (req, res) => {
  // 1. Leer el archivo JSON (buffer -> string)
  const rawData = fs.readFileSync(
    path.join(__dirname, "data/data.json"),
    "utf-8",
  );

  // 2. Parsear a objeto JS
  const data = JSON.parse(rawData);

  // 3. Renderizar la vista pasando el objeto (para usar {{#each tasks}})
  res.render("dashboard", {
    title: "Mi Tablero",
    tasks: data.tasks,
  });
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
