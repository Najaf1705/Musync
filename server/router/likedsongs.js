const express = require('express');
const router = express.Router();
const User = require('../models/userSchema'); // Import the User model

// Define the route to like a song
router.post('/api/like-song', async (req, res) => {
  const { userId, trackId } = req.body;

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the Spotify link to the user's likedSongs array
    user.likedSongs.push(trackId);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Song liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// check if song in the likedsongs of the user
router.get('/api/is-song-liked', async (req, res) => {
  const { userId, trackId } = req.query;

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the provided trackId exists in the likedSongs array
    const isLiked = user.likedSongs.includes(trackId);

    res.status(200).json({ isLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define the route to get all liked songs for a user
router.get('/api/liked-songs/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's liked songs array
    res.status(200).json(user.likedSongs);
    // console.log(user.likedSongs);
    // return user.likedSongs;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Like Song
router.post('/api/like-song/:userId/:trackId', async (req, res) => {
  const userId = req.params.userId;
  const trackId = req.params.trackId;

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the trackId exists in the liked songs array
    const isSongLiked = user.likedSongs.includes(trackId);

    if (isSongLiked) {
      return res.status(400).json({ message: 'Song is already liked' });
    }

    // Add the trackId to the liked songs array
    user.likedSongs.push(trackId);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Song liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Unlike Song
router.post('/api/unlike-song/:userId/:trackId', async (req, res) => {
  const userId = req.params.userId;
  const trackId = req.params.trackId;

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the trackId exists in the liked songs array
    const indexOfTrack = user.likedSongs.indexOf(trackId);

    if (indexOfTrack === -1) {
      return res.status(400).json({ message: 'Song not found in liked songs' });
    }

    // Remove the trackId from the liked songs array
    user.likedSongs.splice(indexOfTrack, 1);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Song unliked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





module.exports = router;
