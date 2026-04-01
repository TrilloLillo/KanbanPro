const { Lista, Tablero } = require('../models');

//metodo post
exports.crearLista = async (req, res) => {
    try {
        const { titulo } = req.body;
        const { tableroId } = req.params;
        // Validar que el tablero exista y pertenezca al usuario autenticado
        const tablero = await Tablero.findByPk(tableroId);
        if (!tablero) {
            console.error(`Intento de crear lista en tablero no existente: ${tableroId}`);
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }
        if (tablero.usuarioId !== req.usuarioId) {
            console.error(`Usuario ${req.usuarioId} no es propietario del tablero ${tableroId}`);
            return res.status(403).json({ error: 'No tienes permiso para crear listas en este tablero' });
        }

        const nuevaLista = await Lista.create({
            titulo,
            tableroId: tablero.id,
        });
        console.log(`Lista creada: id=${nuevaLista.id} titulo='${titulo}' tableroId=${nuevaLista.tableroId}`);
        // Si la petición viene de un formulario HTML, redirigimos al dashboard
        const contentType = req.headers['content-type'] || '';
        if (contentType.includes('application/x-www-form-urlencoded') || (req.headers.accept && req.headers.accept.includes('text/html'))) {
            return res.redirect('/dashboard');
        }

        res.status(201).json(nuevaLista);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la lista" });
    }
};

//metodo delete
exports.eliminarLista = async (req, res) => {
    try {
        const { id } = req.params;
        await Lista.destroy({ where: { id } });
        res.json({ mensaje: "Lista eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la lista" });
    }
};

// metodo put
exports.actualizarLista = async (req, res) => {
    try {
        const { id } = req.params; 
        const { titulo } = req.body; 

        // 1. Verificar si la lista existe
        const lista = await Lista.findByPk(id);
        
        if (!lista) {
            return res.status(404).json({ error: "La lista no existe" });
        }

        // 2. Aplicar los cambios
        await Lista.update(
            { titulo }, 
            { where: { id: id } }
        );


        res.json({ 
            mensaje: "Lista actualizada con éxito",
            id: id,
            nuevoTitulo: titulo
        });

    } catch (error) {
        console.error("Error al actualizar la lista:", error);
        res.status(500).json({ error: "Error interno al actualizar la lista" });
    }
};