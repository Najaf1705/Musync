const express = require('express');
const router = express.Router();
const fs = require('fs'); // Import the 'fs' module
const path = require('path');

// Build the path to the JSON data file
const dataPath = path.join(__dirname, 'songsmodel.json');

// Load the JSON data
const rawData = fs.readFileSync(dataPath);
const songsData = JSON.parse(rawData);

// Define the route for song recommendations
router.get('/api/recommendations', (req, res) => {
  const { songName } = req.query;

  if (!songName) {
    return res.status(400).json({ error: 'Please provide a valid song name.' });
  }

  const { songs } = songsData;

  // Find the song from the loaded data
  const song = songs.find((s) => s.song === songName);

  if (!song) {
    return res.status(404).json({ error: 'Song not found.' });
  }

  res.json(song.recommend);
});

module.exports = router;
