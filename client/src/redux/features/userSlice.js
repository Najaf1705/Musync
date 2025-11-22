import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,             // Holds user object
  isLoggedIn: false,  
  isAuthReady: false,    // Tracks login status
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("Setting user in slice:", action.payload);
      state.user = action.payload;
      state.isLoggedIn = true; // ✅ Automatically mark as logged in
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false; // ✅ Mark as logged out
    },
    // Optional separate login/logout toggles
    setLoggedIn: (state) => {
      state.isLoggedIn = true;
    },
    setLoggedOut: (state) => {
      state.isLoggedIn = false;
    },
    setAuthReady: (state,action) => {
      state.isAuthReady = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoggedIn, setLoggedOut, setAuthReady } = userSlice.actions;
export default userSlice.reducer;