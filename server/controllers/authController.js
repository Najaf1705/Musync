const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');

// Check if user exists by email utility function
const checkUserExistsByEmail = async (email) => {
  if (!email) return false;
  const user = await User.findOne({ email });
  return user;
};

// User existence controller
const userExists = async (req, res) => {
  try {
    const email = req.query?.email;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await checkUserExistsByEmail(email);
    return res.status(200).json({ exists: !!user, message: user ? 'User exists' : 'User does not exist' });
  } catch (error) {
    console.error('Error checking user existence:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




// Login Controller
const login = async (req, res) => {
  try {
    const { email, password = null, type } = req.body;
    console.log("Login request:", { email, password, type });

    if (!email) {
      return res.status(400).json({ error: 'Please provide email' });
    }

    const user = await checkUserExistsByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If not Google login, validate password
    if (type !== 'google') {
      if (!password) {
        return res.status(400).json({ error: 'Please provide password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    // Generate JWT token
    const token = await user.generateAuthToken();

    // Set JWT in cookie
    res.cookie("jtoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Return safe user data
    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        likedSongs: user.likedSongs,
        playlists: user.playlists,
        image: user.image,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// Signup Controller
const signup = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all details' });
    }

    const existingUser = await checkUserExistsByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const newUser = new User({ name, email, password, image });
    await newUser.save();

    const token = await newUser.generateAuthToken();

    res.cookie("jtoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        likedSongs: newUser.likedSongs,
        playlists: newUser.playlists,
        image: newUser.image,
      },
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Logout Controller
const logout = (req, res) => {
  res.clearCookie('jtoken');
  return res.status(200).json({ message: 'Logout successful' });
};

// Profile Controller
const serverProfile = (req, res) => {
  console.log("Fetching user profile");
  res.status(200).json(req.rootuser);
};

module.exports = {
  login,
  signup,
  userExists,
  logout,
  serverProfile,
};