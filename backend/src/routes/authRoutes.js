const express = require("express");
const { body } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const { register, verifyEmail, resendCode, login } = require("../controllers/authControllers");

const router = express.Router();

const registerValidation = [
  body('username').notEmpty().withMessage('Username is required.'),
  body('email').isEmail().withMessage('A valid email address is required.'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.'),
  handleValidationErrors,
];

const verifyEmailValidation = [
  body('email').isEmail().withMessage('A valid email address is required.'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Verification code must be 6 digits.').isNumeric().withMessage('Verification code must be numeric.'),
  handleValidationErrors,
];

const resendCodeValidation = [
  body('email').isEmail().withMessage('A valid email address is required.'),
  handleValidationErrors,
];

const loginValidation = [
  body('identifier').notEmpty().withMessage('Email or username is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
  handleValidationErrors,
];

// register
router.post('/register', registerValidation, register);

// verify email with the code sent during registration/resend
router.post('/verify-email', verifyEmailValidation, verifyEmail);

// resend a fresh verification code
router.post('/resend-code', resendCodeValidation, resendCode);

// login
router.post('/login', loginValidation, login);

module.exports = router;
