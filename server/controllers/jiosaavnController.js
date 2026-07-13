const jiosaavnService = require('../services/jiosaavnService');

// Search for songs
const searchSongs = async (req, res) => {
  try {
    const { q, page = 0, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const result = await jiosaavnService.searchSongs(q, parseInt(page), parseInt(limit));
    res.json(result);
  } catch (error) {
    // console.error('Error in searchSongs:', error);
    res.status(500).json({ error: 'Failed to search songs' });
  }
};

// Search for playlists
const searchPlaylists = async (req, res) => {
  try {
    const { q, page = 0, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const result = await jiosaavnService.searchPlaylists(q, parseInt(page), parseInt(limit));
    res.json(result);
  } catch (error) {
    // console.error('Error in searchPlaylists:', error);
    res.status(500).json({ error: 'Failed to search playlists' });
  }
};

// Get song details
const getSongDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Song ID is required' });
    }

    const result = await jiosaavnService.getSongDetails(id);
    res.json(result);
  } catch (error) {
    // console.error('Error in getSongDetails:', error);
    res.status(500).json({ error: 'Failed to fetch song details' });
  }
};

// Get playlist details
const getPlaylistDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Playlist ID is required' });
    }

    const result = await jiosaavnService.getPlaylistDetails(id);
    res.json(result);
  } catch (error) {
    // console.error('Error in getPlaylistDetails:', error);
    res.status(500).json({ error: 'Failed to fetch playlist details' });
  }
};

// Get album details
const getAlbumDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Album ID is required' });
    }

    const result = await jiosaavnService.getAlbumDetails(id);
    res.json(result);
  } catch (error) {
    // console.error('Error in getAlbumDetails:', error);
    res.status(500).json({ error: 'Failed to fetch album details' });
  }
};

// Get artist details
const getArtistDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Artist ID is required' });
    }

    const result = await jiosaavnService.getArtistDetails(id);
    res.json(result);
  } catch (error) {
    // console.error('Error in getArtistDetails:', error);
    res.status(500).json({ error: 'Failed to fetch artist details' });
  }
};

// Get trending songs
const getTrendingSongs = async (req, res) => {
  try {
    const { page = 0, limit = 20 } = req.query;

    const result = await jiosaavnService.getTrendingSongs(parseInt(page), parseInt(limit));
    res.json(result);
  } catch (error) {
    // console.error('Error in getTren  dingSongs:', error);
    res.status(500).json({ error: 'Failed to fetch trending songs' });
  }
};

// Combined search for songs and playlists
const searchAll = async (req, res) => {
  try {
    const { q, page = 0 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const [songsResult, playlistsResult] = await Promise.all([
      jiosaavnService.searchSongs(q, parseInt(page), 20),
      jiosaavnService.searchPlaylists(q, parseInt(page), 10),
    ]);

    res.json({
      songs: songsResult,
      playlists: playlistsResult,
    });
  } catch (error) {
    console.error('Error in searchAll:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
};

module.exports = {
  searchSongs,
  searchPlaylists,
  getSongDetails,
  getPlaylistDetails,
  getAlbumDetails,
  getArtistDetails,
  getTrendingSongs,
  searchAll,
};
