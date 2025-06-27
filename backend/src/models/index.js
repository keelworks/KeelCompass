const { Sequelize, DataTypes } = require("sequelize");
const logger = require("../utils/logger.js");
const dbConfig = require("../configs/dbConfig.js");

// initialize sequelize
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
  logging: (msg) => logger.info(msg),
});

// connect to mysql db
sequelize.authenticate()
  .then(() => {
    logger.info("Syncing DB...");
  })
  .then(() => {
    logger.info("Syncing DB completed");
  })
  .catch((error) => {
    logger.error(`Error: syncing database failed: ${error}`);
  });

// initialize db
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// load models
db.user = require("./User.js")(sequelize, Sequelize.DataTypes);
db.category = require("./Category.js")(sequelize, Sequelize.DataTypes);
db.question = require("./Question.js")(sequelize, Sequelize.DataTypes);
db.questionCategory = require("./QuestionCategory.js")(sequelize, Sequelize.DataTypes);
db.userQuestionAction = require("./UserQuestionAction.js")(sequelize, Sequelize.DataTypes);
db.comment = require("./Comment.js")(sequelize, Sequelize.DataTypes);
db.userCommentAction = require("./UserCommentAction.js")(sequelize, Sequelize.DataTypes);
db.attachment = require("./Attachment.js")(sequelize, Sequelize.DataTypes);
db.interest = require("./Interest.js")(sequelize, Sequelize.DataTypes);
db.notification = require("./Notification.js")(sequelize, Sequelize.DataTypes);

// initialize associations
Object.keys(db).forEach(modelName => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
