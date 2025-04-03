const express = require("express");
const Query = require("../models/Query");
const router = express.Router();

// Save contact query
router.post("/", async (req, res) => {
  try {
    const query = new Query(req.body);
    await query.save();
    res.status(200).json({ message: "Query submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving query" });
  }
});

// Get all queries for admin
router.get("/", async (req, res) => {
  try {
    const queries = await Query.find();
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching queries" });
  }
});

// Update a query with admin response
router.put("/:id", async (req, res) => {
  try {
    const { adminResponse } = req.body;
    const updatedQuery = await Query.findByIdAndUpdate(
      req.params.id,
      { adminResponse },
      { new: true }
    );
    if (!updatedQuery) {
      return res.status(404).json({ message: "Query not found" });
    }
    res.status(200).json(updatedQuery);
  } catch (error) {
    res.status(500).json({ message: "Error updating query response" });
  }
});

module.exports = router;
