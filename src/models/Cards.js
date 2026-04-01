const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");


const Card = sequelize.define("Card", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
  },
});



module.exports = Card;
