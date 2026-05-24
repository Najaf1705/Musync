const playlistService = require('../services/playlistService');

// Create a new playlist
const createPlaylist = async (req, res) => {
  try {
    const { playlistName, userId } = req.params;

    const newPlaylist = await playlistService.createNewPlaylist(userId, playlistName);
    res.status(201).json(newPlaylist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Internal Server Error' });
  }
};

// Delete a playlist
const deletePlaylist = async (req, res) => {
  try {
    const { playlistName, userId } = req.params;

    const result = await playlistService.deleteExistingPlaylist(userId, playlistName);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting playlist:', error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Internal Server Error' });
  }
};

// Add a song to a playlist
const addToPlaylist = async (req, res) => {
  try {
    const { playlistName, songId, userId } = req.params;

    const result = await playlistService.addSongToExistingPlaylist(userId, playlistName, songId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error adding to playlist:', error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Internal Server Error' });
  }
};

// Remove a song from a playlist
const removeFromPlaylist = async (req, res) => {
  try {
    const { playlistName, songId, userId } = req.params;

    const result = await playlistService.removeSongFromExistingPlaylist(userId, playlistName, songId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Internal Server Error' });
  }
};

module.exports = {
  createPlaylist,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist,
};