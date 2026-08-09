const playlistRepository = require('../repositories/playlistRepository');

const normalizeValue = (value) => (typeof value === 'string' ? value.trim() : value);

// Create playlist
const createNewPlaylist = async (userIdentifier, playlistName) => {
  const normalizedPlaylistName = normalizeValue(playlistName);
  if (!userIdentifier || !normalizedPlaylistName) {
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

  const playlistExists = user.playlists.some(
    p => normalizeValue(p.playlistName)?.toLocaleLowerCase() === normalizedPlaylistName.toLocaleLowerCase()
  );
  if (playlistExists) {
    throw { status: 400, message: 'Playlist name already exists' };
  }

  const newPlaylist = await playlistRepository.createPlaylist(userIdentifier, normalizedPlaylistName);
  return newPlaylist;
};

// Delete playlist
const deleteExistingPlaylist = async (userIdentifier, playlistName) => {
  const normalizedPlaylistName = normalizeValue(playlistName);
  if (!userIdentifier || !normalizedPlaylistName) {
    throw { status: 400, message: 'User identifier and playlist name are required' };
  }

  const user = await playlistRepository.findUserByIdentifier(userIdentifier);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlist = await playlistRepository.findPlaylistByName(userIdentifier, normalizedPlaylistName);
  if (!playlist) {
    throw { status: 404, message: 'Playlist not found' };
  }

  await playlistRepository.deletePlaylist(userIdentifier, normalizedPlaylistName);
  return { message: 'Playlist deleted successfully' };
};

// Add song to playlist
const addSongToExistingPlaylist = async (userIdentifier, playlistName, songId) => {
  const normalizedPlaylistName = normalizeValue(playlistName);
  const normalizedSongId = normalizeValue(songId);

  if (!userIdentifier || !normalizedPlaylistName || !normalizedSongId) {
    throw { status: 400, message: 'User identifier, playlist name, and song ID are required' };
  }

  const user = await playlistRepository.findUserByIdentifier(userIdentifier);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlist = await playlistRepository.findPlaylistByName(userIdentifier, normalizedPlaylistName);
  if (!playlist) {
    throw { status: 404, message: 'Playlist not found' };
  }

  if (!Array.isArray(playlist.songs)) {
    playlist.songs = [];
  }

  if (playlist.songs.includes(normalizedSongId)) {
    return { message: 'Song already exists in the playlist', alreadyInPlaylist: true };
  }

  await playlistRepository.addSongToPlaylist(userIdentifier, normalizedPlaylistName, normalizedSongId);
  return { message: 'Song added to the playlist' };
};



// Remove song from playlist
const removeSongFromExistingPlaylist = async (userIdentifier, playlistName, songId) => {
  const normalizedPlaylistName = normalizeValue(playlistName);
  const normalizedSongId = normalizeValue(songId);
  if (!userIdentifier || !normalizedPlaylistName || !normalizedSongId) {
    throw { status: 400, message: 'User identifier, playlist name, and song ID are required' };
  }

  const user = await playlistRepository.findUserByIdentifier(userIdentifier);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlist = await playlistRepository.findPlaylistByName(userIdentifier, normalizedPlaylistName);
  if (!playlist) {
    throw { status: 404, message: 'Playlist not found' };
  }

  if (!playlist.songs.includes(normalizedSongId)) {
    throw { status: 400, message: 'Song not found in playlist' };
  }

  await playlistRepository.removeSongFromPlaylist(userIdentifier, normalizedPlaylistName, normalizedSongId);
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
  const normalizedPlaylistName = normalizeValue(playlistName);
  if (!userIdentifier || !normalizedPlaylistName) {
    throw { status: 400, message: 'User identifier and playlist name are required' };
  }

  const user = await playlistRepository.findUserByIdentifier(userIdentifier);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const playlist = await playlistRepository.findPlaylistByName(userIdentifier, normalizedPlaylistName);
  if (!playlist) {
    throw { status: 404, message: 'Playlist not found' };
  }

  const songs = await playlistRepository.getPlaylistSongs(userIdentifier, normalizedPlaylistName);
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
