module.exports = (sequelize, DataTypes) => {
  const UserCommentAction = sequelize.define(
    "UserCommentAction",
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
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action_type: {
        type: DataTypes.ENUM("like", "report"),
        allowNull: false,
      },
    },
    { 
      tableName: "UserCommentActions", 
      timestamps: true, 
      createdAt: 'created_at',
      updatedAt: false
    }
  );

  UserCommentAction.associate = (models) => {
    UserCommentAction.belongsTo(models.users, { foreignKey: "user_id" });
    UserCommentAction.belongsTo(models.comments, { foreignKey: "comment_id" });
  };

  return UserCommentAction;
};
