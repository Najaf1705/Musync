import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice'; // Import the userSlice reducer
import songReducer from './features/songSlice';


const store = configureStore({
    reducer: {
        user: userReducer, // Add the user reducer
        songs: songReducer, // Add the user reducer
    },
});

export default store;