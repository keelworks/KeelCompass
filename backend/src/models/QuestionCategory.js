module.exports = (sequelize, DataTypes) => {
  const QuestionCategory = sequelize.define(
    "QuestionCategory",
    {
      question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    { 
      tableName: "QuestionCategories", 
      timestamps: false 
    }
  );

  QuestionCategory.associate = (models) => {
    QuestionCategory.belongsTo(models.question, { foreignKey: 'question_id', as: 'question' });
    QuestionCategory.belongsTo(models.category, { foreignKey: 'category_id', as: 'category' });
  };

  return QuestionCategory;
};
