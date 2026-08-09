export const fetchTrackDetails = async (trackId) => {
  const normalizedTrackId = typeof trackId === 'string' ? trackId.trim() : trackId;

  if (!normalizedTrackId || normalizedTrackId === 'null' || normalizedTrackId === 'undefined') {
    return null;
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trackInfo/${encodeURIComponent(normalizedTrackId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });

    if (!response.ok) throw new Error(`Failed to fetch track details for ID: ${normalizedTrackId}`);
    const trackDetails = await response.json();
    return trackDetails;
  } catch (error) {
    console.error(`Error fetching track details for ID ${normalizedTrackId}:`, error);
    return null;
  }
};

export const fetchTopSongs = async () => {
  try {
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
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search?q=${encodeURIComponent(songName)}`);
    const data = await response.json();

    const songs = data.songs ?? data.tracks ?? [];
    const playlists = data.playlists ?? [];

    return { songs, playlists };
  } catch (error) {
    console.error("Error searching songs and playlists:", error);
    return { songs: [], playlists: [] };
  }
};