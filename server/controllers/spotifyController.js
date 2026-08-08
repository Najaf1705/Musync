const dotenv = require('dotenv');
dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const normalizeSpotifyTrack = (track) => ({
  id: track?.id,
  songName: track?.name,
  name: track?.name,
  image: track?.album?.images?.[0]?.url || track?.images?.[0]?.url || '',
  album: track?.album || { name: 'Unknown Album' },
  artists: track?.artists?.length
    ? { primaryArtist: track.artists.map((artist) => ({ name: artist.name, id: artist.id })) }
    : { primaryArtist: [{ name: 'Unknown Artist', id: null }] },
  duration: track?.duration_ms,
  uri: track?.uri,
  externalUrl: track?.external_urls?.spotify,
});

const normalizeSpotifyPlaylist = (playlist) => ({
  id: playlist?.id,
  playlistName: playlist?.name,
  name: playlist?.name,
  image: playlist?.images?.[0]?.url || '',
  images: playlist?.images || [],
  owner: playlist?.owner,
  tracks: playlist?.tracks,
  externalUrl: playlist?.external_urls?.spotify,
});

const getAccessToken = async () => {
  const base64data = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64data}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify access token');
  }

  const data = await response.json();
  return data.access_token;
};

const spotifyFetch = async (url, accessToken) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API request failed with status ${response.status}`);
  }

  return response.json();
};

const searchSongs = async (req, res) => {
  const query = req.query.q || req.query.name;

  try {
    const accessToken = await getAccessToken();
    const data = await spotifyFetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
      accessToken
    );

    const songs = (data.tracks?.items || []).map(normalizeSpotifyTrack);
    res.json(songs);
  } catch (error) {
    console.error('Error searching for songs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchSong = searchSongs;

const searchPlaylists = async (req, res) => {
  const query = req.query.q || req.query.name;

  try {
    const accessToken = await getAccessToken();
    const data = await spotifyFetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=10`,
      accessToken
    );

    const playlists = (data.playlists?.items || []).map(normalizeSpotifyPlaylist);
    res.json(playlists);
  } catch (error) {
    console.error('Error searching for playlists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTopPlaylists = async (req, res) => {
  const country = req.query.country || 'US';

  try {
    const accessToken = await getAccessToken();
    const data = await spotifyFetch(
      `https://api.spotify.com/v1/browse/featured-playlists?country=${encodeURIComponent(country)}`,
      accessToken
    );

    res.json(data.playlists || data);
  } catch (error) {
    console.error('Error fetching top playlists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPlaylistTracks = async (req, res) => {
  const playlistId = req.params.playlistId || req.params.id;

  try {
    const accessToken = await getAccessToken();
    const data = await spotifyFetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`,
      accessToken
    );

    res.json(data);
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPlaylistDetails = async (req, res) => {
  const playlistId = req.params.id;

  try {
    const accessToken = await getAccessToken();
    const data = await spotifyFetch(`https://api.spotify.com/v1/playlists/${playlistId}`, accessToken);
    res.json(data);
  } catch (error) {
    console.error('Error fetching playlist details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTrackInfo = async (req, res) => {
  const trackId = req.params.id || req.params.track_info;

  try {
    const accessToken = await getAccessToken();
    const data = await spotifyFetch(`https://api.spotify.com/v1/tracks/${trackId}`, accessToken);
    res.json(normalizeSpotifyTrack(data));
  } catch (error) {
    console.error('Error fetching track info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchSongsAndPlaylists = async (req, res) => {
  const query = req.query.q || req.query.name;

  try {
    const accessToken = await getAccessToken();
    const [tracksData, playlistsData] = await Promise.all([
      spotifyFetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
        accessToken
      ),
      spotifyFetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=10`,
        accessToken
      ),
    ]);

    res.json({
      songs: (tracksData.tracks?.items || []).map(normalizeSpotifyTrack),
      playlists: (playlistsData.playlists?.items || []).map(normalizeSpotifyPlaylist),
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search songs and playlists' });
  }
};

const searchAll = searchSongsAndPlaylists;
const getSongDetails = getTrackInfo;
const getTrendingSongs = getTopPlaylists;

module.exports = {
  searchSong,
  searchSongs,
  searchPlaylists,
  getTopPlaylists,
  getPlaylistTracks,
  getTrackInfo,
  getSongDetails,
  getPlaylistDetails,
  getTrendingSongs,
  searchSongsAndPlaylists,
  searchAll,
};