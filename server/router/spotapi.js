const express = require('express');
// const fetch = require('node-fetch');
// const SpotifyWebApi = require('node-spotify-webapi');
const dotenv = require('dotenv');
const router = express.Router();
dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
// router.use(cookieParser());

// Function to fetch an access token from Spotify
const getAccessToken = async () => {
  const base64data = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${base64data}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  // console.log(data.access_token)
  return data.access_token;
};


//song API endpoint to search for a by name
router.get('/api/search', async (req, res) => {
  const songName = req.query.name;
  const accessToken = await getAccessToken();

  // Use the Spotify API to search for tracks with the given name
  const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${songName}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const searchData = await response.json();
  res.json(searchData);
});


// playlist API endpoint to search for a by name
router.get('/api/search-playlists', async (req, res) => {
  const playlistName = req.query.name;
  const accessToken = await getAccessToken();

  // Use the Spotify API to search for playlists with the given name
  const response = await fetch(`https://api.spotify.com/v1/search?q=${playlistName}&type=playlist`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const searchData = await response.json();
  res.json(searchData);
});

router.get("/api/top", async (req,res)=>{
  const accessToken = await getAccessToken();
  const country = req.query.country; 
  const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?country=${country}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const playListData = await response.json();
  res.json(playListData);
})



// Tracks in the playlist
router.get('/api/playlist-tracks/:playlistId', async (req, res) => {
  const playlistId = req.params.playlistId;
  const accessToken = await getAccessToken();

  // Use the Spotify API to get the tracks of the selected playlist
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const playlistTracksData = await response.json();
  res.json(playlistTracksData);
});


module.exports=router;