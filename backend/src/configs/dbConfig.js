const env = process.env.NODE_ENV || "development";

// Load env files only for direct local runs
if (env === "development") {
  require("dotenv").config({ path: ".env" });
}

// In development mode, override DB_HOST if running inside Docker
let dbHost = process.env.DB_HOST;
if (env === "development" && process.env.IS_DOCKER === "true") {
  dbHost = "host.docker.internal";
}

module.exports = {
  HOST: dbHost,
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
