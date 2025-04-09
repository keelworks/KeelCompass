const { DataTypes } = require("sequelize");

module.exports = (sequelize, User, Question) => {
  const UserQuestionAction = sequelize.define(
    "UserQuestionAction",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User, // Reference the User model
          key: "id",
        },
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Question, // Reference the Question model
          key: "id",
        },
      },
      action_type: {
        type: DataTypes.ENUM("like", "report"),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "UserQuestionActions",
      timestamps: false,
    }
  );

  UserQuestionAction.belongsTo(User, { foreignKey: "user_id" });
  UserQuestionAction.belongsTo(Question, { foreignKey: "question_id" });

  User.hasMany(UserQuestionAction, { foreignKey: "user_id" });
  Question.hasMany(UserQuestionAction, { foreignKey: "question_id" });

  return UserQuestionAction;
};
