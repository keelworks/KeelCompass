module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define(
    "Attachment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mime_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
      },
    },
    {
      tableName: "Attachments",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  Attachment.associate = (models) => {
    Attachment.belongsTo(models.question, { foreignKey: 'question_id' });
    Attachment.belongsTo(models.comment, { foreignKey: 'comment_id' });
  };

  return Attachment;
};
