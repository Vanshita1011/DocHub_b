const User = require("../models/User");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register a new user
const register = async (req, res) => {
  const { email, password, age, mobile, gender, dateOfBirth } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Calculate age based on date of birth
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      calculatedAge--;
    }

    // Create and save a new user
    const newUser = new User({
      email,
      password,
      age: calculatedAge,
      mobile,
      gender,
      dateOfBirth,
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      msg: "User registered successfully",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Generate OTP
const generateOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration time (5 minutes)
    user.otp = otp;
    user.otpExpire = Date.now() + 2 * 60 * 1000;
    await user.save();

    // Send OTP via email
    const subject = "Your OTP for Login";
    const message = `Your OTP for login is: ${otp}. It is valid for 2 minutes.`;
    await sendEmail(user.email, subject, message);

    res.status(200).json({ msg: "OTP sent to your email" });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Clear OTP fields after successful verification
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ msg: "OTP verified successfully", token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      msg: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { register, login, generateOtp, verifyOtp };
