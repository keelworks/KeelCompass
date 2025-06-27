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
    UserCommentAction.belongsTo(models.user, { foreignKey: "user_id", as: "user" });
    UserCommentAction.belongsTo(models.comment, { foreignKey: "comment_id", as: "comment" });
  };

  return UserCommentAction;
};
