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
  setUserSongs as _setUserSongsRed,
  setTopSongs as _setTopSongsRed,
  setSearchResults as _setSearchResultsRed,
  setSearchedPlaylistData as _setSearchedPlaylistDataRed,
  setSelectedPlaylist as _setSelectedPlaylistRed,
  setPlaylistTracks as _setPlaylistTracksRed,
  addSongToPlaylist as _addSongToPlaylistRed,
  removeSongFromPlaylist as _removeSongFromPlaylistRed,
  addNewPlaylist as _addNewPlaylistRed,
  removePlaylist as _removePlaylistRed,
  setLikedSongs as _setLikedSongsRed,
  toggleLikeSong as _toggleLikeSongRed,
  clearSongSlice as _clearSongSliceRed,
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

        if (state.searchResults?.items) {
          const song = state.searchResults.items.find(item => item.id === songId);
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
        state.searchResults = action.payload.songs;
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
      .addCase(addSongToPlaylistThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSongToPlaylistThunk.rejected, (state) => {
        state.loading = false;
        showErrorToast("Failed to add song to playlist");
        state.error = 'Something went wrong';
      })
      .addCase(addSongToPlaylistThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      // Remove Song from Playlist
      .addCase(removeSongFromPlaylistThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSongFromPlaylistThunk.rejected, (state) => {
        state.loading = false;
        showErrorToast("Failed to remove song from playlist");
        state.error = 'Something went wrong';
      })
      .addCase(removeSongFromPlaylistThunk.fulfilled, (state) => {
        state.loading = false;
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
