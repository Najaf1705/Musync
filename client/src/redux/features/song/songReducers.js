export const setUserSongsRed = (state, action) => {
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
};


export const setTopSongsRed = (state, action) => {
    state.topSongs = action.payload;
};


export const setSearchResultsRed = (state, action) => {
    state.searchResults = action.payload;
};


export const setSearchedPlaylistDataRed = (state, action) => {
    state.searchedPlaylistData = action.payload;
};


export const setSelectedPlaylistRed = (state, action) => {
    state.selectedPlaylist = action.payload;
};


export const setPlaylistTracksRed = (state, action) => {
    state.playlistTracks = action.payload;
};



export const addSongToPlaylistRed = (state, action) => {
    const { playlistId, songId } = action.payload;
    const playlist = state.userPlaylists.find(playlist => playlist._id === playlistId);
    if (playlist) {
        if (!playlist.songs.includes(songId)) {
            playlist.songs.push(songId);
            return;
        }
    }
};



export const removeSongFromPlaylistRed = (state, action) => {
    const { playlistId, songId: sid } = action.payload;
    const playlist = state.userPlaylists.find(playlist => playlist._id === playlistId);
    if (playlist) {
        if (playlist.songs.includes(sid)) {
            playlist.songs = playlist.songs.filter(songId => songId !== sid);
            return;
        }
    }
};



export const addNewPlaylistRed = (state, action) => {
    const { playlistName, songId = null } = action.payload;
    if (!state.userPlaylists) {
        state.userPlaylists = [];
    }
    state.userPlaylists.push({ playlistName: playlistName, songs: songId ? [songId] : [], _id: Date.now().toString() });
};



export const removePlaylistRed = (state, action) => {
    const playlistName = action.payload;
    state.userPlaylists = state.userPlaylists.filter(playlist => playlist.playlistName !== playlistName);
    // if (state.selectedPlaylist && state.selectedPlaylist.playlistName===playlistName) {
    //   state.selectedPlaylist = null; // Clear selected playlist if it was the one removed
    // }
};



export const setLikedSongsRed = (state, action) => {
    state.likedSongs = action.payload;
    state.userPlaylists.filter((playlist) => {
        if (playlist.playlistName === "Liked Songs") {
            playlist.songs = action.payload;
        }
    })
};



export const toggleLikeSongRed = (state, action) => {
    console.log("Toggling like for song:", action.payload);
    const song = action.payload;
    const exists = state.likedSongs.find(s => s === song);

    if (exists) {
        state.likedSongs = state.likedSongs.filter(s => s !== song);
    } else {
        state.likedSongs.push(song);
    }
    setLikedSongsRed(state, { payload: state.likedSongs }); // Update likedSongs in the state
};



export const clearSongSliceRed = (state) => {
    state.likedSongs = [];
    state.userPlaylists = null;
    // state.topSongs = [];
    // state.searchResults = null;
    // state.searchedPlaylistData = null;
    state.selectedPlaylist = null;
    state.playlistTracks = [];
    state.loading = false;
    state.error = null;
};

