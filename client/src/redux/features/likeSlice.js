import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch liked songs
export const fetchLikedSongs = createAsyncThunk(
  "likes/fetchLikedSongs",
  async (userId) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/liked-songs/${userId}`);
    return response.data.likedSongs;
  }
);

const likeSlice = createSlice({
  name: "likes",
  initialState: {
    likedSongsId: [],
    likedSongs: [],
    likedPlaylists: [],
    status: "idle", // for loading state
    error: null,
  },
  reducers: {
    setLikedSongsIds: (state, action) => {
      state.likedSongsId = action.payload;
    },
    setLikedSongs: (state, action) => {
      state.likedSongs = action.payload.map(song => ({
        ...song,
        isLiked: true,
      }));
    },
    toggleLikeSong: (state, action) => {
      const song = action.payload;
      const exists = state.likedSongsId.find(s => s === song);

      if (exists) {
        state.likedSongsId = state.user.likedSongs.filter(s => s !== song);
      } else {
        state.likedSongsId.push(song);
      }
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikedSongs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLikedSongs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.likedSongs = action.payload.map((song) => ({
          ...song,
          isLiked: true // Mark all fetched songs as liked
        }))
        console.log("Fetched liked songs:", action.payload);
      })
      .addCase(fetchLikedSongs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setLikedSongs, setLikedSongsIds, toggleLikeSong } = likeSlice.actions;
export default likeSlice.reducer;