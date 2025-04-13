const User = require('../models/userSchema');
const Odata = require('../models/dataSchema');

// Check if a song is liked by the user
const isSongLiked = async (req, res) => {
  const { userId, trackId } = req.query;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isLiked = user.likedSongs.includes(trackId);
    res.status(200).json({ isLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all liked songs for a user
const getLikedSongs = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.likedSongs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Toggle like status for a song
const toggleLike = async (req, res) => {
  try {
    const { trackId } = req.params;
    const userId = req.rootuser._id; // From auth middleware
    
    const user = await User.findById(userId);
    const isLiked = user.likedSongs.includes(trackId);
    
    if (isLiked) {
      // Unlike: Remove from user's liked songs
      user.likedSongs = user.likedSongs.filter(id => id !== trackId);
      
      // Update song data
      const songData = await Odata.findOne({ songId: trackId });
      if (songData) {
        if (songData.likeCount > 1) {
          songData.likeCount -= 1;
          await songData.save();
        } else {
          await Odata.deleteOne({ songId: trackId });
        }
      }
    } else {
      // Like: Add to user's liked songs
      user.likedSongs.push(trackId);
      
      // Update song data
      let songData = await Odata.findOne({ songId: trackId });
      if (!songData) {
        songData = new Odata({ songId: trackId, likeCount: 1 });
      } else {
        songData.likeCount += 1;
      }
      await songData.save();
    }

    await user.save();
    res.status(200).json({ 
      success: true, 
      isLiked: !isLiked,
      message: isLiked ? 'Song unliked successfully' : 'Song liked successfully'
    });

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get top songs
const getTopSongs = async (req, res) => {
  try {
    const topLikedSongs = await Odata.find()
      .sort({ likeCount: -1 })
      .limit(10)
      .lean();

    const topSongIds = topLikedSongs.map(song => song.songId);

    res.json({ 
      success: true, 
      data: topSongIds 
    });
  } catch (error) {
    console.error("Error fetching top songs:", error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};

module.exports={
  isSongLiked,
  getLikedSongs,
  toggleLike,
  getTopSongs
}