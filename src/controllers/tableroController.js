const { Tablero, Lista, Card } = require('../models');

// Obtener todos los tableros del usuario autenticado
exports.obtenerTableros = async (req, res) => {
    try {
        const tableros = await Tablero.findAll({ 
            where: { usuarioId: req.usuarioId } // Usamos el ID que guardó el middleware auth.js
        });
        res.json(tableros);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener tableros" });
    }
};

// Crear un nuevo tablero
exports.crearTablero = async (req, res) => {
    try {
        const { titulo } = req.body;
        const nuevoTablero = await Tablero.create({ 
            titulo, 
            usuarioId: req.usuarioId 
        });
        // Si la petición viene de un formulario (urlencoded) redirigimos al dashboard
        const contentType = req.headers['content-type'] || '';
        if (contentType.includes('application/x-www-form-urlencoded') || (req.headers.accept && req.headers.accept.includes('text/html'))) {
            return res.redirect('/dashboard');
        }

        // En caso de llamada API (JSON) devolvemos el objeto creado
        res.status(201).json(nuevoTablero);
    } catch (error) {
        res.status(500).json({ error: "Error al crear tablero" });
    }
};

// actualizar un tablero (solo propietario)
exports.actualizarTablero = async (req, res) => {
    try {
        const { id } = req.params; 
        const { titulo } = req.body; 

        // 1. Verificar si el tablero existe
        const tablero = await Tablero.findByPk(id);
        
        if (!tablero) {
            return res.status(404).json({ error: "El tablero no existe" });
        }

        // 2. Verificar propiedad
        if (tablero.usuarioId !== req.usuarioId) {
            return res.status(403).json({ error: "No tienes permiso para modificar este tablero" });
        }

        // 3. Aplicar los cambios
        await Tablero.update(
            { titulo }, 
            { where: { id: id } }
        );

        res.json({ 
            mensaje: "Tablero actualizado con éxito",
            id: id,
            nuevoTitulo: titulo
        });

    } catch (error) {
        console.error("Error al actualizar el tablero:", error);
        res.status(500).json({ error: "Error interno al actualizar el tablero" });
    }
};

// eliminar un tablero (solo propietario)
exports.eliminarTablero = async (req, res) => {
    try {
        const { id } = req.params;

        const tablero = await Tablero.findByPk(id);
        if (!tablero) {
            return res.status(404).json({ error: "El tablero no existe" });
        }
        if (tablero.usuarioId !== req.usuarioId) {
            return res.status(403).json({ error: "No tienes permiso para eliminar este tablero" });
        }

        await Tablero.destroy({ where: { id } });
        res.json({ mensaje: "Tablero eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el tablero" });
    }
};


