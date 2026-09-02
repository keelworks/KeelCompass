const dotenv = require("dotenv");
dotenv.config();

let dbHost = process.env.DB_HOST;
if (process.env.NODE_ENV === "development" && process.env.IS_DOCKER === "true") {
  dbHost = "host.docker.internal";
}

// sequelize-cli looks up the config by NODE_ENV, but the actual connection
// details always come from env vars, so every env shares the same shape.
const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  host: dbHost,
  dialect: process.env.DB_DIALECT
};

module.exports = {
  development: config,
  testing: config,
  production: config
};
