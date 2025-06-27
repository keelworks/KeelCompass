module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
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
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

    },
    { 
      tableName: "Comments", 
      timestamps: true, 
      createdAt: 'created_at', 
      updatedAt: 'updated_at'
    }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.user, { foreignKey: "user_id", as: "user" });
    Comment.belongsTo(models.question, { foreignKey: "question_id", as: "question", onDelete: "CASCADE" });
    Comment.belongsTo(models.comment, { foreignKey: "parent_id", as: "parent" });
    Comment.hasOne(models.attachment, { foreignKey: 'comment_id', as: 'attachment' });
    Comment.hasMany(models.comment, { foreignKey: "parent_id", as: "replies" });
    Comment.hasMany(models.interest, { foreignKey: 'comment_id', as: 'interests' });
    Comment.hasMany(models.userCommentAction, { foreignKey: 'comment_id', as: 'userCommentActions' });
    Comment.hasMany(models.notification, { foreignKey: 'comment_id', as: 'notifications' });
  };

  return Comment;
};
