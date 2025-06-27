module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: User,
          key: 'id',
        },
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'questions',
          key: 'id',
        },
      },
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.ENUM(
          'approved',
          'rejected',
          'liked',
          'reported',
          'commented',
          'bookmarked',
          'updated',
          'announcement'
        ),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      target_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'Notifications',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    }
  );

  Notification.associate = (models) => {
    Notification.belongsTo(models.user, { foreignKey: 'user_id', as: 'user' });
    Notification.belongsTo(models.question, { foreignKey: 'question_id', as: 'question' });
    Notification.belongsTo(models.comment, { foreignKey: 'comment_id', as: 'comment' });
  };

  return Notification;
};
