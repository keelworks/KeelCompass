const { DataTypes } = require("sequelize");

module.exports = (sequelize, Question, Category) => {
  const QuestionCategory = sequelize.define(
    "QuestionCategory",
    {
      question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: Question,
          key: "id",
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: Category,
          key: "id",
        },
      },
    },
    { tableName: "QuestionCategories", timestamps: false }
  );

  Question.belongsToMany(Category, { through: QuestionCategory, foreignKey: "question_id" });
  Category.belongsToMany(Question, { through: QuestionCategory, foreignKey: "category_id" });

  return QuestionCategory;
};
