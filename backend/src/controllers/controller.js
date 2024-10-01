const sequelize = require("../models/index");
// const db = require("../model");

// A health check method to check db connection status
const healthCheck = async (req, res) => {
  sequelize.sequelize.authenticate().then(() => {
    res.send("Connection established successfully.");
  });
};

module.exports = {
  healthCheck,
};
