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
      },
    },
    {
      tableName: 'Interests',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  Interest.associate = (models) => {
    Interest.belongsTo(models.users, { foreignKey: 'user_id', as: 'user' });
    Interest.belongsTo(models.questions, { foreignKey: 'question_id', as: 'question' });
    Interest.belongsTo(models.comments, { foreignKey: 'comment_id', as: 'comment' });
  };

  return Interest;
};
