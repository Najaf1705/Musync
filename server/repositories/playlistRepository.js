const User = require('../models/userSchema');
const mongoose = require('mongoose');

// Find user by ID
const findUserByIdentifier = async (userIdentifier) => {
  if (!userIdentifier) return null;
  return await User.findOne({ email: userIdentifier });
};

// Find playlist by name
const findPlaylistByName = async (userIdentifier, playlistName) => {
  const user = await findUserByIdentifier(userIdentifier);
  if (!user) return null;
  return user.playlists.find(p => p.playlistName === playlistName);
};

// Create playlist
const createPlaylist = async (userIdentifier, playlistName) => {
  const user = await findUserByIdentifier(userIdentifier  );
  if (!user) return null;

  if (!Array.isArray(user.playlists)) {
    user.playlists = [];
  }

  const newPlaylist = { playlistName, songs: [] };
  user.playlists.push(newPlaylist);
  await user.save();
  return user.playlists[user.playlists.length - 1];
};

// Delete playlist
const deletePlaylist = async (userIdentifier, playlistName) => {
  const user = await findUserByIdentifier(userIdentifier);
  if (!user) return null;

  const playlistIndex = user.playlists.findIndex(p => p.playlistName === playlistName);
  if (playlistIndex === -1) return null;

  user.playlists.splice(playlistIndex, 1);
  await user.save();
  return true;
};

// Add song to playlist
const addSongToPlaylist = async (userIdentifier, playlistName, songId) => {
  const user = await findUserByIdentifier(userIdentifier);
  if (!user) return null;

  const playlist = user.playlists.find(p => p.playlistName === playlistName);
  if (!playlist) return null;

  if (playlist.songs.includes(songId)) return false; // Song already exists

  playlist.songs.push(songId);
  await user.save();
  return true;
};

// Remove song from playlist
const removeSongFromPlaylist = async (userIdentifier, playlistName, songId) => {
  const user = await findUserByIdentifier(userIdentifier);
  if (!user) return null;

  const playlist = user.playlists.find(p => p.playlistName === playlistName);
  if (!playlist) return null;

  if (!playlist.songs.includes(songId)) return false; // Song not found

  playlist.songs = playlist.songs.filter(id => id !== songId);
  await user.save();
  return true;
};

// Get all playlists for user
const getUserPlaylists = async (userIdentifier) => {
  const user = await findUserByIdentifier(userIdentifier);
  if (!user) return null;
  return user.playlists;
};

// Get playlist songs
const getPlaylistSongs = async (userIdentifier, playlistName) => {
  const user = await findUserByIdentifier(userIdentifier);
  if (!user) return null;

  const playlist = user.playlists.find(p => p.playlistName === playlistName);
  if (!playlist) return null;

  return playlist.songs;
};

module.exports = {
  findUserByIdentifier,
  findPlaylistByName,
  createPlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getUserPlaylists,
  getPlaylistSongs,
};
