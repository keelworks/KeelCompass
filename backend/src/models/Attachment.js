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
      // legacy base64-in-MySQL storage, kept nullable for any row that
      // predates the disk-storage migration - new rows only use file_path
      data: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: true,
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
