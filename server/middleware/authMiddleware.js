const jwt = require("jsonwebtoken");
const User = require('../models/userSchema');
const mongoose = require('mongoose');

const authenticate = async (req, res, next) => {
  try {
    console.log('Authentication middleware triggered');
    const token = req.cookies.jtoken;
    if (!token) {
      return res.status(401).json({ error: "Authentication required - no token found" });
    }

    // Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Add debug logging
    console.log('Decoded token _id:', decoded._id);
    
    // Validate MongoDB ID format (24 chars hexadecimal)
    if (!decoded._id || !/^[0-9a-fA-F]{24}$/.test(decoded._id)) {
      return res.status(400).json({ error: "Invalid MongoDB ID format" });
    }

    // Try to create ObjectId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(decoded._id);
    } catch (err) {
      console.log('ObjectId creation error:', err);
      return res.status(400).json({ error: "Invalid MongoDB ID format" });
    }

    const rootuser = await User.findOne({
      _id: objectId,  // Use the validated ObjectId
      "tokens.token": token
    });

    if (!rootuser) {
      return res.status(401).json({ error: "User not found or invalid token" });
    }

    // Add user context to request
    req.token = token;
    req.rootuser = rootuser;
    req.userID = rootuser._id;
    next();

  } catch (error) {
    console.log('Auth Error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token format" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token has expired" });
    }
    res.status(401).json({ error: "Authentication failed" });
  }
}

module.exports = authenticate;