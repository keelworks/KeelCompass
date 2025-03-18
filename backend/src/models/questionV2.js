// models/Question.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize, User) => {
  const Question = sequelize.define(
    "Questions",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: User, // Reference the User model
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
    {
      tableName: "Questions",
    }
  );

  // Define association
  Question.belongsTo(User, { foreignKey: "user_id", as: "user" });

  User.hasMany(Question, { foreignKey: "user_id", sourceKey: "id" });

  return Question;
};
