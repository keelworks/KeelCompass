const { DataTypes } = require("sequelize");

module.exports = (sequelize, User, Comment) => {
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
          model: User,
          key: "id",
        },
      },
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Comment,
          key: "id",
        },
      },
      action_type: {
        type: DataTypes.ENUM("like", "report"),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { tableName: "UserCommentActions", timestamps: false }
  );

  UserCommentAction.belongsTo(User, { foreignKey: "user_id" });
  User.hasMany(UserCommentAction, { foreignKey: "user_id" });

  UserCommentAction.belongsTo(Comment, { foreignKey: "comment_id" });
  Comment.hasMany(UserCommentAction, { foreignKey: "comment_id" });

  return UserCommentAction;
};
