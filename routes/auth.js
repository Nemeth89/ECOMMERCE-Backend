const express = require('express');
const { registerUser, loginUser, forgotPassword } = require('../controllers/authController');
const router = express.Router();

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Forgot password
router.post('/forgot-password', forgotPassword);

module.exports = router;
