const express = require('express');
const router = express.Router();
const tarjetaController = require('../controllers/tarjetaController');
const verificarToken = require('../middlewares/auth'); 

// 1. Aplicamos el middleware de seguridad a todas las rutas de este archivo
router.use(verificarToken);

// 2. Crear una tarjeta dentro de una lista específica
router.post('/lista/:listaId', tarjetaController.crearTarjeta);

// 3. Actualizar una tarjeta (cambiar título, descripción o moverla de lista)
router.put('/:id', tarjetaController.actualizarTarjeta);

// 4. Eliminar una tarjeta
router.delete('/:id', tarjetaController.eliminarTarjeta);

module.exports = router;