const { DataTypes } = require('sequelize');

module.exports = (sequelize, User, Question, Comment) => {
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
        allowNull: true,
        references: {
          model: Question,
          key: 'id'
        }
      },
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: Comment, key: 'id' },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    { tableName: 'Interests', timestamps: false }
  );

  Interest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  User.hasMany(Interest, { foreignKey: 'user_id', as: 'interests' });

  Interest.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });
  Question.hasMany(Interest, { foreignKey: 'question_id', as: 'interests' });

  Interest.belongsTo(Comment, { foreignKey: 'comment_id', as: 'comment' });
  Comment.hasMany(Interest, { foreignKey: 'comment_id', as: 'interests' });

  return Interest;
};
