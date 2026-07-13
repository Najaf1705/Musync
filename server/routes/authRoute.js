const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// Test Route
router.get('/api', (req, res) => {
  res.send("Hello niggas i'm working");
});

// Profile Endpoint
router.get('/api/user', authenticate, authController.serverProfile);

module.exports = router;