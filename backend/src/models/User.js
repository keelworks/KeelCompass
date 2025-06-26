module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("volunteer", "facilitator"),
        allowNull: false,
        defaultValue: "volunteer"
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    { 
      tableName: "Users",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.questions, { foreignKey: 'user_id', as: 'questions' });
    User.hasMany(models.comments, { foreignKey: 'user_id', as: 'comments' });
  };

  return User;
};
