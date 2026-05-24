const User = require('../models/userSchema');
const Otp = require('../models/otpSchema');

// Find user by email
const findUserByEmail = async (email) => {
  if (!email) return null;
  return await User.findOne({ email });
};

// Find user by ID
const findUserById = async (userId) => {
  if (!userId) return null;
  return await User.findById(userId);
};

// Create new user
const createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

// Update user
const updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

// Find OTP by ID and email
const findOtpByIdAndEmail = async (otpId, email) => {
  return await Otp.findOne({ _id: otpId, email });
};

// Delete OTP
const deleteOtpById = async (otpId) => {
  return await Otp.findByIdAndDelete(otpId);
};

// Delete all OTP records for an email
const deleteOtpsByEmail = async (email) => {
  return await Otp.deleteMany({ email });
};

// Create OTP record
const createOtpRecord = async (email, otp) => {
  return await Otp.create({ email, otp });
};

// Find OTP by ID
const findOtpById = async (otpId) => {
  return await Otp.findById(otpId);
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  findOtpByIdAndEmail,
  deleteOtpById,
  deleteOtpsByEmail,
  createOtpRecord,
  findOtpById,
};
