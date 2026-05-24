const likedSongsService = require('../services/likedSongsService');

// Check if a song is liked by the user
const isSongLiked = async (req, res) => {
  try {
    const { userId, trackId } = req.query;

    const isLiked = await likedSongsService.checkIfSongLiked(userId, trackId);
    res.status(200).json({ isLiked });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

// Get all liked songs for a user
const getLikedSongs = async (req, res) => {
  try {
    const userId = req.params.userId;

    const likedSongs = await likedSongsService.getAllLikedSongs(userId);
    res.status(200).json(likedSongs);
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

// Toggle like status for a song
const toggleLike = async (req, res) => {
  try {
    const { trackId } = req.params;
    const userId = req.rootuser._id; // From auth middleware

    const result = await likedSongsService.toggleSongLike(userId, trackId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Toggle like error:', error);
    const status = error.status || 500;
    res.status(status).json({ success: false, message: error.message || 'Internal server error' });
  }
};

// Get top songs
const getTopSongs = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await likedSongsService.getTopSongs(parseInt(limit));
    res.json(result);
  } catch (error) {
    console.error("Error fetching top songs:", error);
    const status = error.status || 500;
    res.status(status).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
};

module.exports = {
  isSongLiked,
  getLikedSongs,
  toggleLike,
  getTopSongs
};