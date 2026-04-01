const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");


const Lista = sequelize.define("Lista", {
  titulo: {
    type: DataTypes.STRING,
  },
  descripcion: {
    type: DataTypes.STRING,
  },
});



module.exports = Lista;
