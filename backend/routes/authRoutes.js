const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, resetPasswordWithOTP, sendOTP, verifyOTP, debugOTPStorage, clearOTP } = require('../controllers/authController');

// User authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/reset-password-otp', resetPasswordWithOTP);

// OTP verification routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Debug route (remove in production)
router.get('/debug-otp', debugOTPStorage);

// Clear OTP route (for testing)
router.post('/clear-otp', clearOTP);

module.exports = router;