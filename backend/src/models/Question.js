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
    },
    { 
      tableName: "Questions", 
      timestamps: true, 
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    }
  );

  Question.associate = (models) => {
    Question.belongsToMany(models.category, { through: models.questionCategory, foreignKey: 'question_id', otherKey: 'category_id' });
    Question.belongsTo(models.user, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE', as: 'user' });
    Question.hasOne(models.attachment, { foreignKey: 'question_id', as: 'attachment' });
    Question.hasMany(models.comment, { foreignKey: 'question_id', as: 'comments' });
    Question.hasMany(models.interest, { foreignKey: 'question_id', as: 'interests' });
    Question.hasMany(models.userQuestionAction, { foreignKey: 'question_id', as: 'userQuestionActions' });
    Question.hasMany(models.notification, { foreignKey: 'question_id', as: 'notifications' });
  };

  return Question;
};
