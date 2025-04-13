import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch user details from the database
export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/serverprofile`, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing authentication cookie');
        }
        if (response.status === 400) {
          throw new Error('Invalid request: Check token or user ID');
        }
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  userDetails: null, // Stores user details if logged in
  isLoggedIn: false, // Tracks login status
  loading: false, // Tracks loading state
  error: null, // Stores error messages
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails(state, action) {
      state.userDetails = action.payload;
      state.isLoggedIn = true; // Set login status to true when user details are set
    },
    clearUserDetails(state) {
      state.userDetails = null;
      state.isLoggedIn = false; // Set login status to false when user details are cleared
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
        state.isLoggedIn = true; // Set login status to true when fetch is successful
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false; // Set login status to false if fetch fails
      });
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;