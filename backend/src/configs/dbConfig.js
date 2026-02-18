const env = process.env.NODE_ENV || "development";

// Load env files only for direct local runs
if (env === "development") {
  require("dotenv").config({ path: ".env" });
}

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null) return fallback;
  return String(value).toLowerCase() === "true";
};

let dbHost = process.env.DB_HOST;
if (env === "development" && process.env.IS_DOCKER === "true") {
  dbHost = "host.docker.internal";
}

module.exports = {
  URL: process.env.DATABASE_URL || null,
  HOST: dbHost,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASS,
  DB: process.env.DB_DATABASE,
  dialect: process.env.DB_DIALECT || "postgres",
  SSL: parseBoolean(process.env.DB_SSL, env === "production"),
  logging: parseBoolean(process.env.DB_LOGGING, false),
  omitNull: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
