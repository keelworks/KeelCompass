const dotenv = require("dotenv");
dotenv.config();

let dbHost = process.env.DB_HOST;
if (process.env.NODE_ENV === "development" && process.env.IS_DOCKER === "true") {
  dbHost = "host.docker.internal";
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    host: dbHost,
    dialect: process.env.DB_DIALECT
  }
};
