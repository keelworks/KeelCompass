const { Sequelize } = require("sequelize");
const logger = require("../utils/logger.js");
const dbConfig = require("../configs/dbConfig.js");

// initialize sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  define: {
    timestamps: false
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },

  logging: (msg) => logger.info(msg)
});

// connect to mysql db
sequelize.authenticate()
  .then(() => {
    logger.info("database connected");
  })
  .catch((error) => {
    logger.error(`Error: database connection failed: ${error}`);
  });

// initialize relational models
const db = {};
db.sequelize = sequelize;

db.users = require("./User.js")(sequelize);
db.questions = require("./Question.js")(sequelize, db.users);
db.comments = require("./Comment.js")(sequelize, db.users, db.questions);
db.userQuestionActions = require("./UserQuestionAction.js")(sequelize, db.users, db.questions);
db.categories = require("./Category.js")(sequelize);
db.questionCategories = require("./QuestionCategory.js")(sequelize, db.questions, db.categories);
db.interests = require("./Interest.js")(sequelize, db.users, db.questions);

// sync database
db.sequelize.sync({ force: false })
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
