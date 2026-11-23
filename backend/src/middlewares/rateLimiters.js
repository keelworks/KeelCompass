const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

// keyed by signed-in user id when available (falls back to IP, normalized
// for IPv6 via the library's own helper, though these routes all sit
// behind isUser so a user id should always be present in practice)
const keyGenerator = (req) => (req.user?.id ? `user:${req.user.id}` : ipKeyGenerator(req.ip));

// spam prevention: cap how many new questions/comments one person can
// create in a short window
const createQuestionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "You're posting questions too quickly. Please wait a bit and try again." },
});

const createCommentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "You're posting comments too quickly. Please wait a bit and try again." },
});

module.exports = { createQuestionLimiter, createCommentLimiter };
