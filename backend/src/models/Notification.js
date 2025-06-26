const { DataTypes } = require('sequelize');

module.exports = (sequelize, User) => {
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
      type: {
        type: DataTypes.ENUM(
          'approved',
          'rejected',
          'liked',
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
    }
  );

  Notification.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(Notification, { foreignKey: 'user_id', sourceKey: 'id' });

  return Notification;
};
