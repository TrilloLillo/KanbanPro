const { Sequelize } = require("sequelize");
const pg = require("pg");

const sequelize = new Sequelize(process.env.DATABASE_URI, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    //ssl: {
      //require: true,
      //rejectUnauthorized: false,
    //},
  },
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexion exitosa");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, testConnection };
