const User = require('../models/userSchema');

// Find user by ID
const findUserById = async (userId) => {
  if (!userId) return null;
  return await User.findById(userId);
};

// Find playlist by name
const findPlaylistByName = async (userId, playlistName) => {
  const user = await User.findById(userId);
  if (!user) return null;
  return user.playlists.find(p => p.playlistName === playlistName);
};

// Create playlist
const createPlaylist = async (userId, playlistName) => {
  const user = await User.findById(userId);
  if (!user) return null;

  if (!Array.isArray(user.playlists)) {
    user.playlists = [];
  }

  const newPlaylist = { playlistName, songs: [] };
  user.playlists.push(newPlaylist);
  await user.save();
  return newPlaylist;
};

// Delete playlist
const deletePlaylist = async (userId, playlistName) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const playlistIndex = user.playlists.findIndex(p => p.playlistName === playlistName);
  if (playlistIndex === -1) return null;

  user.playlists.splice(playlistIndex, 1);
  await user.save();
  return true;
};

// Add song to playlist
const addSongToPlaylist = async (userId, playlistName, songId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const playlist = user.playlists.find(p => p.playlistName === playlistName);
  if (!playlist) return null;

  if (playlist.songs.includes(songId)) return false; // Song already exists

  playlist.songs.push(songId);
  await user.save();
  return true;
};

// Remove song from playlist
const removeSongFromPlaylist = async (userId, playlistName, songId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const playlist = user.playlists.find(p => p.playlistName === playlistName);
  if (!playlist) return null;

  if (!playlist.songs.includes(songId)) return false; // Song not found

  playlist.songs = playlist.songs.filter(id => id !== songId);
  await user.save();
  return true;
};

// Get all playlists for user
const getUserPlaylists = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  return user.playlists;
};

// Get playlist songs
const getPlaylistSongs = async (userId, playlistName) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const playlist = user.playlists.find(p => p.playlistName === playlistName);
  if (!playlist) return null;

  return playlist.songs;
};

module.exports = {
  findUserById,
  findPlaylistByName,
  createPlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getUserPlaylists,
  getPlaylistSongs,
};
