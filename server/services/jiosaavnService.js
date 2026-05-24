const BASE_URL = 'https://saavn.sumit.co/api';

// Search for songs and playlists
const searchSongs = async (query, page = 0, limit = 20) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching songs:', error);
    throw error;
  }
};

// Search for playlists
const searchPlaylists = async (query, page = 0, limit = 10) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/playlists?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching playlists:', error);
    throw error;
  }
};

// Get song details by song ID
const getSongDetails = async (songId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/songs?id=${encodeURIComponent(songId)}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching song details:', error);
    throw error;
  }
};

// Get playlist details and tracks
const getPlaylistDetails = async (playlistId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/playlists?id=${encodeURIComponent(playlistId)}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching playlist details:', error);
    throw error;
  }
};

// Get album details
const getAlbumDetails = async (albumId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/albums?id=${encodeURIComponent(albumId)}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching album details:', error);
    throw error;
  }
};

// Get artist details
const getArtistDetails = async (artistId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/artists?id=${encodeURIComponent(artistId)}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artist details:', error);
    throw error;
  }
};

// Get trending songs
const getTrendingSongs = async (page = 0, limit = 20) => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trending songs:', error);
    throw error;
  }
};

module.exports = {
  searchSongs,
  searchPlaylists,
  getSongDetails,
  getPlaylistDetails,
  getAlbumDetails,
  getArtistDetails,
  getTrendingSongs,
};
