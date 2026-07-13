const authService = require('../services/authService');

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
  serverProfile,
};