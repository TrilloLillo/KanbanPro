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
        const primerTablero = await Tablero.create({
          titulo: "Tablero Principal",
          usuarioId: user.id,
        });
        const Lista = require("./Listas");
        const primeraLista = await Lista.create({
          titulo: "Por Hacer",
          tableroId: primerTablero.id,
        });
        await Lista.create({
          titulo: "Haciendo",
          tableroId: primerTablero.id,
        });
        await Lista.create({
          titulo: "Hecho",
          tableroId: primerTablero.id,
        });
        const Tarjeta = require("./Cards");
        await Tarjeta.create({
          titulo: "¡Bienvenido a KanbanPro!",
          descripcion:
            "Este es tu tablero principal. Aquí puedes crear listas y tarjetas para organizar tus tareas. ¡Empieza a usarlo ahora!",
          listaId: primeraLista.id,
        });
      },
    },
  },
);

module.exports = Usuario;
