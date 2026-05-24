import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTrackDetails } from '../../../components/utils/api'
import axios from 'axios';
import {
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
    clearSongSliceRed
} from './songSlice';
import { showErrorToast, showSuccessToast } from "../../../components/utils/toast";
export const fetchLikedSongsThunk = createAsyncThunk(
    "likes/fetchLikedSongs",
    async (userId) => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/liked-songs/${userId}`);
        return response.data.likedSongs;
    }
);


export const fetchTopSongsThunk = createAsyncThunk(
    'songs/fetchTopSongs',
    async () => {
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
    }
);




export const toggleLikeSongThunk = createAsyncThunk(
    'songs/toggleLike',
    async (songId, { rejectWithValue, dispatch }) => {
        try {
            dispatch(toggleLikeSongRed(songId)); // Optimistically update the state
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
            console.error('Error toggling like:', error);
            dispatch(toggleLikeSongRed(songId)); // Rollback optimistic update
            return rejectWithValue(error.message);
        }
    }
);




export const searchSongsAndPlaylistsThunk = createAsyncThunk(
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
            if (!data.songs || !data.playlists) {
                throw new Error('Invalid response format from server');
            }

            const returnData = {
                songs: {
                    ...data.songs,
                    items: data.songs.map(song => ({
                        ...song,
                        isLiked: false, // Initialize like status
                    }))
                },
                playlists: data.playlists
            };

            // Transform data if needed and return
            return returnData;
        } catch (error) {
            console.error('Search error:', error);
            return rejectWithValue(error.message);
        }
    }
);




export const addSongToPlaylistThunk = createAsyncThunk(
    'songs/addSongToPlaylist',
    async ({ playlistId, playlistName, songId }, { dispatch, rejectWithValue, getState }) => {
        dispatch(addSongToPlaylistRed({ playlistId, songId }));
        const state = getState();
        const userId = state.user.user?._id;
        if (!userId) {
            dispatch(removeSongFromPlaylistRed({ playlistId, songId }));
            return rejectWithValue('User not authenticated');
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/addToPlaylist/${playlistName}/${songId}/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to add song to playlist');
            }

            const data = await response.json();
            return data; // Return the updated playlist or relevant data
        } catch (error) {
            dispatch(removeSongFromPlaylistRed({ playlistId, songId }));
            console.error('Error adding song to playlist:', error);
            return rejectWithValue(error.message);
        }
    }
);




export const removeSongFromPlaylistThunk = createAsyncThunk(
    'songs/removeSongFromPlaylist',
    async ({ playlistId, playlistName, songId }, { dispatch, rejectWithValue, getState }) => {
        dispatch(removeSongFromPlaylistRed({ playlistId, songId }));
        try {
            const state = getState();
            const userId = state.user.user._id;
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/removeFromPlaylist/${playlistName}/${songId}/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to remove song from playlist');
            }

            const data = await response.json();
            return data; // Return the updated playlist or relevant data
        } catch (error) {
            dispatch(addSongToPlaylistRed({ playlistId, songId }));
            console.error('Error removing song from playlist:', error);
            return rejectWithValue(error.message);
        }
    }
);



export const createPlaylistThunk = createAsyncThunk(
    'songs/createPlaylist',
    async ({ playlistName, userId, songId = null }, { dispatch, rejectWithValue }) => {
        dispatch(addNewPlaylistRed({ playlistName, songId }));
        try {
            // throw new Error('Failed to create playlist');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/create-playlist/${playlistName}/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to create playlist');
            }
            const data = await response.json();

            if (songId) {
                await dispatch(addSongToPlaylistThunk({ playlistId: data._id, playlistName, songId })).unwrap();
            }

            showSuccessToast(`Playlist "${playlistName}" created successfully!`);


            return data; // Return the created playlist data
        } catch (error) {
            dispatch(removePlaylistRed(playlistName));
            showErrorToast("Failed to create playlist");
            console.error('Error creating playlist:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const deletePlaylistThunk = createAsyncThunk(
    'songs/deletePlaylist',
    async ({ playlistName }, { dispatch, rejectWithValue, getState }) => {
        const state = getState();
        const userId = state.user.user._id;
        dispatch(removePlaylistRed(playlistName));
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delete-playlist/${playlistName}/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete playlist');
            }

            const data = await response.json();
            showSuccessToast(`Playlist "${playlistName}" deleted successfully!`);
            return data; // Return any relevant data if needed
        } catch (error) {
            console.error('Error deleting playlist:', error);
            return rejectWithValue(error.message);
        }
    }
);


export const clearSongSliceThunk = createAsyncThunk(
    'songs/clearSongSlice',
    async (_, { dispatch }) => {
        dispatch(clearSongSliceRed());
    }
);


export const setUserSongsThunk = createAsyncThunk(
    'songs/setUserSongs',
    async ({ likedSongs, userPlaylists }, { dispatch }) => {
        dispatch(setUserSongsRed({ likedSongs, userPlaylists }));
    }
);

export const setSelectedPlaylistThunk = createAsyncThunk(
    'songs/setSelectedPlaylist',
    async ({ id, name }, { dispatch }) => {
        dispatch(setSelectedPlaylistRed({ id, name }));
    }
);

export const setSearchedPlaylistDataThunk = createAsyncThunk(
    'songs/setSearchedPlaylistData',
    async (data, { dispatch }) => {
        dispatch(setSearchedPlaylistDataRed(data));
    }
);

export const setSearchResultsThunk = createAsyncThunk(
    'songs/setSearchResults',
    async (data, { dispatch }) => {
        dispatch(setSearchResultsRed(data));
    }
);
