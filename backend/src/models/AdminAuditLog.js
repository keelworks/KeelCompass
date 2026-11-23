module.exports = (sequelize, DataTypes) => {
  const AdminAuditLog = sequelize.define(
    "AdminAuditLog",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      admin_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      target_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      target_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "AdminAuditLogs",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  AdminAuditLog.associate = (models) => {
    AdminAuditLog.belongsTo(models.User, { foreignKey: "admin_user_id", as: "admin" });
  };

  return AdminAuditLog;
};
