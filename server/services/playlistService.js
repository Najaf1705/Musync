const playlistRepository = require('../repositories/playlistRepository');

// Create playlist
const createNewPlaylist = async (userIdentifier, playlistName) => {
  if (!userIdentifier || !playlistName) {
    throw { status: 400, message: 'User identifier and playlist name are required' };
  }

  const user = await playlistRepository.findUserByIdentifier(userIdentifier);
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

  const newPlaylist = await playlistRepository.createPlaylist(userIdentifier, playlistName);
  return newPlaylist;
};

// Delete playlist
const deleteExistingPlaylist = async (userIdentifier, playlistName) => {
  if (!userIdentifier || !playlistName) {
    throw { status: 400, message: 'User identifier and playlist name are required' };
  }

  const user = await playlistRepository.findUserByIdentifier(userIdentifier);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlist = await playlistRepository.findPlaylistByName(userIdentifier, playlistName);
  if (!playlist) {
    throw { status: 404, message: 'Playlist not found' };
  }

  await playlistRepository.deletePlaylist(userIdentifier, playlistName);
  return { message: 'Playlist deleted successfully' };
};

// Add song to playlist
const addSongToExistingPlaylist = async (userIdentifier, playlistName, songId) => {
  if (!userIdentifier || !playlistName || !songId) {
    throw { status: 400, message: 'User identifier, playlist name, and song ID are required' };
  }

  const user = await playlistRepository.findUserByIdentifier(userIdentifier);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlist = await playlistRepository.findPlaylistByName(userIdentifier, playlistName);
  if (!playlist) {
    throw { status: 404, message: 'Playlist not found' };
  }

  if (playlist.songs.includes(songId)) {
    throw { status: 400, message: 'Song already exists in the playlist' };
  }

  await playlistRepository.addSongToPlaylist(userIdentifier, playlistName, songId);
  return { message: 'Song added to the playlist' };
};

// Remove song from playlist
const removeSongFromExistingPlaylist = async (userIdentifier, playlistName, songId) => {
  if (!userIdentifier || !playlistName || !songId) {
    throw { status: 400, message: 'User identifier, playlist name, and song ID are required' };
  }

  const user = await playlistRepository.findUserByIdentifier(userIdentifier);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlist = await playlistRepository.findPlaylistByName(userIdentifier, playlistName);
  if (!playlist) {
    throw { status: 404, message: 'Playlist not found' };
  }

  if (!playlist.songs.includes(songId)) {
    throw { status: 400, message: 'Song not found in playlist' };
  }

  await playlistRepository.removeSongFromPlaylist(userIdentifier, playlistName, songId);
  return { message: 'Song removed from the playlist' };
};

// Get user playlists
const getUserPlaylists = async (userIdentifier) => {
  if (!userIdentifier) {
    throw { status: 400, message: 'User identifier is required' };
  }

  const user = await playlistRepository.findUserByIdentifier(userIdentifier);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlists = await playlistRepository.getUserPlaylists(userIdentifier);
  return playlists;
};

// Get playlist songs
const getPlaylistSongs = async (userIdentifier, playlistName) => {
  if (!userIdentifier || !playlistName) {
    throw { status: 400, message: 'User identifier and playlist name are required' };
  }

  const user = await playlistRepository.findUserByIdentifier(userIdentifier);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlist = await playlistRepository.findPlaylistByName(userIdentifier, playlistName);
  if (!playlist) {
    throw { status: 404, message: 'Playlist not found' };
  }

  const songs = await playlistRepository.getPlaylistSongs(userIdentifier, playlistName);
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
