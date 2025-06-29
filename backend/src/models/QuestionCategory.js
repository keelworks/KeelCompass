module.exports = (sequelize, DataTypes) => {
  const QuestionCategory = sequelize.define(
    "QuestionCategory",
    {
      question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'questions',
          key: 'id',
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
    },
    { 
      tableName: "QuestionCategories", 
      timestamps: false 
    }
  );

  QuestionCategory.associate = (models) => {
    QuestionCategory.belongsTo(models.Question, { foreignKey: 'question_id', as: 'question' });
    QuestionCategory.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
  };

  return QuestionCategory;
};
