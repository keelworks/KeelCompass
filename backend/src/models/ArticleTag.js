const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Article = require('./Article');
const Tag = require('./Tag');

const ArticleTag = sequelize.define('ArticleTag', {
    article_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Article,
            key: 'id',
        },
    },
    tag_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Tag,
            key: 'id',
        },
    },
}, {
    tableName: 'ArticleTags',
    timestamps: false,
    primaryKey: false,
});

Article.belongsToMany(Tag, { through: ArticleTag, foreignKey: 'article_id' });
Tag.belongsToMany(Article, { through: ArticleTag, foreignKey: 'tag_id' });

module.exports = ArticleTag;
