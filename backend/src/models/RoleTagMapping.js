module.exports = (sequelize, DataTypes) => {
  const RoleTagMapping = sequelize.define(
    "RoleTagMapping",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tag: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "manager", "staff", "viewer"),
        allowNull: false,
      },
    },
    {
      tableName: "RoleTagMappings",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return RoleTagMapping;
};
