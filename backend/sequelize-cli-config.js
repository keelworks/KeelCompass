const dotenv = require("dotenv");
dotenv.config();

const buildConfig = () => {
  const dialect = process.env.DB_DIALECT || "postgres";
  const useSsl =
    (process.env.DB_SSL || "").toLowerCase() === "true" ||
    process.env.NODE_ENV === "production";
  let dbHost = process.env.DB_HOST;
  if (process.env.NODE_ENV === "development" && process.env.IS_DOCKER === "true") {
    dbHost = "host.docker.internal";
  }

  const config = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    host: dbHost,
    dialect,
  };

  if (process.env.DATABASE_URL) {
    config.use_env_variable = "DATABASE_URL";
  }

  if (useSsl) {
    config.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    };
  }

  return config;
};

module.exports = {
  development: buildConfig(),
  testing: buildConfig(),
  production: buildConfig(),
};
