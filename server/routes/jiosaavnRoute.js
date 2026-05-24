const express = require('express');
const router = express.Router();
const {
  searchSongs,
  searchPlaylists,
  getSongDetails,
  getPlaylistDetails,
  getAlbumDetails,
  getArtistDetails,
  getTrendingSongs,
  searchAll,
} = require('../controllers/jiosaavnController');

// Search endpoints
router.get('/api/search/songs', searchSongs);
router.get('/api/search/playlists', searchPlaylists);
router.get('/api/search', searchAll);

// Song details
router.get('/api/trackInfo/:id', getSongDetails);

// Playlist details
router.get('/api/playlists/:id', getPlaylistDetails);

// Album details
router.get('/api/albums/:id', getAlbumDetails);

// Artist details
router.get('/api/artists/:id', getArtistDetails);

// Trending songs
router.get('/api/trending', getTrendingSongs);

module.exports = router;
