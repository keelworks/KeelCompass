//initializing sequelize to make db calls through sequelize

const { Sequelize, DataTypes } = require("sequelize");
const logger = require("../utils/logger");

const dbConfig = require("../configs/dbConfig.js");
const { error } = require("winston");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  define: {
    timestamps: false,
  },

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },

  logging: (msg) => logger.info(msg), // redirect logs to Winston
});

//making a db connection using sequelize
sequelize
  .authenticate()
  .then(() => {
    logger.info("database connected");
  })
  .catch((error) => {
    logger.error(`Error: database connection failed: ${error}`);
  });

const db = {};

db.sequelize = Sequelize;
db.sequelize = sequelize;

//utilizing DB Schema with sequelize
db.users = require("./userModel")(sequelize, DataTypes);
db.sequelize
  .sync({ force: false })
  .then(() => {
    logger.info("Syncing DB...");
  })
  .then(() => {
    logger.info("Syncing DB completed");
  })
  .catch((error) => {
    logger.error(`Error: syncing database failed: ${error}`);
  });

module.exports = db;
