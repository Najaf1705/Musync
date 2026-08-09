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
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/topSongs`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            const trackIds = response.data?.data || [];

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
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/toggle-like/${songId}`,
                { id: songId },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true,
                }
            );

            const data = response.data;
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
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true,
                }
            );

            const data = response.data;
            const songs = Array.isArray(data.songs) ? data.songs : Array.isArray(data.tracks) ? data.tracks : [];
            const playlists = Array.isArray(data.playlists) ? data.playlists : [];

            // Validate response structure
            if (!Array.isArray(songs) || !Array.isArray(playlists)) {
                throw new Error('Invalid response format from server');
            }

            const returnData = {
                songs: {
                    items: songs.map(song => ({
                        ...song,
                        isLiked: false,
                    }))
                },
                playlists,
            };

            return returnData;
        } catch (error) {
            console.error('Search error:', error);
            return rejectWithValue(error.message);
        }
    }
);




export const addSongToPlaylistThunk = createAsyncThunk(
    'songs/addSongToPlaylist',
    async ({ playlistId, playlistName, songId }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/addToPlaylist/${encodeURIComponent(String(playlistName))}/${encodeURIComponent(String(songId))}`,
                undefined,
                { withCredentials: true }
            );

            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed to add song to playlist');
            }

            dispatch(addSongToPlaylistRed({ playlistId, songId }));
            return response.data;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Failed to add song to playlist';
            console.error('Error adding song to playlist:', errorMessage, error);
            return rejectWithValue(errorMessage);
        }
    }
);




export const removeSongFromPlaylistThunk = createAsyncThunk(
    'songs/removeSongFromPlaylist',
    async ({ playlistId, playlistName, songId }, { dispatch, rejectWithValue }) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/removeFromPlaylist/${encodeURIComponent(String(playlistName))}/${encodeURIComponent(String(songId))}`, {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to remove song from playlist');
            }

            const data = await response.json();
            dispatch(removeSongFromPlaylistRed({ playlistId, songId }));
            return data;
        } catch (error) {
            console.error('Error removing song from playlist:', error);
            return rejectWithValue(error.message);
        }
    }
);



export const createPlaylistThunk = createAsyncThunk(
    'songs/createPlaylist',
    async ({ playlistName, songId = null }, { dispatch, rejectWithValue }) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/create-playlist/${encodeURIComponent(String(playlistName))}`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to create playlist');
            }
            const data = await response.json();

            if (songId) {
                await dispatch(addSongToPlaylistThunk({ playlistId: data._id, playlistName, songId })).unwrap();
            }

            dispatch(addNewPlaylistRed({ playlistName: data.playlistName || playlistName, playlistId: data._id, songId }));

            showSuccessToast(`Playlist "${playlistName}" created successfully!`);


            return data; // Return the created playlist data
        } catch (error) {
            showErrorToast("Failed to create playlist");
            console.error('Error creating playlist:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const deletePlaylistThunk = createAsyncThunk(
    'songs/deletePlaylist',
    async ({ playlistName }, { dispatch, rejectWithValue }) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delete-playlist/${encodeURIComponent(String(playlistName))}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete playlist');
            }

            const data = await response.json();
            dispatch(removePlaylistRed(playlistName));
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
