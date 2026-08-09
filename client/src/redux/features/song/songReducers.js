export const setUserSongs = (state, action) => {
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


export const setTopSongs = (state, action) => {
    state.topSongs = action.payload;
};


export const setSearchResults = (state, action) => {
    state.searchResults = action.payload;
};


export const setSearchedPlaylistData = (state, action) => {
    state.searchedPlaylistData = action.payload;
};


export const setSelectedPlaylist = (state, action) => {
    state.selectedPlaylist = action.payload;
};


export const setPlaylistTracks = (state, action) => {
    state.playlistTracks = action.payload;
};



export const addSongToPlaylist = (state, action) => {
    if (!state.userPlaylists) return;
    const { playlistId, songId } = action.payload;
    const playlist = state.userPlaylists.find(playlist => playlist._id === playlistId);
    if (playlist && !playlist.songs.includes(songId)) {
        playlist.songs.push(songId);
    }
};



export const removeSongFromPlaylist = (state, action) => {
    if (!state.userPlaylists) return;
    const { playlistId, songId: sid } = action.payload;
    const playlist = state.userPlaylists.find(playlist => playlist._id === playlistId);
    if (playlist && playlist.songs.includes(sid)) {
        playlist.songs = playlist.songs.filter(songId => songId !== sid);
    }
};



export const addNewPlaylist = (state, action) => {
    const { playlistName, songId = null, playlistId } = action.payload;
    if (!state.userPlaylists) {
        state.userPlaylists = [];
    }
    state.userPlaylists.push({
        playlistName,
        songs: songId ? [songId] : [],
        _id: playlistId || Date.now().toString(),
    });
};



export const removePlaylist = (state, action) => {
    const playlistName = action.payload;
    state.userPlaylists = state.userPlaylists.filter(playlist => playlist.playlistName !== playlistName);
    // if (state.selectedPlaylist && state.selectedPlaylist.playlistName===playlistName) {
    //   state.selectedPlaylist = null; // Clear selected playlist if it was the one removed
    // }
};



export const setLikedSongs = (state, action) => {
    state.likedSongs = action.payload || [];
    if (!state.userPlaylists) return;

    const likedPlaylist = state.userPlaylists.find((playlist) => playlist.playlistName === "Liked Songs");
    if (likedPlaylist) {
        likedPlaylist.songs = state.likedSongs;
    }
};



export const toggleLikeSong = (state, action) => {
    const song = action.payload;
    const exists = state.likedSongs.includes(song);

    state.likedSongs = exists
        ? state.likedSongs.filter((s) => s !== song)
        : [...state.likedSongs, song];

    if (!state.userPlaylists) return;

    const likedPlaylist = state.userPlaylists.find((playlist) => playlist.playlistName === "Liked Songs");
    if (likedPlaylist) {
        likedPlaylist.songs = state.likedSongs;
    }
};



export const clearSongSlice = (state) => {
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
