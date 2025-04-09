const { DataTypes } = require('sequelize');

module.exports = (sequelize, User, Question) => {
  const Interest = sequelize.define(
    'Interests',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id'
        }
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Question,
          key: 'id'
        }
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    { tableName: 'Interests', timestamps: false }
  );

  Interest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Interest.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

  return Interest;
};
