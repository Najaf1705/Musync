const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const authenticate = require('../middleware/authMiddleware');

// Route to create a new playlist
router.post('/api/create-playlist/:playlistName', authenticate, playlistController.createPlaylist);

// Route to delete a new playlist
router.delete('/api/delete-playlist/:playlistName', authenticate, playlistController.deletePlaylist);

// Route to add a song to a playlist
router.post('/api/addToPlaylist/:playlistName/:songId', authenticate, playlistController.addToPlaylist);

// Route to remove a song from playlist
router.post('/api/removeFromPlaylist/:playlistName/:songId', authenticate, playlistController.removeFromPlaylist);

module.exports = router;