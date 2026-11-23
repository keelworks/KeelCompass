module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define(
    "Feedback",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "Feedbacks",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  };

  return Feedback;
};
