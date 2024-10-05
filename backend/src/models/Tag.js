const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Tag = sequelize.define('Tag', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'Tags',
    timestamps: false,
});

module.exports = Tag;
