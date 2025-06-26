module.exports = (sequelize, DataTypes) => {
  const Interest = sequelize.define(
    'Interest',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Comment,
          key: 'id'
        },
      },
    },
    {
      tableName: 'Interests',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    }
  );

  Interest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  User.hasMany(Interest, { foreignKey: 'user_id', as: 'interests' });

  Interest.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });
  Question.hasMany(Interest, { foreignKey: 'question_id', as: 'interests' });

  Interest.belongsTo(Comment, { foreignKey: 'comment_id', as: 'comment' });
  Comment.hasMany(Interest, { foreignKey: 'comment_id', as: 'interests' });

  return Interest;
};
