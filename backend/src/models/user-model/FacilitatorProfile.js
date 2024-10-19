module.exports = (sequelize, DataTypes) => {
  const FacilitatorProfile = sequelize.define("FacilitatorProfile", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Users table
        key: "id",
      },
    },
    expertise: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    roles: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contributions: {
      type: DataTypes.JSON,
      allowNull: true, // Can also reference another table if needed
    },
  });
  return FacilitatorProfile;
};
