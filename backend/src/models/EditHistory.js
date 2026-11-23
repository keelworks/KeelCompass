module.exports = (sequelize, DataTypes) => {
  const EditHistory = sequelize.define(
    'EditHistory',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      entity_type: {
        type: DataTypes.ENUM('question', 'comment'),
        allowNull: false,
      },
      entity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      previous_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      previous_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'EditHistories',
      timestamps: true,
      createdAt: 'edited_at',
      updatedAt: false,
    }
  );

  return EditHistory;
};
