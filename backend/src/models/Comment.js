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
      attachment: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    { 
      tableName: "Comments", 
      timestamps: true, 
      createdAt: 'created_at', 
      updatedAt: 'updated_at'
    }
  );

  Comment.belongsTo(User, { foreignKey: "user_id", as: "user" });
  User.hasMany(Comment, { foreignKey: "user_id", sourceKey: "id" });

  Comment.belongsTo(Question, { foreignKey: "question_id", as: "question", onDelete: "CASCADE" });
  Question.hasMany(Comment, { foreignKey: "question_id", sourceKey: "id" });

  Comment.belongsTo(Comment, { foreignKey: "parent_id", as: "parent" });
  Comment.hasMany(Comment, { foreignKey: "parent_id", as: "replies" });

  return Comment;
};
