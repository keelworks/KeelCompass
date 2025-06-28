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
        references: {
          model: 'questions',
          key: 'id',
        },
      },
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
        references: {
          model: 'comments',
          key: 'id',
        },
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
    Attachment.belongsTo(models.Question, { foreignKey: 'question_id' });
    Attachment.belongsTo(models.Comment, { foreignKey: 'comment_id' });
  };

  return Attachment;
};
