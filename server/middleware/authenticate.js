const jwt = require("jsonwebtoken");
const User = require('../models/userSchema');

const UserRepo = require('../repositories/userRepository');

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken || req.cookies.jtoken;
    console.log("Token from cookies:", token);
    if (!token) {
      return res.status(401).send("No token provided");
    }

    const tverify = jwt.verify(token, process.env.SECRET_KEY);
    const email = tverify.email;

    let rootuser = await UserRepo.findUserByEmail(email);

    if (!rootuser) {
      rootuser = await UserRepo.createUser({
        email,
      });
    }

    req.token = token;
    req.rootuser = rootuser;
    req.email = rootuser.email || email || null;
    next();

  } catch (error) {
    console.log(error);
    return res.status(401).send("No token provided");
  }
}

module.exports = authenticate;