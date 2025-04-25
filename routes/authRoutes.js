const express = require("express");
const {
  register,
  login,
  generateOtp,
  verifyOtp,
} = require("../controllers/authController");
const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Generate OTP route
router.post("/generate-otp", generateOtp);

// Verify OTP route
router.post("/verify-otp", verifyOtp);

module.exports = router;
