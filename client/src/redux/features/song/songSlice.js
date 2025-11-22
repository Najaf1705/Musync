import { createSlice } from '@reduxjs/toolkit';
import { showErrorToast } from '../../../components/utils/toast';
import {
  toggleLikeSongThunk,
  fetchTopSongsThunk,
  searchSongsAndPlaylistsThunk,
  addSongToPlaylistThunk,
  removeSongFromPlaylistThunk,
} from './songThunks';

import {
  setUserSongsRed as _setUserSongsRed,
  setTopSongsRed as _setTopSongsRed,
  setSearchResultsRed as _setSearchResultsRed,
  setSearchedPlaylistDataRed as _setSearchedPlaylistDataRed,
  setSelectedPlaylistRed as _setSelectedPlaylistRed,
  setPlaylistTracksRed as _setPlaylistTracksRed,
  addSongToPlaylistRed as _addSongToPlaylistRed,
  removeSongFromPlaylistRed as _removeSongFromPlaylistRed,
  addNewPlaylistRed as _addNewPlaylistRed,
  removePlaylistRed as _removePlaylistRed,
  setLikedSongsRed as _setLikedSongsRed,
  toggleLikeSongRed as _toggleLikeSongRed,
  clearSongSliceRed as _clearSongSliceRed,
} from './songReducers';

const songSlice = createSlice({
  name: 'songs',
  initialState: {
    likedSongs: [],
    userPlaylists: null,
    topSongs: [],
    topsongsLoading: false,
    searchResults: null,
    searchedPlaylistData: null,
    selectedPlaylist: null,
    playlistTracks: [],
    loading: false,
    error: null,
  },
  reducers: {
    setUserSongsRed: _setUserSongsRed,
    setTopSongsRed: _setTopSongsRed,
    setSearchResultsRed: _setSearchResultsRed,
    setSearchedPlaylistDataRed: _setSearchedPlaylistDataRed,
    setSelectedPlaylistRed: _setSelectedPlaylistRed,
    setPlaylistTracksRed: _setPlaylistTracksRed,
    addSongToPlaylistRed: _addSongToPlaylistRed,
    removeSongFromPlaylistRed: _removeSongFromPlaylistRed,
    addNewPlaylistRed: _addNewPlaylistRed,
    removePlaylistRed: _removePlaylistRed,
    setLikedSongsRed: _setLikedSongsRed,
    toggleLikeSongRed: _toggleLikeSongRed,
    clearSongSliceRed: _clearSongSliceRed,
  },
  extraReducers: (builder) => {
    builder

      // Toggle like
      .addCase(toggleLikeSongThunk.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleLikeSongThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { songId, isLiked } = action.payload;

        if (state.searchResults?.tracks?.items) {
          const song = state.searchResults.tracks.items.find(item => item.id === songId);
          if (song) song.isLiked = isLiked;
        }

        if (state.playlistTracks.length > 0) {
          const song = state.playlistTracks.find(item => item.id === songId);
          if (song) song.isLiked = isLiked;
        }

        const likedPlaylist = state.userPlaylists?.find(p => p.playlistName === "Liked Songs");
        if (!likedPlaylist) return;

        if (isLiked) {
          if (!likedPlaylist.songs.includes(songId)) {
            likedPlaylist.songs.push(songId);
          }
        } else {
          likedPlaylist.songs = likedPlaylist.songs.filter(song => song !== songId);
        }
      })
      .addCase(toggleLikeSongThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search
      .addCase(searchSongsAndPlaylistsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSongsAndPlaylistsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.tracks;
        state.searchedPlaylistData = action.payload.playlists;
      })
      .addCase(searchSongsAndPlaylistsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Top Songs
      .addCase(fetchTopSongsThunk.pending, (state) => {
        state.topsongsLoading = true;
        state.error = null;
      })
      .addCase(fetchTopSongsThunk.fulfilled, (state, action) => {
        state.topsongsLoading = false;
        state.topSongs = action.payload;
      })
      .addCase(fetchTopSongsThunk.rejected, (state, action) => {
        state.topsongsLoading = false;
        state.error = action.error.message;
      })

      // Add Song to Playlist
      .addCase(addSongToPlaylistThunk.rejected, (state) => {
        showErrorToast("Failed to add song to playlist");
        state.error = 'Something went wrong';
      })
      .addCase(addSongToPlaylistThunk.fulfilled, (state) => {
        state.error = null;
      })

      // Remove Song from Playlist
      .addCase(removeSongFromPlaylistThunk.rejected, (state) => {
        showErrorToast("Failed to remove song from playlist");
        state.error = 'Something went wrong';
      })
      .addCase(removeSongFromPlaylistThunk.fulfilled, (state) => {
        state.error = null;
      });
  }
});

export const {
  setUserSongsRed,
  setTopSongsRed,
  setSearchResultsRed,
  setSearchedPlaylistDataRed,
  setSelectedPlaylistRed,
  setPlaylistTracksRed,
  addSongToPlaylistRed,
  removeSongFromPlaylistRed,
  addNewPlaylistRed,
  removePlaylistRed,
  setLikedSongsRed,
  toggleLikeSongRed,
  clearSongSliceRed,
} = songSlice.actions;

export default songSlice.reducer;
