const { Tarjeta } = require('../models');

exports.crearTarjeta = async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        const { listaId } = req.params;
        
        const nuevaTarjeta = await Tarjeta.create({
            titulo,
            descripcion,
            listaId: listaId
        });
        res.status(201).json(nuevaTarjeta);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la tarjeta" });
    }
};

// Endpoint clave para el "Drag & Drop" (HT-06)
exports.actualizarTarjeta = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, ListaId } = req.body;

        await Tarjeta.update(
            { titulo, descripcion, ListaId }, 
            { where: { id } }
        );
        
        res.json({ mensaje: "Tarjeta actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar tarjeta" });
    }
};

// Eliminar una tarjeta específica
exports.eliminarTarjeta = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscamos si la tarjeta existe antes de intentar borrarla
        const tarjeta = await Tarjeta.findByPk(id);

        if (!tarjeta) {
            return res.status(404).json({ error: "La tarjeta no existe" });
        }

        // Ejecutamos el borrado
        await Tarjeta.destroy({
            where: { id: id }
        });

        // Respondemos con un 200 (OK) o 204 (No Content)
        res.json({ mensaje: `Tarjeta con ID ${id} eliminada correctamente` });
        
    } catch (error) {
        console.error("Error al eliminar tarjeta:", error);
        res.status(500).json({ error: "Error interno al intentar eliminar la tarjeta" });
    }
};
