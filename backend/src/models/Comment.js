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
        references: {
          model: 'users',
          key: 'id',
        },
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id',
        },
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id',
        },
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
    Comment.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Comment.belongsTo(models.Question, { foreignKey: "question_id", as: "question", onDelete: "CASCADE" });
    Comment.belongsTo(models.Comment, { foreignKey: "parent_id", as: "parent" });
    Comment.hasOne(models.Attachment, { foreignKey: 'comment_id', as: 'attachment' });
    Comment.hasMany(models.Comment, { foreignKey: "parent_id", as: "replies" });
    Comment.hasMany(models.Interest, { foreignKey: 'comment_id', as: 'interests' });
    Comment.hasMany(models.UserCommentAction, { foreignKey: 'comment_id', as: 'userCommentActions' });
    Comment.hasMany(models.Notification, { foreignKey: 'comment_id', as: 'notifications' });
  };

  return Comment;
};
