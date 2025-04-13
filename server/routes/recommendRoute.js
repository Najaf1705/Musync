const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');

// Define the route for song recommendations
router.get('/api/recommendations', recommendController.getRecommendations);

module.exports = router;