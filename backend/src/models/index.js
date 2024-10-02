//initializing sequelize to make db calls through sequelize

const { Sequelize, DataTypes } = require("sequelize");

const dbConfig = require("../configs/dbConfig.js");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

//making a db connection using sequelize
sequelize
  .authenticate()
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log("Error: " + error);
  });

const db = {};

db.sequelize = Sequelize;
db.sequelize = sequelize;

//utilizing DB Schema with sequelize
db.users = require("./userModel")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("Syncing DB...");
});

module.exports = db;
