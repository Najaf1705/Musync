import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice'; // Import the userSlice reducer
import songReducer from './features/songSlice';
import likeReducer from './features/likeSlice'; // Import the likeSlice reducer


const store = configureStore({
    reducer: {
        user: userReducer, // Add the user reducer
        songs: songReducer, // Add the user reducer
        likes: likeReducer, // Add the like reducer
    },
});

export default store;