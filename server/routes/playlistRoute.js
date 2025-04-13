const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

// Route to create a new playlist
router.post('/api/create-playlist/:playlistName/:userId', playlistController.createPlaylist);

// Route to add a song to a playlist
router.post('/api/addToPlaylist/:playlistName/:songId/:userId', playlistController.addToPlaylist);

module.exports = router;