const mongoose = require('mongoose');
const User = require('../models/userSchema');
const Odata = require('../models/dataSchema');

// Find user by ID or email
const findUserByIdentifier = async (userIdentifier) => {
  if (!userIdentifier) return null;

  if (mongoose.Types.ObjectId.isValid(userIdentifier)) {
    return await User.findById(userIdentifier);
  }

  return await User.findOne({ email: userIdentifier });
};

// Find user by ID
const findUserById = async (userId) => {
  if (!userId) return null;
  return await User.findById(userId);
};

// Check if song is liked
const isSongLiked = async (userIdentifier, trackId) => {
  const user = await findUserByIdentifier(userIdentifier);
  if (!user) return null;
  return user.likedSongs.includes(trackId);
};

// Get user's liked songs
const getUserLikedSongs = async (userIdentifier) => {
  const user = await findUserByIdentifier(userIdentifier);
  if (!user) return null;
  return user.likedSongs;
};

// Add song to liked songs
const addLikedSong = async (userIdentifier, trackId) => {
  const user = await findUserByIdentifier(userIdentifier);
  if (!user) return null;
  
  if (!user.likedSongs.includes(trackId)) {
    user.likedSongs.push(trackId);
    await user.save();
  }
  return user;
};

// Remove song from liked songs
const removeLikedSong = async (userIdentifier, trackId) => {
  const user = await findUserByIdentifier(userIdentifier);
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
  findUserByIdentifier,
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
