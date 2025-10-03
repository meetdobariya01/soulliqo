const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const asyncHandler = require("../Middleware/asyncHandler");
const User = require("../Models/User");
const router = express.Router();

// Mailer setup
const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});

// Signup
router.post("/signup", asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, mobile, role } = req.body;
  if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: "All fields are required." });

  if (await User.findOne({ email })) return res.status(400).json({ message: "Email already exists." });
  if (mobile && await User.findOne({ mobile })) return res.status(400).json({ message: "Mobile already registered." });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ firstName, lastName, email, password: hashedPassword, mobile, role: (role || "user").toLowerCase() });
  await user.save();
  res.status(201).json({ message: "User registered successfully." });
}));

// Login
router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(400).json({ message: "User not found." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
  res.json({ message: "Login successful.", token, role: user.role, userId: user._id });
}));

// Forgot Password
router.post("/forgot-password", asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await mailer.sendMail({
    from: `"No-Reply" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  });

  res.json({ message: "OTP sent to email" });
}));

// Reset Password
router.post("/reset-password", asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ message: "All fields are required" });

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(404).json({ message: "User not found" });
  if (!user.otp || user.otp !== otp || !user.otpExpires || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  res.json({ message: "Password reset successfully" });
}));

module.exports = router;
