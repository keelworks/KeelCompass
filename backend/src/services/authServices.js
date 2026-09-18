const crypto = require("crypto");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");
const { generateToken } = require("../utils/jwtUtils");
const mailer = require("../utils/mailer");

const db = require("../models");
const User = db.User;

const ALLOWED_SIGNUP_DOMAIN = (process.env.ALLOWED_SIGNUP_DOMAIN || "keelworks.org").toLowerCase();
const VERIFICATION_CODE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const VERIFICATION_MAX_ATTEMPTS = 5;

const normalizeEmail = (email) => email.trim().toLowerCase();

const generateVerificationCode = () => String(crypto.randomInt(0, 1000000)).padStart(6, "0");

const issueVerificationCode = async (user, { username, email, hashedPassword } = {}) => {
  const code = generateVerificationCode();
  const hashedCode = await bcrypt.hash(code, 10);
  const now = new Date();

  const attrs = {
    verification_code: hashedCode,
    verification_code_expires_at: new Date(now.getTime() + VERIFICATION_CODE_TTL_MS),
    verification_code_sent_at: now,
    verification_attempts: 0,
    is_verified: false,
  };
  if (username !== undefined) attrs.username = username;
  if (hashedPassword !== undefined) attrs.password = hashedPassword;

  if (user) {
    await user.update(attrs);
  } else {
    user = await User.create({ ...attrs, email });
  }

  await mailer.sendVerificationCodeEmail({
    to: email,
    username: user.username,
    code,
    expiresInMinutes: VERIFICATION_CODE_TTL_MS / 60000,
  });

  return user;
};

// register
const register = async (username, email, password) => {
  try {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail.endsWith(`@${ALLOWED_SIGNUP_DOMAIN}`)) {
      throw new HttpError(
        403,
        `Only KeelWorks employees can sign up for KeelCompass. Please use your KeelWorks email address (e.g. name@${ALLOWED_SIGNUP_DOMAIN}) to create an account.`
      );
    }

    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser && existingUser.is_verified) {
      throw new HttpError(409, "An account with this email already exists. Please log in instead.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await issueVerificationCode(existingUser, {
      username,
      email: normalizedEmail,
      hashedPassword,
    });

    logger.info(`Verification code issued for signup: ${normalizedEmail}`);
    return { email: normalizedEmail, expiresInSeconds: VERIFICATION_CODE_TTL_MS / 1000 };
  } catch (error) {
    logEverything(error, "authServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error registering user");
  }
};

// verify email with the code sent at registration/resend
const verifyEmail = async (email, code) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      throw new HttpError(404, "We couldn't find a pending signup for that email. Please sign up again.");
    }
    if (user.is_verified) {
      throw new HttpError(409, "This account is already verified. Please log in.");
    }
    if (!user.verification_code || !user.verification_code_expires_at) {
      throw new HttpError(400, "No verification code is pending for this account. Please request a new one.");
    }
    if (new Date() > user.verification_code_expires_at) {
      throw new HttpError(410, "This verification code has expired. Please request a new one.");
    }
    if (user.verification_attempts >= VERIFICATION_MAX_ATTEMPTS) {
      throw new HttpError(429, "Too many incorrect attempts. Please request a new verification code.");
    }

    const isMatch = await bcrypt.compare(code, user.verification_code);
    if (!isMatch) {
      await user.increment("verification_attempts");
      throw new HttpError(401, "That verification code is incorrect. Please try again.");
    }

    await user.update({
      is_verified: true,
      verification_code: null,
      verification_code_expires_at: null,
      verification_code_sent_at: null,
      verification_attempts: 0,
    });

    const token = generateToken({ id: user.id, email: user.email, username: user.username });
    logger.info(`Email verified successfully for ${normalizedEmail}`);
    return token;
  } catch (error) {
    logEverything(error, "authServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error verifying email");
  }
};

// resend a fresh verification code
const resendCode = async (email) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      throw new HttpError(404, "We couldn't find a pending signup for that email. Please sign up again.");
    }
    if (user.is_verified) {
      throw new HttpError(409, "This account is already verified. Please log in.");
    }
    if (user.verification_code_sent_at) {
      const elapsedMs = Date.now() - new Date(user.verification_code_sent_at).getTime();
      if (elapsedMs < VERIFICATION_RESEND_COOLDOWN_MS) {
        const secondsRemaining = Math.ceil((VERIFICATION_RESEND_COOLDOWN_MS - elapsedMs) / 1000);
        throw new HttpError(429, `Please wait ${secondsRemaining}s before requesting another code.`);
      }
    }

    await issueVerificationCode(user, { email: normalizedEmail });

    logger.info(`Verification code resent for ${normalizedEmail}`);
    return { email: normalizedEmail, expiresInSeconds: VERIFICATION_CODE_TTL_MS / 1000 };
  } catch (error) {
    logEverything(error, "authServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error resending verification code");
  }
};

// login
const login = async (identifier, password) => {
  try {
    const trimmedIdentifier = identifier.trim();
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: trimmedIdentifier.toLowerCase() }, { username: trimmedIdentifier }],
      },
    });
    if (!user) throw new HttpError(401, "No account found with that email or username");
    if (!user.is_verified) {
      throw new HttpError(403, "Please verify your email before logging in. Check your inbox for the verification code.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new HttpError(401, "Invalid password");

    const token = generateToken({ id: user.id, email: user.email, username: user.username });
    logger.info(`User logged in successfully: ${trimmedIdentifier}`);
    return token;
  } catch (error) {
    logEverything(error, "authServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error logging in user");
  }
};

module.exports = {
  register,
  verifyEmail,
  resendCode,
  login,
};
