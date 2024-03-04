const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const User = require('../models/userSchema'); // Import the User model
const Odata = require('../models/dataSchema'); // Import the Odata model
let topLikedSongs=[];


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

    let songData=await Odata.findOne({songId:trackId});
    if (!songData) {
      // If the song data doesn't exist, create a new instance
      songData = new Odata({
        songId: trackId,
        likeCount: 1,
      });
    } else {
      // If the song data exists, increment the like count
      songData.likeCount += 1;
    }
    await songData.save();


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

    let songData=await Odata.findOne({songId:trackId});
    if (songData.likeCount > 1) {
      songData.likeCount -= 1;
      await songData.save();
    } else {
      await Odata.deleteOne({ songId: trackId });
    }
    await songData.save();

    res.status(200).json({ message: 'Song unliked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get top songs
router.post('/api/topSongs', async (req, res) => {
  try {
    const topLikedSongs = await Odata.find().sort({ likeCount: -1 }).limit(10);

    // Extract songId from each document
    const topSongIds = topLikedSongs.map(song => song.songId);

    const promises = topSongIds.map(async (songId) => {
      const response = await fetch(`http://localhost:5000/api/${songId}`);
      if (!response.ok) {
        console.error(`Failed to fetch song details for ID: ${songId}`, response.statusText);
        throw new Error(`Failed to fetch song details for ID: ${songId}`);
      }
      const songDetails = await response.json();
      return songDetails;
    });

    // Wait for all promises to resolve before updating the state
    const allSongDetails = await Promise.all(promises);
    console.log(allSongDetails);
    res.json({ success: true, data: allSongDetails });
  } catch (error) {
    console.error("Error fetching song details:", error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});



module.exports = router;
