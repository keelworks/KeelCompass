const { DataTypes } = require("sequelize");

module.exports = (sequelize, User) => {
  const Question = sequelize.define(
    "Question",
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
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
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
    { tableName: "Questions" }
  );

  Question.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false, }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  User.hasMany(Question, { foreignKey: "user_id", sourceKey: "id" });

  return Question;
};
