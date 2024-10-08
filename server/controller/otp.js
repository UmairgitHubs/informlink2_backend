import speakeasy from "speakeasy";
import nodemailer from "nodemailer";

const generateOTP = () => {
  return speakeasy.totp({
    secret: process.env.OTP_SECRET || "default_otp_secret",
    encoding: "base32",
  });
};

const sendOTPEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Informlink OTP Service" <noreply@informlink.com>',
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  });
};

export const generateAndSendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const otp = generateOTP();
    await sendOTPEmail(email, otp);
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("OTP generation error:", error);
    res.json({ success: false, message: "Failed to send OTP" });
  }
};
