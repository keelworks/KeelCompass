const { DataTypes } = require("sequelize");
const db = require("./index");

const Tag = db.sequelize.define(
  "Tag",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "Tags",
    timestamps: false,
  }
);

module.exports = Tag;
