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
      attachment: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    { 
      tableName: "Questions", 
      timestamps: true, 
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    }
  );

  Question.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false, }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  User.hasMany(Question, { foreignKey: "user_id", sourceKey: "id" });

  return Question;
};
