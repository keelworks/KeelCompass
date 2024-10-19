module.exports = (sequelize, DataTypes) => {
  const AdminProfile = sequelize.define("AdminProfile", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Users table
        key: "id",
      },
    },
    administrative_privileges: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    system_configurations: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });
  return AdminProfile;
};
