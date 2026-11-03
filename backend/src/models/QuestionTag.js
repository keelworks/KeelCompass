module.exports = (sequelize, DataTypes) => {
  const QuestionTag = sequelize.define(
    "QuestionTag",
    {
      question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'questions',
          key: 'id',
        },
      },
      tag: {
        type: DataTypes.STRING(100),
        primaryKey: true,
      },
    },
    {
      tableName: "QuestionTags",
      timestamps: false
    }
  );

  QuestionTag.associate = (models) => {
    QuestionTag.belongsTo(models.Question, { foreignKey: 'question_id', as: 'question' });
  };

  return QuestionTag;
};
