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
      updatedAt: 'updated_at' 
    }
  );

  User.associate = (models) => {
    User.hasMany(models.question, { foreignKey: 'user_id', as: 'questions' });
    User.hasMany(models.comment, { foreignKey: 'user_id', as: 'comments' });
    User.hasMany(models.notification, { foreignKey: 'user_id', as: 'notifications' });
    User.hasMany(models.interest, { foreignKey: 'user_id', as: 'interests' });
    User.hasMany(models.userCommentAction, { foreignKey: 'user_id', as: 'userCommentActions' });
    User.hasMany(models.userQuestionAction, { foreignKey: 'user_id', as: 'userQuestionActions' });
  };

  return User;
};
