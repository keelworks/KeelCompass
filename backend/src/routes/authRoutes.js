const express = require("express");
const { body } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const { googleAuth } = require("../controllers/authControllers");

const router = express.Router();

const googleAuthValidation = [
  body('credential').notEmpty().withMessage('Google credential is required.'),
  handleValidationErrors,
];

// sign in / sign up with Google
router.post('/google', googleAuthValidation, googleAuth);

module.exports = router;
