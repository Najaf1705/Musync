const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

// Email Registration
const serverRegister = async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  if (!name || !email || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill all fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "User already exists" });
    }

    const user = new User({ name, email, password, cpassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Google Registration
const googleServerRegister = async (req, res) => {
  const { email, name, image } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(422).json({ error: 'User already registered with Google' });
    }

    const newUser = new User({ email, name, image });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Email Login
const serverLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email: email });

    if (userExists) {
      const passmatch = await bcrypt.compare(password, userExists.password);

      if (!passmatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = await userExists.generateAuthToken();
      console.log("Generated Token:", token);

      res.cookie("jtoken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      });

      return res.status(200).json({ message: "Logged in successfully" });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Google Login
const googleServerLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      const token = await userExists.generateAuthToken();
      // console.log("Generated Token:", token);

      res.cookie("jtoken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      });

      // In your login/token generation code
      // console.log('User ID before token generation:', userExists._id.toString());
      // console.log('Generated token payload:', { _id: userExists._id.toString() });

      return res.status(200).json({ message: "Logged in successfully" });
    } else {
      return res.status(401).json({ error: "User doesn't exist! Try registering" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie('jtoken');
  return res.status(200).json({ message: 'Logout successful' });
};

// Profile Endpoint
const serverProfile = (req, res) => {
  res.status(200).json(req.rootuser);
};

module.exports = {
  serverRegister,
  googleServerRegister,
  serverLogin,
  googleServerLogin,
  logout,
  serverProfile,
};