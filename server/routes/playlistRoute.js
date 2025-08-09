const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

// Route to create a new playlist
router.post('/api/create-playlist/:playlistName/:userId', playlistController.createPlaylist);

// Route to delete a new playlist
router.delete('/api/delete-playlist/:playlistName/:userId', playlistController.deletePlaylist);

// Route to add a song to a playlist
router.post('/api/addToPlaylist/:playlistName/:songId/:userId', playlistController.addToPlaylist);

// Route to remove a song from playlist
router.post('/api/removeFromPlaylist/:playlistName/:songId/:userId', playlistController.removeFromPlaylist);

module.exports = router;