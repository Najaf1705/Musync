const authService = require('../services/authService');

// utils/setAuthCookie.js
const setAuthCookie = (res, token, options = {}) => {
  const isProd = process.env.NODE_ENV === "production";

  const defaultOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/",
  };

  res.cookie(
    options.name || "jtoken",
    token,
    { ...defaultOptions, ...options }
  );
};


// User existence controller
const userExists = async (req, res) => {
  try {
    const email = req.query?.email;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const exists = await authService.getUserByEmail(email);
    return res.status(200).json({ exists, message: exists ? 'User exists' : 'User does not exist' });
  } catch (error) {
    console.error('Error checking user existence:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const googleLogin = async (req, res) => {
  try {
    const { token, password=null } = req.body;
    // if(!token)throw { status: 400, message: "Token is required" };
    // const googleUserDetails=await authService.getGoogleUserDetails(token);

    // const user=await authService.getUserByEmail(googleUserDetails.email)

    const user = await authService.googleSignup(token, password);

    const authToken = await user.generateAuthToken();
    setAuthCookie(res, authToken);

    return res.status(200).json({
      message: "Logged in successfully",
      user: authService.formatUserResponse(user),
    });
  } catch (error) {
    console.error('Google login error:', error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Server Error' });
  }
};

const googleSignup = async (req, res) => {
  try {
    const { name, email, image = null } = req.body;

    const newUser = await authService.googleSignup(name, email, image);

    const token = await newUser.generateAuthToken();
    setAuthCookie(res, token);

    return res.status(201).json({
      message: "User registered successfully",
      user: authService.formatUserResponse(newUser),
    });
  } catch (error) {
    console.error('Google signup error:', error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Server Error' });
  }
};


// Login Controller
const normalLogin = async (req, res) => {
  try {
    const { email, password = null, otp = null, otpId = null, type = null } = req.body;

    console.log("Login request:", { email, type });

    if (!email || !type) {
      return res.status(400).json({
        error: "Please provide email and login type"
      });
    }

    let user;

    if (type === "password") {
      user = await authService.loginWithPassword(email, password);
    } else if (type === "otp") {
      user = await authService.loginWithOtp(email, otp, otpId);
    } else {
      return res.status(400).json({
        error: "Invalid login type"
      });
    }

    const token = await user.generateAuthToken();
    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Logged in successfully",
      user: authService.formatUserResponse(user),
    });

  } catch (error) {
    console.error("Login error:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Server Error"
    });
  }
};
// Signup Controller
const normalSignup = async (req, res) => {
  try {
    const { name, email, password, image = null, otp = null, otpId = null } = req.body;

    const result = await authService.signup(name, email, password, image, otpId, otp);

    if (result && result.status === 'otp_required') {
      return res.status(200).json(result);
    }

    const token = await result.generateAuthToken();
    setAuthCookie(res, token);

    return res.status(201).json({
      message: "User registered successfully",
      user: authService.formatUserResponse(result),
    });

  } catch (error) {
    console.error('Signup error:', error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Internal server error' });
  }
};


const createUser = async (req, res) => {
  try {
    const authenticatedUser = req.rootuser;
    if (!authenticatedUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = authenticatedUser.userId; // Assuming userId is a property of the authenticated user

    const result = await authService.createNewUser(userId);

    return res.status(201).json({
      message: "User created successfully",
      user: authService.formatUserResponse(result),
    });

  } catch (error) {
    console.error('Create user error:', error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Internal server error' });
  }
};


const generateOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await authService.generateOtp(email);

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message || "Failed to send OTP"
    });
  }
};
const validateOtp = async (req, res) => {
  try {
    const { otpId, otp } = req.body;

    const result = await authService.validateOtpCode(otpId, otp);

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message || "Failed to verify OTP",
    });
  }
};


// Logout Controller
const logout = (req, res) => {
  res.clearCookie('jtoken');
  return res.status(200).json({ message: 'Logout successful' });
};

// Profile Controller
const serverProfile = async (req, res) => {
  try {
    console.log("Fetching user profile");

    let user = req.rootuser;
    if (!user) {
      // const fallbackEmail = req.email || `user-${Date.now()}@example.com`;
      user = await authService.createNewUser(user.email);
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Profile error:", error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  normalLogin,
  googleLogin,
  googleSignup,
  normalSignup,
  generateOtp,
  validateOtp,
  userExists,
  logout,
  serverProfile,
  createUser,
};