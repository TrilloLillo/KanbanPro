const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcrypt");

const Usuario = sequelize.define(
  "usuarios",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      afterCreate: async (user) => {
        const Tablero = require("./Tableros");
        await Tablero.create({
          titulo: "Tablero Principal",
          usuarioId: user.id,
        });
      },
    },
  },
);

module.exports = Usuario;
