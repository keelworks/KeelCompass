require("dotenv").config();

const isDocker = process.env.IS_DOCKER === "true";

module.exports = {
  HOST: isDocker ? "host.docker.internal" : process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASS,
  DB: process.env.DB_DATABASE,
  dialect: process.env.DB_DIALECT,
  omitNull: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
