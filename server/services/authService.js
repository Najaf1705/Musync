const bcrypt = require('bcryptjs');
const userRepo = require('../repositories/userRepository');
const otpService = require('./otpService');
const { verifyGoogleToken } = require('../middleware/googleauth');

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
const validatePassword = (password) => {
  return password && password.length >= 4;
};

// Login with password
const loginWithPassword = async (email, password) => {
  if (!email || !password) {
    throw { status: 400, message: 'Email and password are required' };
  }

  const user = await userRepo.findUserByEmail(email);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  return user;
};

// Login with OTP
const loginWithOtp = async (email, otp, otpId) => {
  if (!email || !otp || !otpId) {
    throw { status: 400, message: 'Email, OTP, and OTP ID are required' };
  }

  const user = await userRepo.findUserByEmail(email);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const otpDoc = await userRepo.findOtpByIdAndEmail(otpId, email);
  if (!otpDoc) {
    throw { status: 404, message: 'OTP expired or invalid' };
  }

  if (otpDoc.otp !== otp) {
    throw { status: 401, message: 'Incorrect OTP' };
  }

  // Delete OTP after successful verification
  await userRepo.deleteOtpById(otpId);

  return user;
};

// Normal signup
const signup = async (name, email, password, image = null, otpId = null, otp = null) => {
  if (!name || !email || !password) {
    throw { status: 400, message: 'Name, email, and password are required' };
  }

  if (!validateEmail(email)) {
    throw { status: 400, message: 'Invalid email format' };
  }

  if (!validatePassword(password)) {
    throw { status: 400, message: 'Password must be at least 4 characters' };
  }
}

const createNewUser = async (userId) => {
  const existingUser = await userRepo.findUserByUserId(userId);
  if (existingUser) {
    throw { status: 409, message: 'User already exists' };
  }

  const newUser = await userRepo.createUser({
    userId,
  });

  return newUser;
};

// const existingUser = await userRepo.findUserByEmail(email);
// if (existingUser) {
//   throw { status: 409, message: 'User already exists' };
// }

// if (!otpId || !otp) {
//   const { otpId: newOtpId } = await generateOtp(email);
//   return {
//     status: 'otp_required',
//     message: 'Email verification required',
//     otpId: newOtpId,
//   };
// }

// await validateOtpCode(otpId, otp);

// const newUser = await userRepo.createUser({
//   name,
//   email,
//   password,
//   image,
// });

// return newUser;
// };

// Google login
// const googleLogin = async (email, image = null) => {
//   if (!email) {
//     throw { status: 400, message: 'Email is required' };
//   }

//   if (!validateEmail(email)) {
//     throw { status: 400, message: 'Invalid email format' };
//   }

//   const user = await userRepo.findUserByEmail(email);
//   if (!user) {
//     throw { status: 404, message: 'User not found', isNewUser: true };
//   }

//   // Update user image if provided
//   if (image) {
//     await userRepo.updateUser(user._id, { image });
//     user.image = image;
//   }

//   return user;
// };




const googleSignup = async (token, password = null) => {
  if (!token) {
    throw { status: 400, message: "Token is required" };
  }

  const googleUser = await verifyGoogleToken(token);

  const { email, name, image, googleId, emailVerified } = googleUser;

  if (!emailVerified) {
    throw { status: 400, message: "Google email not verified" };
  }

  const existingUser = await userRepo.findUserByEmail(email);

  // ✅ Existing user → update details + login
  if (existingUser) {
    const updatedUser = await userRepo.updateUser(existingUser._id, {
      // name,
      image,
      googleId,
    });

    return updatedUser;
  }

  if (!password) throw { status: 409, message: "User not found, Create password to continue" };

  // ✅ New user with password
  if (password) {
    const newUser = await userRepo.createUser({
      name,
      email,
      password,
      image,
      googleId,
    });

    return newUser;
  }
};

// Generate OTP
const generateOtp = async (email) => {
  if (!email) {
    throw { status: 400, message: 'Email is required' };
  }

  if (!validateEmail(email)) {
    throw { status: 400, message: 'Invalid email format' };
  }

  // Delete existing OTPs for this email
  await userRepo.deleteOtpsByEmail(email);

  // Generate and send OTP
  const otp = await otpService.sendOtp(email);

  // Save OTP record
  const otpDoc = await userRepo.createOtpRecord(email, otp);

  return {
    otpId: otpDoc._id,
    message: 'OTP sent successfully',
  };
};

// Validate OTP
const validateOtpCode = async (otpId, otp) => {
  if (!otpId || !otp) {
    throw { status: 400, message: 'OTP ID and OTP are required' };
  }

  const result = await otpService.validateOtp(otpId, otp);
  return result;
};

// Get user by email
const getUserByEmail = async (email) => {
  if (!email) {
    throw { status: 400, message: 'Email is required' };
  }

  const user = await userRepo.findUserByEmail(email);
  return !!user;
};

// Format user response
const formatUserResponse = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    likedSongs: user.likedSongs,
    playlists: user.playlists,
    image: user.image,
  };
};

module.exports = {
  loginWithPassword,
  loginWithOtp,
  signup,
  googleSignup,
  generateOtp,
  validateOtpCode,
  getUserByEmail,
  formatUserResponse,
  createNewUser,
};
