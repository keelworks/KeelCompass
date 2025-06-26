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
      updatedAt: false,
    }
  );

  Question.associate = (models) => {
    Question.belongsTo(models.users, { foreignKey: 'user_id', as: 'user' });
    Question.hasOne(models.attachments, { foreignKey: 'question_id', as: 'attachment' });
    Question.belongsToMany(models.categories, {
      through: models.questionCategories,
      foreignKey: 'question_id',
      otherKey: 'category_id',
      as: 'Categories',
    });
  };

  return Question;
};
