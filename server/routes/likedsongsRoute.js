const express = require('express');
const router = express.Router();
const likedSongsController = require('../controllers/likedSongsController');
const authenticate = require('../middleware/authMiddleware');

// Check if a song is liked
router.get('/api/is-song-liked', likedSongsController.isSongLiked);

// Get all liked songs for a user
router.get('/api/liked-songs/:userId', likedSongsController.getLikedSongs);

// toggle like a song
router.post('/api/toggle-like/:trackId', authenticate, likedSongsController.toggleLike);

// Get top songs
router.post('/api/topSongs', likedSongsController.getTopSongs);

module.exports = router;