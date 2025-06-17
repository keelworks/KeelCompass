const express = require("express");
const { body } = require("express-validator");
const { register, login, resetPassword } = require("../controllers/authController");
const { handleValidationErrors } = require("../utils/validationUtils");

const router = express.Router();

const registerValidation = [
  body('username').notEmpty().withMessage('Username is required.'),
  body('email').isEmail().withMessage('Please provide a valid email address.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  handleValidationErrors,
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
  handleValidationErrors,
];

const resetPasswordValidation = [
  body('username').notEmpty().withMessage('Username is required.'),
  body('email').isEmail().withMessage('Please provide a valid email address.'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.'),
  handleValidationErrors,
];

// register
router.post('/register', registerValidation, register);

// login
router.post('/login', loginValidation, login);

// reset password
router.put('/reset-password', resetPasswordValidation, resetPassword);

module.exports = router;
