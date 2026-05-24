const Otp = require("../models/otpSchema");

const findById = async (otpId) => {
  return await Otp.findById(otpId);
};

const deleteById = async (otpId) => {
  return await Otp.findByIdAndDelete(otpId);
};

module.exports = {
  findById,
  deleteById,
};