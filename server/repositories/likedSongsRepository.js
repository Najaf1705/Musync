const User = require('../models/userSchema');
const Odata = require('../models/dataSchema');

// Find user by ID
const findUserById = async (userId) => {
  if (!userId) return null;
  return await User.findById(userId);
};

// Check if song is liked
const isSongLiked = async (userId, trackId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  return user.likedSongs.includes(trackId);
};

// Get user's liked songs
const getUserLikedSongs = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  return user.likedSongs;
};

// Add song to liked songs
const addLikedSong = async (userId, trackId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  
  if (!user.likedSongs.includes(trackId)) {
    user.likedSongs.push(trackId);
    await user.save();
  }
  return user;
};

// Remove song from liked songs
const removeLikedSong = async (userId, trackId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  
  user.likedSongs = user.likedSongs.filter(id => id !== trackId);
  await user.save();
  return user;
};

// Find song data by ID
const findSongDataById = async (trackId) => {
  return await Odata.findOne({ songId: trackId });
};

// Create song data
const createSongData = async (trackId) => {
  const songData = new Odata({ songId: trackId, likeCount: 1 });
  return await songData.save();
};

// Update song like count
const updateSongLikeCount = async (trackId, increment = true) => {
  let songData = await Odata.findOne({ songId: trackId });
  
  if (!songData) {
    if (increment) {
      songData = await createSongData(trackId);
    }
    return songData;
  }

  if (increment) {
    songData.likeCount += 1;
  } else {
    songData.likeCount -= 1;
  }

  if (songData.likeCount > 0) {
    await songData.save();
  } else {
    await Odata.deleteOne({ songId: trackId });
    return null;
  }

  return songData;
};

// Delete song data
const deleteSongData = async (trackId) => {
  return await Odata.deleteOne({ songId: trackId });
};

// Get top liked songs
const getTopLikedSongs = async (limit = 10) => {
  const topLikedSongs = await Odata.find()
    .sort({ likeCount: -1 })
    .limit(limit)
    .lean();

  return topLikedSongs.map(song => song.songId);
};

module.exports = {
  findUserById,
  isSongLiked,
  getUserLikedSongs,
  addLikedSong,
  removeLikedSong,
  findSongDataById,
  createSongData,
  updateSongLikeCount,
  deleteSongData,
  getTopLikedSongs,
};
