module.exports = (sequelize, DataTypes) => {
  const MutedQuestion = sequelize.define(
    'MutedQuestion',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'questions', key: 'id' },
      },
    },
    {
      tableName: 'MutedQuestions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  MutedQuestion.associate = (models) => {
    MutedQuestion.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    MutedQuestion.belongsTo(models.Question, { foreignKey: 'question_id', as: 'question' });
  };

  return MutedQuestion;
};
