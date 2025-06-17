module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { 
      tableName: "Categories", 
      timestamps: false 
    }
  );

  Category.associate = (models) => {
    Category.belongsToMany(models.questions, {
      through: models.questionCategories,
      foreignKey: 'category_id',
      otherKey: 'question_id',
    });
  };

  return Category;
};
