import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const toggleLikeSong = createAsyncThunk(
  'songs/toggleLike',
  async (songId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/toggle-like/${songId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
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

      // console.log('Search results:', data);

      // Transform data if needed and return
      return {
        tracks: {
          ...data.tracks,
          items: data.tracks.items.map(track => ({
            ...track,
            isLiked: false // Initialize like status
          }))
        },
        playlists: data.playlists
      };
    } catch (error) {
      console.error('Search error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const songSlice = createSlice({
  name: 'songs',
  initialState: {
    topSongs: [],
    searchResults: null,
    playlistData: null,
    selectedPlaylist: null,
    playlistTracks: [],
    loading: false,
    error: null,
    cardColors: [],
    cardTextColors: [],
  },
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setPlaylistData: (state, action) => {
      state.playlistData = action.payload;
    },
    setSelectedPlaylist: (state, action) => {
      state.selectedPlaylist = action.payload;
    },
    setPlaylistTracks: (state, action) => {
      state.playlistTracks = action.payload;
    },
    setCardColors: (state, action) => {
      state.cardColors[action.payload.index] = action.payload.color;
    },
    setCardTextColors: (state, action) => {
      state.cardTextColors[action.payload.index] = action.payload.color;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleLikeSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLikeSong.fulfilled, (state, action) => {
        state.loading = false;
        // Update liked status in search results if present
        if (state.searchResults?.tracks?.items) {
          const song = state.searchResults.tracks.items.find(
            item => item.id === action.payload.songId
          );
          if (song) {
            song.isLiked = action.payload.isLiked;
          }
        }
        // Update liked status in playlist tracks if present
        if (state.playlistTracks.length > 0) {
          const song = state.playlistTracks.find(
            item => item.id === action.payload.songId
          );
          if (song) {
            song.isLiked = action.payload.isLiked;
          }
        }
      })
      .addCase(toggleLikeSong.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchSongsAndPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSongsAndPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.tracks;
        state.playlistData = action.payload.playlists;
      })
      .addCase(searchSongsAndPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchResults,
  setPlaylistData,
  setSelectedPlaylist,
  setPlaylistTracks,
  setCardColors,
  setCardTextColors,
} = songSlice.actions;

export default songSlice.reducer;