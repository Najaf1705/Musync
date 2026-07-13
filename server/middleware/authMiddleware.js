const jwt = require("jsonwebtoken");
const UserRepo = require('../repositories/userRepository');

const authenticate = async (req, res, next) => {
  try {
    console.log('Authentication middleware triggered');
    console.log("Headers:", req.headers);
    console.log("Cookie header:", req.headers.cookie);
    console.log("Parsed cookies:", req.cookies);
    const token = req.cookies?.accessToken || req.cookies?.jtoken;
    console.log("Token from cookies:", token);

    if (!token) {
      return res.status(401).json({ error: "Authentication required - no token found" });
    }

    const tverify = jwt.verify(token, process.env.SECRET_KEY);
    // const userId = tverify.userId || tverify.sub || tverify._id || tverify.email;
    const email = tverify.email || null;

    let rootuser = await UserRepo.findUserByEmail(email);

    // if (!rootuser && email) {
    //   rootuser = await UserRepo.findUserByEmail(email);
    // }

    if (!rootuser) {
      rootuser = await UserRepo.createUser({
        email,
      });
    }

    req.token = token;
    req.rootuser = rootuser;
    // req.userId = rootuser.userId || rootuser._id?.toString();
    req.email = rootuser.email || email || null;
    next();
  } catch (error) {
    console.log('Auth Error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token format" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token has expired" });
    }
    return res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = authenticate;