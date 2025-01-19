// configs/redisConfig.js
const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis").default;

// Initialize Redis client
const redisClient = redis.createClient();

// Handle Redis connection events
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("ready", () => {
  console.log("Redis client is ready");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

// Attempt to connect Redis client
(async () => {
  try {
    await redisClient.connect();
    console.log("Redis connection established.");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
})();

// Configure session middleware using Redis
const redisSessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: `${process.env.REDIS_SESSION_SECRET}`, // Replace this with a secure secret
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 15 * 60 * 1000 }, // 15 minutes session expiry
});

module.exports = { redisClient, redisSessionMiddleware };
