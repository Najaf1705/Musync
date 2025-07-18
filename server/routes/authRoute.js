const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// Test Route
router.get('/', (req, res) => {
  res.send("Hello niggas i'm working");
});

router.get('/userExists', authController.userExists);

router.post('/login', authController.login);

router.post('/signup', authController.signup);

// Logout
router.post('/logout', authController.logout);

// Profile Endpoint
router.get('/serverprofile', authenticate, authController.serverProfile);

module.exports = router;