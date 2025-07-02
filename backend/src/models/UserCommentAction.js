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
        references: {
          model: 'users',
          key: 'id',
        },
      },
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'comments',
          key: 'id',
        },
      },
      action_type: {
        type: DataTypes.ENUM(
          "like", 
          "report"
        ),
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
    UserCommentAction.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    UserCommentAction.belongsTo(models.Comment, { foreignKey: "comment_id", as: "comment" });
  };

  return UserCommentAction;
};
