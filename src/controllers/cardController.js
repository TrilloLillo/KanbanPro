const { Card } = require('../models');

exports.crearCard = async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        const { listaId } = req.params;
        
        const nuevaCard = await Card.create({
            titulo,
            descripcion,
            listaId: listaId
        });
        res.status(201).json(nuevaCard);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la Card" });
    }
};

// Endpoint clave para el "Drag & Drop" (HT-06)
exports.actualizarCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, ListaId } = req.body;

        await Card.update(
            { titulo, descripcion, ListaId }, 
            { where: { id } }
        );
        
        res.json({ mensaje: "Card actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar Card" });
    }
};

// Eliminar una Card específica
exports.eliminarCard = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscamos si la Card existe antes de intentar borrarla
        const Card = await Card.findByPk(id);

        if (!Card) {
            return res.status(404).json({ error: "La Card no existe" });
        }

        // Ejecutamos el borrado
        await Card.destroy({
            where: { id: id }
        });

        // Respondemos con un 200 (OK) o 204 (No Content)
        res.json({ mensaje: `Card con ID ${id} eliminada correctamente` });
        
    } catch (error) {
        console.error("Error al eliminar Card:", error);
        res.status(500).json({ error: "Error interno al intentar eliminar la Card" });
    }
};
