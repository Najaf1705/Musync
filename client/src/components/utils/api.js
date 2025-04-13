export const fetchTrackDetails = async (trackId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/${trackId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });

    if (!response.ok) throw new Error(`Failed to fetch track details for ID: ${trackId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching track details for ID ${trackId}:`, error);
    return null;
  }
};

export const fetchTopSongs = async () => {
  try {
    // First fetch top song IDs
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/topSongs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });

    if (!response.ok) throw new Error("Failed to fetch top songs");
    const { data: trackIds } = await response.json();

    // Then fetch details for each track
    const trackDetailsPromises = trackIds.map(trackId => fetchTrackDetails(trackId));
    const trackDetails = await Promise.all(trackDetailsPromises);

    // Filter out any failed fetches (null values)
    return trackDetails.filter(track => track !== null);
  } catch (error) {
    console.error("Error fetching top songs:", error);
    return [];
  }
};

export const fetchPlaylistTracks = async (playlistId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/playlist-tracks/${playlistId}`);
    if (!response.ok) throw new Error("Failed to fetch playlist tracks");
    return await response.json();
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    return { items: [] };
  }
};

export const searchSongsAndPlaylists = async (songName) => {
  try {
    const songResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search?name=${songName}`);
    const songs = await songResponse.json();

    const playlistsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search-playlists?name=${songName}`);
    const playlists = await playlistsResponse.json();

    return { songs, playlists };
  } catch (error) {
    console.error("Error searching songs and playlists:", error);
    return { songs: null, playlists: null };
  }
};