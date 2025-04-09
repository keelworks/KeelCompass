const { DataTypes } = require("sequelize");

module.exports = (sequelize, Article, Tag) => {
  const ArticleTag = sequelize.define(
    "ArticleTag",
    {
      article_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: Article,
          key: "id",
        },
      },
      tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: Tag,
          key: "id",
        },
      },
    },
    {
      tableName: "ArticleTags",
      timestamps: false,
    }
  );

  Article.belongsToMany(Tag, { through: ArticleTag, foreignKey: "article_id" });
  Tag.belongsToMany(Article, { through: ArticleTag, foreignKey: "tag_id" });

  return ArticleTag;
};
