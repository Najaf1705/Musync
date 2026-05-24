const nodemailer = require("nodemailer");
const otpRepo = require("../repositories/otpRepository");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendOtp=async(email)=> {
  const otp = Math.floor(100000 + Math.random() * 900000);
  await transporter.sendMail({
    from: `"Musync Support" <${process.env.EMAIL}>`,
    to: email,
    subject: "🔐 Your Musync OTP Code",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 12px; background: #ffffff;">
            
            <h2 style="color: #111827; margin-bottom: 8px;">
            Verify Your Email
            </h2>

            <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            Use the OTP below to continue signing in to <strong>Musync</strong>.
            </p>

            <div style="margin: 28px 0; text-align: center;">
            <span style="display: inline-block; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #111827; background: #f3f4f6; padding: 14px 24px; border-radius: 10px;">
                ${otp}
            </span>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
            This code will expire in <strong>10 minutes</strong>.
            </p>

            <p style="color: #6b7280; font-size: 14px;">
            If you didn’t request this code, you can safely ignore this email.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />

            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            © Musync
            </p>
            
        </div>` // keep your existing HTML
  });
  return otp;
}

const validateOtp = async (otpId, otp) => {
  if (!otpId || !otp) {
    throw {
      status: 400,
      message: "otpId and otp are required",
    };
  }

  const otpDoc = await otpRepo.findById(otpId);

  if (!otpDoc) {
    throw {
      status: 404,
      message: "OTP expired or invalid",
    };
  }

  if (otpDoc.otp !== otp) {
    throw {
      status: 401,
      message: "Incorrect OTP",
    };
  }

  await otpRepo.deleteById(otpId);

  return {
    message: "OTP verified successfully",
    verified: true,
  };
};

module.exports = {
  validateOtp,
  sendOtp
};