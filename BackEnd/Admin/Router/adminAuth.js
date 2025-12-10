const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
// 🧩 REGISTER USER (Signup)
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
    });

    await user.save();

    res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 🧩 LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Create JWT (valid for 7 days)
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin || true, // mark as admin for dashboard
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
