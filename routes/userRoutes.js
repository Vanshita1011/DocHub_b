const express = require("express");
const {
  getUser,
  updateUser,
  getAllUsers,
} = require("../controllers/userController");
const router = express.Router();

// Get user data by email
router.get("/:email", getUser);

// Update user data
router.put("/update/:email", updateUser);

// Get all users
router.get("/", getAllUsers);

module.exports = router;
