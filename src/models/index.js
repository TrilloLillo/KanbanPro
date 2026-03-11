const { sequelize } = require("../config/database");
//importamos los modelos para establecer las relaciones entre ellos
const Usuario = require("./Usuarios");
const Tablero = require("./Tableros");
const Lista = require("./Listas");
const Tarjeta = require("./Tarjetas");

//relaciones entre modelos
Usuario.hasMany(Tablero, { foreignKey: "usuarioId", onDelete: "CASCADE" });
Tablero.belongsTo(Usuario, { foreignKey: "usuarioId" });
Tablero.hasMany(Lista, { foreignKey: "tableroId", onDelete: "CASCADE" });
Lista.belongsTo(Tablero, { foreignKey: "tableroId" });
Lista.hasMany(Tarjeta, { foreignKey: "listaId", onDelete: "CASCADE" });
Tarjeta.belongsTo(Lista, { foreignKey: "listaId" });

//exportamos los modelos para usarlos en otras partes de la aplicación
module.exports = {
  Usuario,
  Tablero,
  Lista,
  Tarjeta,
  sequelize,
};
