import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice'; // Import the userSlice reducer
import songReducer from './features/song/songSlice'; // Import the songSlice reducer
import downloadReducer from './features/downloadSlice'; // Import the downloadSlice reducer


const store = configureStore({
    reducer: {
        user: userReducer,
        songs: songReducer,
        download: downloadReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;