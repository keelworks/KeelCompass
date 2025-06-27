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
    Interest.belongsTo(models.user, { foreignKey: 'user_id', as: 'user' });
    Interest.belongsTo(models.question, { foreignKey: 'question_id', as: 'question' });
    Interest.belongsTo(models.comment, { foreignKey: 'comment_id', as: 'comment' });
  };

  return Interest;
};
