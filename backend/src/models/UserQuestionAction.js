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
        references: {
          model: 'users',
          key: 'id',
        },
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id',
        },
      },
      action_type: {
        type: DataTypes.ENUM(
          "like", 
          "report"
        ),
        allowNull: false,
      },
    },
    {
      tableName: "UserQuestionActions",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    }
  );

  UserQuestionAction.associate = (models) => {
    UserQuestionAction.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    UserQuestionAction.belongsTo(models.Question, { foreignKey: "question_id", as: "question" });
  };

  return UserQuestionAction;
};
