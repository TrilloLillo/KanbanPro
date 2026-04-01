const { Card } = require("../models");

exports.crearCard = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const { listaId } = req.params;

    const nuevaCard = await Card.create({
      titulo,
      descripcion,
      listaId: listaId,
    });

    // Si viene de un formulario HTML, redirigimos al dashboard
    const contentType = req.headers["content-type"] || "";
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      (req.headers.accept && req.headers.accept.includes("text/html"))
    ) {
      return res.redirect("/dashboard");
    }

    res.status(201).json(nuevaCard);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la Card" });
  }
};

// Endpoint clave para el "Drag & Drop" (HT-06)
exports.actualizarCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, listaId, ListaId } = req.body;

    // Aceptar tanto listaId como ListaId para mayor compatibilidad
    const updateData = {};
    if (titulo !== undefined) updateData.titulo = titulo;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (listaId || ListaId) updateData.listaId = listaId || ListaId;

    await Card.update(updateData, { where: { id } });

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
    const card = await Card.findByPk(id);

    if (!card) {
      return res.status(404).json({ error: "La Card no existe" });
    }

    // Ejecutamos el borrado
    await card.destroy();

    // Respondemos con un 200 (OK) o 204 (No Content)
    res.json({ mensaje: `Card con ID ${id} eliminada correctamente` });
  } catch (error) {
    console.error("Error al eliminar Card:", error);
    res
      .status(500)
      .json({ error: "Error interno al intentar eliminar la Card" });
  }
};
