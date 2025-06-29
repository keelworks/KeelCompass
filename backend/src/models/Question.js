module.exports = (sequelize, DataTypes) => {
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
          model: 'users',
          key: 'id',
        },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
    },
    { 
      tableName: "Questions", 
      timestamps: true, 
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    }
  );

  Question.associate = (models) => {
    Question.belongsToMany(models.Category, { through: models.QuestionCategory, foreignKey: 'question_id', otherKey: 'category_id' });
    Question.belongsTo(models.User, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE', as: 'user' });
    Question.hasOne(models.Attachment, { foreignKey: 'question_id', as: 'attachment' });
    Question.hasMany(models.Comment, { foreignKey: 'question_id', as: 'comments' });
    Question.hasMany(models.Interest, { foreignKey: 'question_id', as: 'interests' });
    Question.hasMany(models.UserQuestionAction, { foreignKey: 'question_id', as: 'userQuestionActions' });
    Question.hasMany(models.Notification, { foreignKey: 'question_id', as: 'notifications' });
  };

  return Question;
};
