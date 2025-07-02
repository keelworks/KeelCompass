const express = require("express");
const { body } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");

const { register, login } = require("../controllers/authControllers");

const router = express.Router();

const registerValidation = [
  body('username').notEmpty().withMessage('Username is required.'),
  body('email').isEmail().withMessage('Email address is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  handleValidationErrors,
];

const loginValidation = [
  body('email').isEmail().withMessage('Email address is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
  handleValidationErrors,
];

// register
router.post('/register', registerValidation, register);

// login
router.post('/login', loginValidation, login);

module.exports = router;
