// models/Question.js
const { DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes, User) => {
    const Question = sequelize.define('Questions', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: User,  // Reference the User model
          key: 'id',
        },
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'Questions',
      timestamps: false,
    });
  
    // Define association
    Question.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  
    return Question;
  };