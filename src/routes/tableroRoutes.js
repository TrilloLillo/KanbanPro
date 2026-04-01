const express = require("express");
const router = express.Router();
const tableroController = require("../controllers/tableroController");
// Importamos desde el index.js de modelos donde están las relaciones
const { Tablero, Lista, Card } = require("../models/index");
const verificarToken = require("../middlewares/auth");

// Proteger todas las rutas de tableros
router.use(verificarToken);

// Rutas CRUD básicas para tableros
router.get("/", tableroController.obtenerTableros);
router.post("/", tableroController.crearTablero);
router.put("/:id", tableroController.actualizarTablero);
router.delete("/:id", tableroController.eliminarTablero);

// Ruta para obtener el JSON de un tablero específico (con listas y tarjetas)
router.get("/:id/data", async (req, res) => {
  try {
    const tablero = await Tablero.findByPk(req.params.id, {
      include: [
        {
          model: Lista,
          include: [Card], // Trae las cards de cada lista
        },
      ],
    });

    if (!tablero)
      return res.status(404).json({ error: "Tablero no encontrado" });

    res.json(tablero);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener datos del tablero" });
  }
});

module.exports = router;
