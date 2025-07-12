const User = require('../models/userSchema');

// Create a new playlist
const createPlaylist = async (req, res) => {
  try {
    const { playlistName, userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

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
};


// Add a song to a playlist
const addToPlaylist = async (req, res) => {
  try {
    const { playlistName, songId, userId } = req.params;

    // Defensive check for missing params
    if (!userId || !playlistName || !songId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const playlist = user.playlists.find(p => p.playlistName === playlistName);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ error: 'Song already exists in the playlist' });
    }

    playlist.songs.push(songId);
    await user.save();

    return res.status(200).json({ message: 'Song added to the playlist' });

  } catch (error) {
    console.error('Error adding to playlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




const removeFromPlaylist = async (req, res) => {
  console.log("Removing song from playlist");

  try {
    const { playlistName, songId, userId } = req.params;

    // Defensive check
    if (!userId || !playlistName || !songId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const playlist = user.playlists.find(p => p.playlistName === playlistName);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (!playlist.songs.includes(songId)) {
      return res.status(400).json({ error: 'Song not found in playlist' });
    }

    // Remove the song
    playlist.songs = playlist.songs.filter(id => id !== songId);

    await user.save();
    return res.status(200).json({ message: 'Song removed from the playlist' });

  } catch (error) {
    console.error('Error removing song from playlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  createPlaylist,
  addToPlaylist,
  removeFromPlaylist,
};