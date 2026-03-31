const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const verificarToken = require('../middlewares/auth'); 

// 1. Aplicamos el middleware de seguridad a todas las rutas de este archivo
router.use(verificarToken);

// 2. Crear una cardController dentro de una lista específica
router.post('/lista/:listaId', cardController.crearCard);

// 3. Actualizar una cardController (cambiar título, descripción o moverla de lista)
router.put('/:id', cardController.actualizarCard);

// 4. Eliminar una cardController
router.delete('/:id', cardController.eliminarCard);

module.exports = router;