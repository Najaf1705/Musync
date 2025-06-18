import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTrackDetails } from '../../components/utils/api'
import axios from 'axios';

export const fetchLikedSongs = createAsyncThunk(
  "likes/fetchLikedSongs",
  async (userId) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/liked-songs/${userId}`);
    return response.data.likedSongs;
  }
);

export const fetchTopSongs = createAsyncThunk(
  'songs/fetchTopSongs',
  async () => {
    try {
      console.log("Fetching top songs...");
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
  }
);

export const toggleLikeSong = createAsyncThunk(
  'songs/toggleLike',
  async (songId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/toggle-like/${songId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: songId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      return { songId, isLiked: data.isLiked };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchSongsAndPlaylists = createAsyncThunk(
  'songs/search',
  async (query, { rejectWithValue }) => {
    console.log("Searching dongs and playlists");
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Search failed');
      }

      const data = await response.json();

      // Validate response structure
      if (!data.tracks || !data.playlists) {
        throw new Error('Invalid response format from server');
      }

      console.log('Search results:', data);

      const returnData = {
        tracks: {
          ...data.tracks,
          items: data.tracks.items.map(track => ({
            ...track,
            isLiked: false // Initialize like status
          }))
        },
        playlists: data.playlists
      };

      console.log('Transformed search results:', returnData);

      // Transform data if needed and return
      return returnData;
    } catch (error) {
      console.error('Search error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const songSlice = createSlice({
  name: 'songs',
  initialState: {
    likedSongs: [],
    userPlaylists: null,
    topSongs: [],
    searchResults: null,
    searchedPlaylistData: null,
    selectedPlaylist: null,
    playlistTracks: [],
    loading: false,
    error: null,
  },
  reducers: {
    setUserSongs: (state, action) => {
      const { likedSongs, userPlaylists } = action.payload;
      state.likedSongs = likedSongs || [];
      state.userPlaylists = [
        {
          playlistName: "Liked Songs",
          songs: state.likedSongs,
          _id: "likedSongs",
        },
        ...(userPlaylists || [])
      ];
    },
    setTopSongs: (state, action) => {
      state.topSongs = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSearchedPlaylistData: (state, action) => {
      state.searchedPlaylistData = action.payload;
    },
    setSelectedPlaylist: (state, action) => {
      state.selectedPlaylist = action.payload;
    },
    setPlaylistTracks: (state, action) => {
      state.playlistTracks = action.payload;
    },
    setLikedSongs: (state, action) => {
      state.likedSongs = action.payload;
      state.userPlaylists.filter((playlist)=>{
        if(playlist.playlistName === "Liked Songs"){
          playlist.songs = action.payload;
        }
      })
    },

    toggleLikeSongReducer: (state, action) => {
      const song = action.payload;
      const exists = state.likedSongs.find(s => s === song);

      if (exists) {
        state.likedSongs = state.likedSongs.filter(s => s !== song);
      } else {
        state.likedSongs.push(song);
      }
      setLikedSongs(state, { payload: state.likedSongs }); // Update likedSongs in the state
    },
    clearSongSlice: (state) => {
      state.likedSongs= [];
      state.userPlaylists= null;
      state.topSongs= [];
      state.searchResults= null;
      state.searchedPlaylistData= null;
      state.selectedPlaylist= null;
      state.playlistTracks= [];
      state.loading= false;
      state.error= null;
    },
  },

  extraReducers: (builder) => {
    builder

      // toggle like cases 
      .addCase(toggleLikeSong.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleLikeSong.fulfilled, (state, action) => {
        state.loading = false;
        const { songId, isLiked } = action.payload;

        // Update liked status in search results if present
        if (state.searchResults?.tracks?.items) {
          const song = state.searchResults.tracks.items.find(
            item => item.id === songId
          );
          if (song) {
            song.isLiked = isLiked;
          }
        }
        // Update liked status in playlist tracks if present
        if (state.playlistTracks.length > 0) {
          const song = state.playlistTracks.find(
            item => item.id === songId
          );
          if (song) {
            song.isLiked = isLiked;
          }
        }

        // Update likedSongs array in userPlaylists
        if (isLiked) {
          // Add to likedSongs if not already present
          if (!state.userPlaylists
            .find(playlist=>playlist.playlistName === "Liked Songs")
            .songs.includes(songId)) {
            state.userPlaylists
              .find(playlist => playlist.playlistName === "Liked Songs")
              .songs.push(songId);
          }
        } else {
          // Remove from likedSongs if present
          state.userPlaylists
            .find(playlist => playlist.playlistName === "Liked Songs")
            .songs = state.userPlaylists
              .find(playlist => playlist.playlistName === "Liked Songs")
              .songs.filter(song => song !== songId);
        }
      })
      .addCase(toggleLikeSong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // search cases
      .addCase(searchSongsAndPlaylists.pending, (state) => {
        console.log("searchSongsAndPlaylists.pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSongsAndPlaylists.fulfilled, (state, action) => {
        console.log("searchSongsAndPlaylists.fulfilled");
        state.loading = false;
        state.searchResults = action.payload.tracks;
        state.searchedPlaylistData = action.payload.playlists;
      })
      .addCase(searchSongsAndPlaylists.rejected, (state, action) => {
        console.log("searchSongsAndPlaylists.rejected");
        state.loading = false;
        state.error = action.payload;
      })

      // top songs cases
      .addCase(fetchTopSongs.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTopSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Set error message
      })
      .addCase(fetchTopSongs.fulfilled, (state, action) => {
        state.topSongs = action.payload; // Set resolved data
      })
  }
});

export const {
  setUserSongs,
  setLikedSongs,
  setUserPlaylists,
  toggleLikeSongReducer,
  clearSongSlice,
  setTopSongs,
  setSearchResults,
  setSearchedPlaylistData,
  setSelectedPlaylist,
  setPlaylistTracks,
} = songSlice.actions;

export default songSlice.reducer;