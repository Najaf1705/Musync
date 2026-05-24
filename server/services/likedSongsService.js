const likedSongsRepository = require('../repositories/likedSongsRepository');

// Check if song is liked
const checkIfSongLiked = async (userId, trackId) => {
  if (!userId || !trackId) {
    throw { status: 400, message: 'User ID and track ID are required' };
  }

  const user = await likedSongsRepository.findUserById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const isLiked = await likedSongsRepository.isSongLiked(userId, trackId);
  return isLiked;
};

// Get all liked songs for a user
const getAllLikedSongs = async (userId) => {
  if (!userId) {
    throw { status: 400, message: 'User ID is required' };
  }

  const user = await likedSongsRepository.findUserById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const likedSongs = await likedSongsRepository.getUserLikedSongs(userId);
  return likedSongs;
};

// Toggle like status for a song
const toggleSongLike = async (userId, trackId) => {
  if (!userId || !trackId) {
    throw { status: 400, message: 'User ID and track ID are required' };
  }

  const user = await likedSongsRepository.findUserById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const isCurrentlyLiked = await likedSongsRepository.isSongLiked(userId, trackId);

  if (isCurrentlyLiked) {
    // Unlike: Remove from user's liked songs
    await likedSongsRepository.removeLikedSong(userId, trackId);

    // Update song data
    await likedSongsRepository.updateSongLikeCount(trackId, false);

    return {
      success: true,
      isLiked: false,
      message: 'Song unliked successfully',
    };
  } else {
    // Like: Add to user's liked songs
    await likedSongsRepository.addLikedSong(userId, trackId);

    // Update song data
    await likedSongsRepository.updateSongLikeCount(trackId, true);

    return {
      success: true,
      isLiked: true,
      message: 'Song liked successfully',
    };
  }
};

// Get top liked songs
const getTopSongs = async (limit = 10) => {
  try {
    const topSongIds = await likedSongsRepository.getTopLikedSongs(limit);
    return {
      success: true,
      data: topSongIds,
    };
  } catch (error) {
    throw { status: 500, message: 'Failed to fetch top songs' };
  }
};

module.exports = {
  checkIfSongLiked,
  getAllLikedSongs,
  toggleSongLike,
  getTopSongs,
};
