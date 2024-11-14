const { Sequelize, DataTypes } = require("sequelize");
const logger = require("../utils/logger");
const dbConfig = require("../configs/dbConfig.js");

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

// Making a DB connection using Sequelize
sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connected");
  })
  .catch((error) => {
    logger.error(`Error: Database connection failed: ${error}`);
  });

const db = {};

// Import Models
db.sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./user-model/userModel.js")(sequelize, DataTypes);
db.questions = require("./Questions")(sequelize, DataTypes, db.users);
db.articles = require("./article")(sequelize, db.users);
db.tags = require("./Tag")(sequelize);
db.articleTags = require("./ArticleTag")(sequelize, db.articles, db.tags);

// Import the new Profile models
db.studentProfiles = require("./user-model/StudentProfile")(
  sequelize,
  DataTypes
);
db.facilitatorProfiles = require("./user-model/FacilitatorProfile")(
  sequelize,
  DataTypes
);
db.adminProfiles = require("./user-model/AdminProfile")(sequelize, DataTypes);

// Define Relationships
db.users.hasOne(db.studentProfiles, {
  foreignKey: "user_id",
  as: "studentProfile",
});
db.studentProfiles.belongsTo(db.users, { foreignKey: "user_id" });

db.users.hasOne(db.facilitatorProfiles, {
  foreignKey: "user_id",
  as: "facilitatorProfile",
});
db.facilitatorProfiles.belongsTo(db.users, { foreignKey: "user_id" });

db.users.hasOne(db.adminProfiles, {
  foreignKey: "user_id",
  as: "adminProfile",
});
db.adminProfiles.belongsTo(db.users, { foreignKey: "user_id" });

// Sync the DB with the new models and relationships
db.sequelize
  .sync({ force: false }) // set force: true if you want to drop and recreate tables
  .then(() => {
    logger.info("Syncing DB...");
  })
  .then(() => {
    logger.info("Syncing DB completed");
  })
  .catch((error) => {
    logger.error(`Error: Syncing database failed: ${error}`);
  });

module.exports = db;
