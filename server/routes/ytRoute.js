const express = require('express');
const router = express.Router();
const { downloadSong, searchYtSong } = require('../controllers/ytController');

console.log("✅ ytRoute.js loaded");

router.get('/api/searchYtSong', searchYtSong);
router.get('/api/downloadSong', downloadSong);
router.get('/api/test', (req, res) => {
  console.log("ytRoute test hit");
  res.send("ytRoute is working");
});

module.exports = router;
