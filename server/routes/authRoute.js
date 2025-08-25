const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// Test Route
router.get('/api', (req, res) => {
  res.send("Hello niggas i'm working");
});

router.get('/api/userExists', authController.userExists);

router.post('/api/login', authController.login);

router.post('/api/signup', authController.signup);

// Logout
router.post('/api/logout', authController.logout);

// Profile Endpoint
router.get('/api/serverprofile', authenticate, authController.serverProfile);

module.exports = router;