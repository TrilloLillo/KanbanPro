const express = require('express');
const router = express.Router();
const tableroController = require('../controllers/tableroController');
const verificarToken = require('../middlewares/auth');


// CRUD de Tableros
router.get('/', verificarToken, tableroController.obtenerTableros);
router.post('/', verificarToken,tableroController.crearTablero);
router.put('/:id', verificarToken, tableroController.actualizarTablero);
router.delete('/:id', verificarToken, tableroController.eliminarTablero);

module.exports = router;