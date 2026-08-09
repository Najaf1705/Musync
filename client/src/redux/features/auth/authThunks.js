import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUserSongsRed } from "../song/songSlice";

const normalizeError = (error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data || error.message;
  }

  return error instanceof Error ? error.message : String(error);
};

const getAuthBase = () => process.env.REACT_APP_AUTH_URL || "https://nauth.najaf.in";
const getBackendBase = () => process.env.REACT_APP_BACKEND_URL || "https://bknd.musync.najaf.in";

const getCurrentUserAuthData = async () => {
  const AUTH_BASE = getAuthBase();
  const res = await axios.get(`${AUTH_BASE}/me`, { withCredentials: true });

  return res.data;
};

const getCurrentUserData = async (dispatch) => {
  try {
    const BACKEND_BASE = getBackendBase();
    const res = await axios.get(`${BACKEND_BASE}/api/user`, { withCredentials: true });
    const userData = res.data;

    // Update song slice (liked songs and playlists) if present
    if (userData) {
      dispatch(
        setUserSongsRed({
          likedSongs: userData.likedSongs || [],
          userPlaylists: userData.playlists || [],
        })
      );
    }

    // Dispatch an action to update the auth slice with the fetched user data
    dispatch({ type: "auth/setUser", payload: userData });
  } catch (error) {
    // return thunkAPI.rejectWithValue(normalizeError(error));
    console.error("Error fetching current user data:", error);
  }
};

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const user = await getCurrentUserAuthData();
      await getCurrentUserData(thunkAPI.dispatch).catch(() => undefined);
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, thunkAPI) => {
    try {
      const AUTH_BASE = getAuthBase();
      const res = await axios.post(
        `${AUTH_BASE}/login`,
        {
          email: payload.email,
          password: payload.password,
          otpId: payload.otpId,
          otp: payload.otp,
          loginMode: payload.loginMode,
        },
        { withCredentials: true }
      );

      const data = res.data ?? {};
      if (data?.code === "EMAIL_VERIFICATION_REQUIRED" || data?.otpId) {
        return {
          requiresOtp: true,
          otpId: data?.otpId,
          loginMode: payload.loginMode,
        };
      }

      const user = await getCurrentUserAuthData();
      // await fetchUserLinksWithRetry(thunkAPI.dispatch).catch(() => undefined);
      return { user };
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (payload, thunkAPI) => {
    try {
      const AUTH_BASE = getAuthBase();
      const res = await axios.post(
        `${AUTH_BASE}/signup`,
        {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          otpId: payload.otpId,
          otp: payload.otp,
        },
        { withCredentials: true }
      );

      const data = res.data ?? {};
      if (data?.code === "EMAIL_VERIFICATION_REQUIRED" || data?.otpId) {
        return {
          requiresOtp: true,
          otpId: data?.otpId,
        };
      }

      const user = await getCurrentUserAuthData();
      // await fetchUserLinksWithRetry(thunkAPI.dispatch).catch(() => undefined);
      return { user };
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const AUTH_BASE = getAuthBase();
      await axios.post(`${AUTH_BASE}/logout`, {}, { withCredentials: true });
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);


export const authenticateWithGoogle = createAsyncThunk(
  "auth/authenticateWithGoogle",
  async ({ idToken, password }, thunkAPI) => {
    try {
      const AUTH_BASE = getAuthBase();
      const res = await axios.post(
        `${AUTH_BASE}/google`,
        { idToken, password },
        { withCredentials: true, validateStatus: (status) => status < 500 }
      );


      console.log("Google authentication response:", res);

      if (res.status === 202 || res.data?.status === "INCOMPLETE_SIGNUP") {
        return {
          requiresPassword: true,
          email: res.data?.email,
          status: res.data?.status,
        };
      }

      if (res.status === 200) {
        const user = await getCurrentUserAuthData();
        return { user };
      }

      return thunkAPI.rejectWithValue(res.data?.message || "Google authentication failed");
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);
