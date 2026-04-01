const { Tablero, Lista, Card, sequelize } = require("../models");

// Obtener todos los tableros del usuario autenticado
exports.obtenerTableros = async (req, res) => {
  try {
    const tableros = await Tablero.findAll({
      where: { usuarioId: req.usuarioId },
    });
    res.json(tableros);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tableros" });
  }
};

// Crear un nuevo tablero (con 3 listas por defecto)
exports.crearTablero = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { titulo } = req.body;
    console.log(
      ">>> Creando tablero con titulo:",
      titulo,
      "usuarioId:",
      req.usuarioId,
    );

    const nuevoTablero = await Tablero.create(
      {
        titulo,
        usuarioId: req.usuarioId,
      },
      { transaction: t },
    );
    console.log(">>> Tablero creado con id:", nuevoTablero.id);

    // Crear las 3 listas por defecto dentro de la misma transacción
    const lista1 = await Lista.create(
      { titulo: "Por hacer", tableroId: nuevoTablero.id },
      { transaction: t },
    );
    const lista2 = await Lista.create(
      { titulo: "Haciendo", tableroId: nuevoTablero.id },
      { transaction: t },
    );
    const lista3 = await Lista.create(
      { titulo: "Hecho", tableroId: nuevoTablero.id },
      { transaction: t },
    );

    console.log(
      ">>> Listas creadas:",
      [lista1, lista2, lista3].map((l) => ({
        id: l.id,
        titulo: l.titulo,
        tableroId: l.tableroId,
      })),
    );

    await t.commit();
    console.log(">>> Transacción confirmada OK");

    // Si la petición viene de un formulario (urlencoded) redirigimos al dashboard
    const contentType = req.headers["content-type"] || "";
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      (req.headers.accept && req.headers.accept.includes("text/html"))
    ) {
      return res.redirect("/dashboard");
    }

    // En caso de llamada API (JSON) devolvemos el objeto creado
    res.status(201).json(nuevoTablero);
  } catch (error) {
    await t.rollback();
    console.error(">>> ERROR al crear tablero (rollback):", error.message);
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al crear tablero", detalle: error.message });
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
      return res
        .status(403)
        .json({ error: "No tienes permiso para modificar este tablero" });
    }

    // 3. Aplicar los cambios
    await Tablero.update({ titulo }, { where: { id: id } });

    res.json({
      mensaje: "Tablero actualizado con éxito",
      id: id,
      nuevoTitulo: titulo,
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
      return res
        .status(403)
        .json({ error: "No tienes permiso para eliminar este tablero" });
    }

    await Tablero.destroy({ where: { id } });
    res.json({ mensaje: "Tablero eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el tablero" });
  }
};
