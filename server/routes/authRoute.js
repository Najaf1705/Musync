const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// Test Route
router.get('/', (req, res) => {
  res.send("Hello, I'm auth from router");
});

// Email Registration
router.post('/serverregister', authenticate, authController.serverRegister);

// Google Registration
router.post('/googleserverregister', authController.googleServerRegister);

// Email Login
router.post('/serverlogin', authController.serverLogin);

// Google Login
router.post('/googleserverlogin', authController.googleServerLogin);

// Logout
router.post('/logout', authController.logout);

// Profile Endpoint
router.get('/serverprofile', authenticate, authController.serverProfile);

module.exports = router;