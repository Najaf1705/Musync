import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const googleLoginThunk = createAsyncThunk(
  "auth/googleLogin",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login/google`,
        loginData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return await response.data;

    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const googleSignupThunk = createAsyncThunk(
  "auth/googleSignup",
  async (signupData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/signup/google`,
        signupData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return await response.data;

    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const normalLoginThunk = createAsyncThunk(
  "auth/normalLogin",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login/normal`,
        loginData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return await response.data;

    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const normalSignupThunk = createAsyncThunk(
  "auth/normalSignup",
  async (signupData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/signup/normal`,
        signupData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return await response.data;

    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const getOtpThunk = createAsyncThunk(
  "auth/getOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/otp`,
        {email},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return await response.data;

    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);