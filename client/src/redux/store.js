import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice'; // Import the userSlice reducer
import songReducer from './features/song/songSlice'; // Import the songSlice reducer
import downloadReducer from './features/downloadSlice'; // Import the downloadSlice reducer


const store = configureStore({
    reducer: {
        user: userReducer, // Add the user reducer
        songs: songReducer, // Add the user reducer
        download: downloadReducer, // Import the downloadSlice reducer
    },
});

export default store;