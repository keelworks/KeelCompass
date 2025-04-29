const { DataTypes } = require("sequelize");

module.exports = (sequelize, User, Question) => {
  const Comment = sequelize.define(
    "Comment",
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
          model: User,
          key: "id",
        },
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Question,
          key: "id",
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachment: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { tableName: "Comments" }
  );

  Comment.belongsTo(User, { foreignKey: "user_id", as: "user" });
  Comment.belongsTo(Question, { foreignKey: "question_id", as: "question" });

  User.hasMany(Comment, { foreignKey: "user_id", sourceKey: "id" });
  Question.hasMany(Comment, { foreignKey: "question_id", sourceKey: "id" });

  return Comment;
};
