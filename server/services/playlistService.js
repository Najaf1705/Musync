const playlistRepository = require('../repositories/playlistRepository');

// Create playlist
const createNewPlaylist = async (userId, playlistName) => {
  if (!userId || !playlistName) {
    throw { status: 400, message: 'User ID and playlist name are required' };
  }

  const user = await playlistRepository.findUserById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  // Check if playlist already exists
  if (!Array.isArray(user.playlists)) {
    user.playlists = [];
  }

  const playlistExists = user.playlists.some(p => p.playlistName === playlistName);
  if (playlistExists) {
    throw { status: 400, message: 'Playlist name already exists' };
  }

  const newPlaylist = await playlistRepository.createPlaylist(userId, playlistName);
  return newPlaylist;
};

// Delete playlist
const deleteExistingPlaylist = async (userId, playlistName) => {
  if (!userId || !playlistName) {
    throw { status: 400, message: 'User ID and playlist name are required' };
  }

  const user = await playlistRepository.findUserById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlist = await playlistRepository.findPlaylistByName(userId, playlistName);
  if (!playlist) {
    throw { status: 404, message: 'Playlist not found' };
  }

  await playlistRepository.deletePlaylist(userId, playlistName);
  return { message: 'Playlist deleted successfully' };
};

// Add song to playlist
const addSongToExistingPlaylist = async (userId, playlistName, songId) => {
  if (!userId || !playlistName || !songId) {
    throw { status: 400, message: 'User ID, playlist name, and song ID are required' };
  }

  const user = await playlistRepository.findUserById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlist = await playlistRepository.findPlaylistByName(userId, playlistName);
  if (!playlist) {
    throw { status: 404, message: 'Playlist not found' };
  }

  if (playlist.songs.includes(songId)) {
    throw { status: 400, message: 'Song already exists in the playlist' };
  }

  await playlistRepository.addSongToPlaylist(userId, playlistName, songId);
  return { message: 'Song added to the playlist' };
};

// Remove song from playlist
const removeSongFromExistingPlaylist = async (userId, playlistName, songId) => {
  if (!userId || !playlistName || !songId) {
    throw { status: 400, message: 'User ID, playlist name, and song ID are required' };
  }

  const user = await playlistRepository.findUserById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlist = await playlistRepository.findPlaylistByName(userId, playlistName);
  if (!playlist) {
    throw { status: 404, message: 'Playlist not found' };
  }

  if (!playlist.songs.includes(songId)) {
    throw { status: 400, message: 'Song not found in playlist' };
  }

  await playlistRepository.removeSongFromPlaylist(userId, playlistName, songId);
  return { message: 'Song removed from the playlist' };
};

// Get user playlists
const getUserPlaylists = async (userId) => {
  if (!userId) {
    throw { status: 400, message: 'User ID is required' };
  }

  const user = await playlistRepository.findUserById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlists = await playlistRepository.getUserPlaylists(userId);
  return playlists;
};

// Get playlist songs
const getPlaylistSongs = async (userId, playlistName) => {
  if (!userId || !playlistName) {
    throw { status: 400, message: 'User ID and playlist name are required' };
  }

  const user = await playlistRepository.findUserById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlist = await playlistRepository.findPlaylistByName(userId, playlistName);
  if (!playlist) {
    throw { status: 404, message: 'Playlist not found' };
  }

  const songs = await playlistRepository.getPlaylistSongs(userId, playlistName);
  return songs;
};

module.exports = {
  createNewPlaylist,
  deleteExistingPlaylist,
  addSongToExistingPlaylist,
  removeSongFromExistingPlaylist,
  getUserPlaylists,
  getPlaylistSongs,
};
