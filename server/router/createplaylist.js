const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');

router.post('/api/create-playlist/:playlistName/:userId', async (req, res) => {
  try {
    const {playlistName,userId}=req.params;
    const user=await User.findById(userId);

    if (!Array.isArray(user.playlists)) {
      // If it's not an array or undefined, initialize it as an empty array
      user.playlists = [];
    }

    const playlistExists = user.playlists.some((playlist) => playlist.playlistName === playlistName);

    if (playlistExists) {
      return res.status(400).json({ error: 'Playlist name already exists' });
    }

    const newPlaylist = { playlistName, songs: [] };

    // Push the new playlist object into the user's playlists array
    user.playlists.push(newPlaylist);
    console.log(newPlaylist);
    await user.save();
    res.status(201).json(newPlaylist);

  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;