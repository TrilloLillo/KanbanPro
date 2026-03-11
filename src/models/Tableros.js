const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Tablero = sequelize.define("Tablero", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
  },
});

module.exports = Tablero;
