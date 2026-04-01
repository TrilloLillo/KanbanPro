const Usuario = require("../src/models");
const Tablero = require("../src/models");
const Lista = require("../src/models");
const Tarjeta = require("../src/models");

async function testCRUD() {
  try {
    const nuevaTarjeta = await Tarjeta.create({
      name: "Tarjeta de prueba",
      listaId: 1,
    });
    console.log("Tarjeta creada:", nuevaTarjeta.toJSON());
  } catch (error) {
    console.error("Error al crear la tarjeta:", error);
  }
}

const leerTablero = async () => {
  try {
    const tablero = await Tablero.findByPk(1, { include: [Lista] });
    console.log("Tablero encontrado:", tablero.toJSON());
  } catch (error) {
    console.error("Error al leer el tablero:", error);
  }
};

const actualizarTarjeta = async () => {
  try {
    const tarjeta = await Tarjeta.findByPk(1);
    const tarjetaActualizada = await tarjeta.update({
      name: "Tarjeta actualizada",
    });
    console.log("Tarjeta actualizada:", tarjetaActualizada.toJSON());
  } catch (error) {
    console.error("Error al actualizar la tarjeta:", error);
  }
};

const eliminarTarjeta = async () => {
  try {
    const tarjeta = await Tarjeta.findByPk(1);
    await tarjeta.destroy();
    console.log("Tarjeta eliminada");
  } catch (error) {
    console.error("Error al eliminar la tarjeta:", error);
  }
};

module.exports = {
  testCRUD,
  leerTablero,
  actualizarTarjeta,
  eliminarTarjeta,
};
