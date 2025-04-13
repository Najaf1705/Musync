const express = require('express');
const router = express.Router();
const { 
  searchSongsAndPlaylists,
  getTopPlaylists,
  getPlaylistTracks,
  getTrackInfo 
} = require('../controllers/spotifyController');

// Replace separate search routes with combined search
router.get('/api/search', searchSongsAndPlaylists);

// Get featured playlists by country
router.get('/api/top', getTopPlaylists);

// Get tracks in a playlist
router.get('/api/playlist-tracks/:playlistId', getPlaylistTracks);

// Get track info by track ID
router.get('/api/:track_info', getTrackInfo);

module.exports = router;