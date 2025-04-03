const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  query: { type: String, required: true },
  adminResponse: { type: String, default: "" }, // New field for the admin's response
});

module.exports = mongoose.model("Query", querySchema);
