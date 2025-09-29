const router = require('express').Router();
const najafMockController = require('../controllers/najafMockController');

router.get('/api/najafMockData', najafMockController.getNajafMockData);
router.get('/api/najafMockData/:id', najafMockController.getNajafMockDataId);
router.post('/api/najafMockData/add', najafMockController.postNajafMockData);

module.exports = router;