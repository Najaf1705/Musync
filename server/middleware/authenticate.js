const jwt = require("jsonwebtoken");
const User = require('../models/userSchema');

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jtoken;
    console.log("Token from cookie:", token);
    const tverify = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Token verified user:", tverify);
    const rootuser = await User.findOne({ _id: tverify._id, "tokens.token": token });

    if (!rootuser) {
      throw new Error("User not found");
    }
    req.token = token;
    req.rootuser = rootuser;
    req.userID = rootuser._id;
    // req.userName = rootuser.name;
    next();

  } catch (error) {
    res.status(401).send("No token provided");
    console.log(error);
  }
}

module.exports = authenticate;