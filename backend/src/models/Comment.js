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
      updatedAt: false,
    }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.users, { foreignKey: "user_id", as: "user" });
    Comment.belongsTo(models.questions, { foreignKey: "question_id", as: "question" });
    Comment.hasOne(models.attachments, { foreignKey: "comment_id", as: "attachment" });
    Comment.belongsTo(Comment, { foreignKey: "parent_id", as: "parent" });
    Comment.hasMany(Comment, { foreignKey: "parent_id", as: "replies" });
  };

  return Comment;
};
