const { DataTypes } = require("sequelize");
const db = require("./index");
const User = require("./user");

const Article = db.sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updated_at: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    tableName: "Articles",
  }
);

User.hasMany(Article, {
  foreignKey: "author_id",
  sourceKey: "id",
});

Article.belongsTo(User, {
  foreignKey: "author_id",
  targetKey: "id",
});

module.exports = Article;
