module.exports = (sequelize, DataTypes) => {
  const StudentProfile = sequelize.define("StudentProfile", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Users table
        key: "id",
      },
    },
    educational_background: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    career_interests: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    past_interactions: {
      type: DataTypes.JSON,
      allowNull: true, // Can also reference another table if needed
    },
  });
  return StudentProfile;
};
