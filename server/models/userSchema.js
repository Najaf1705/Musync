const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        // required: true,
      }
    }
  ],
  likedSongs: [String],
  playlists: [
    {
      playlistName: {
        type: String,
        required: true,
      },
      songs: [String],
    },
  ],
});

// hashing password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    // Generate JWT token with 1 days expiry
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Initialize tokens array if undefined or not array
    if (!Array.isArray(this.tokens)) {
      this.tokens = [];
    }

    // Optional: Keep only last 4 tokens to limit storage (max 5 tokens)
    if (this.tokens.length >= 5) {
      this.tokens.shift(); // remove oldest token
    }

    // Add the new token
    this.tokens = this.tokens.concat({ token });

    // Save the user document
    await this.save();

    return token;
  } catch (error) {
    console.error("Error generating auth token:", error);
    throw error; // Let caller handle it
  }
};



const User = mongoose.model('USERS', userSchema);
module.exports = User;