const express = require('express');
const { register, login, logout, resetPassword } = require('../controllers/authController');

const router = express.Router();

// Basic Auth flows
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.put('/reset-password', resetPassword);

module.exports = router;
