const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// Test Route
router.get('/api', (req, res) => {
  res.send("Hello niggas i'm working");
});

router.get('/api/userExists', authController.userExists);

router.post('/api/login/normal', authController.normalLogin);

router.post('/api/login/google', authController.googleLogin);

router.post('/api/signup/normal', authController.normalSignup);

router.post('/api/signup/google', authController.googleSignup);

router.post('/api/otp', authController.generateOtp);
router.post('/api/newuser', authController.createUser);


// Logout
router.post('/api/logout', authController.logout);

// Profile Endpoint
router.get('/api/user', authenticate, authController.serverProfile);

module.exports = router;