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
        references: {
          model: 'users',
          key: 'id',
        },
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'questions',
          key: 'id'
        },
      },
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'comments',
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

  Interest.associate = (models) => {
    Interest.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Interest.belongsTo(models.Question, { foreignKey: 'question_id', as: 'question' });
    Interest.belongsTo(models.Comment, { foreignKey: 'comment_id', as: 'comment' });
  };

  return Interest;
};
