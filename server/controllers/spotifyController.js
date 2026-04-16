const dotenv = require('dotenv');
const { transformSong, transformPlaylist } = require('../transformers');
dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const SAAVN_API_BASE = 'https://saavn.sumit.co/api';

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
  return data.access_token;
};

// Search for a song by name
const searchSong = async (req, res) => {
  const songName = req.query.name;
  const accessToken = await getAccessToken();

  try {
    const response = await fetch(`https://saavn.sumit.co/api/search?query=${songName}`, {
      headers: {
        // 'Authorization': `Bearer ${accessToken}`,
      },
    });

    const searchData = await response.json();
    console.log(searchData);
    res.json(searchData);
  } catch (error) {
    console.error('Error searching for song:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search for playlists by name
const searchPlaylists = async (req, res) => {
  const playlistName = req.query.name;
  const accessToken = await getAccessToken();

  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${playlistName}&type=playlist`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const searchData = await response.json();
    res.json(searchData);
  } catch (error) {
    console.error('Error searching for playlists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get featured playlists by country
const getTopPlaylists = async (req, res) => {
  const country = req.query.country;
  const accessToken = await getAccessToken();

  try {
    const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?country=${country}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const playListData = await response.json();
    res.json(playListData);
  } catch (error) {
    console.error('Error fetching top playlists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get tracks in a playlist
const getPlaylistTracks = async (req, res) => {
  const playlistId = req.params.playlistId;
  // const accessToken = await getAccessToken();

  try {
    const response = await fetch(`https://saavn.sumit.co/api/playlists?id=${playlistId}`, {
      headers: {
        // 'Authorization': `Bearer ${accessToken}`,
      },
    });

    const playlistData = await response.json();
    // console.log("pd", playlistData)
    res.json(transformPlaylist(playlistData.data));
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get track info by track ID
const getTrackInfo = async (req, res) => {
  const trackId = req.params.track_info;

  try {
    // const accessToken = await getAccessToken();
    // console.log("TOKEN:", accessToken);

    const response = await fetch(`https://saavn.sumit.co/api/songs?ids=${trackId}`, {
      headers: {
        // Authorization: `Bearer ${accessToken}`,
      },
    });

    
    const trackInfo=await response.json();
    console.log("trackinfo", trackInfo)
    res.json(transformSong(trackInfo.data[0]));

  } catch (error) {
    console.error('Error fetching track info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Combined search for songs and playlists
const searchSongsAndPlaylists = async (req, res) => {
  const query = req.query.q;
  const accessToken = await getAccessToken();

  try {
    // Search for both tracks and playlists in parallel
    const [tracksResponse, playlistsMetadataResponse] = await Promise.all([
      fetch(`https://saavn.sumit.co/api/search/songs?query=${query}&page=0&limit=200`, {
        headers: {
          // 'Authorization': `Bearer ${accessToken}`,
        },
      }),
      fetch(`https://saavn.sumit.co/api/search/playlists?query=${query}&page=0&limit=10`, {
        headers: {
          // 'Authorization': `Bearer ${accessToken}`,
        },
      })
    ]);

    if (!tracksResponse.ok || !playlistsMetadataResponse.ok) {
      throw new Error('Failed to fetch search results');
    }

    const [tracksData, playlistsMetadata] = await Promise.all([
      tracksResponse.json(),
      playlistsMetadataResponse.json()
    ]);

    


    // Combine and send both results
    res.json({
      tracks: tracksData.data.results.map((track)=>transformSong(track)),
      playlists: playlistsMetadata.data.results.map(({image, ...playlist})=>({...playlist, images: image}))
    });


  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search songs and playlists' });
  }
};

// Export all functions
module.exports = {
  searchSong,
  searchPlaylists,
  getTopPlaylists,
  getPlaylistTracks,
  getTrackInfo,
  searchSongsAndPlaylists,
};