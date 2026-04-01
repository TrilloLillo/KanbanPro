const express = require('express');
const router = express.Router();
const listaController = require('../controllers/listaController');
const verificarToken = require('../middlewares/auth');

// 🛡️ Proteger todas las rutas de listas
router.use(verificarToken);

// 1. Crear una nueva lista (columna) en un tablero
router.post('/tablero/:tableroId', listaController.crearLista);

// 2. Actualizar nombre de la lista (ej: cambiar "To Do" por "Pendientes")
router.put('/:id', listaController.actualizarLista);

// 3. Eliminar una lista y todas sus tarjetas (Borrado en cascada)
router.delete('/:id', listaController.eliminarLista);

module.exports = router;