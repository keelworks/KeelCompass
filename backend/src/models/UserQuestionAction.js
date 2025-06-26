module.exports = (sequelize, DataTypes) => {
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
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action_type: {
        type: DataTypes.ENUM("like", "report"),
        allowNull: false,
      },
    },
<<<<<<< Updated upstream
    {
      tableName: "UserQuestionActions",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
=======
    { 
      tableName: "UserQuestionActions", 
      timestamps: true, 
      createdAt: 'created_at', 
>>>>>>> Stashed changes
    }
  );

  UserQuestionAction.associate = (models) => {
    UserQuestionAction.belongsTo(models.users, { foreignKey: "user_id" });
    UserQuestionAction.belongsTo(models.questions, { foreignKey: "question_id" });
  };

  return UserQuestionAction;
};
