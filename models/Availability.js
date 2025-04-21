const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  appointmentDate: { type: String, required: true },
  timeSlot: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});

module.exports = mongoose.model("Availability", availabilitySchema);
