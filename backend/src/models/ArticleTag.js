const { DataTypes } = require('sequelize');
const db = require("./index");
const Article = require('./article');
const Tag = require('./Tag');

const ArticleTag = db.sequelize.define('ArticleTag', {
    article_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Article,
            key: 'id',
        },
    },
    tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Tag,
            key: 'id',
        },
    },
}, {
    tableName: 'ArticleTags',
    timestamps: false,
});

Article.belongsToMany(Tag, { through: ArticleTag, foreignKey: 'article_id' });
Tag.belongsToMany(Article, { through: ArticleTag, foreignKey: 'tag_id' });

module.exports = ArticleTag;
