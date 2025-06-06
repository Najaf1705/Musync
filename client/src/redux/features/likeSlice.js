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
      state.likedSongs=action.payload;
    },

    toggleLikeSong: (state, action) => {
      const song = action.payload;
      const exists = state.likedSongs.find(s => s === song);

      if (exists) {
        state.likedSongs = state.likedSongs.filter(s => s !== song);
      } else {
        state.likedSongs.push(song);
      }
    },

    clearLikeData: (state) => {
      state.likedSongs = [];
      state.likedSongsId = [];
      state.likedPlaylists = [];
    },
  },
});

export const { setLikedSongs, setLikedSongsIds, toggleLikeSong, clearLikeData } = likeSlice.actions;
export default likeSlice.reducer;