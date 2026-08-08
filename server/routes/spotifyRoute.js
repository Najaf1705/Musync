const express = require('express');
const router = express.Router();
const {
  searchSongs,
  searchPlaylists,
  getSongDetails,
  getPlaylistDetails,
  getTrendingSongs,
  searchAll,
  getTopPlaylists,
  getPlaylistTracks,
} = require('../controllers/spotifyController');

// Search endpoints
router.get('/api/search/songs', searchSongs);
router.get('/api/search/playlists', searchPlaylists);
router.get('/api/search', searchAll);
router.get('/api/search-playlists', searchPlaylists);

// Song details
router.get('/api/trackInfo/:id', getSongDetails);

// Playlist details
router.get('/api/playlists/:id', getPlaylistDetails);
router.get('/api/playlist-tracks/:playlistId', getPlaylistTracks);

// Trending / top playlists
router.get('/api/trending', getTrendingSongs);
router.get('/api/top', getTopPlaylists);

module.exports = router;