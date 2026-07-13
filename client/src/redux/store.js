import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice'; // Import the authSlice reducer
import songReducer from './features/song/songSlice'; // Import the songSlice reducer
import downloadReducer from './features/downloadSlice'; // Import the downloadSlice reducer


const store = configureStore({
    reducer: {
        auth: authReducer,
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