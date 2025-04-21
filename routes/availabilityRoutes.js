const express = require("express");
const router = express.Router();
const Availability = require("../models/Availability");

// Doctor creates availability slot
router.post("/create", async (req, res) => {
  const { doctorId, appointmentDate, timeSlot } = req.body;
  try {
    const existing = await Availability.findOne({
      doctorId,
      appointmentDate,
      timeSlot,
    });
    if (existing)
      return res.status(400).json({ message: "Slot already exists" });

    const slot = new Availability({ doctorId, appointmentDate, timeSlot });
    await slot.save();
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch all availability for doctor
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const slots = await Availability.find({ doctorId: req.params.doctorId });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark slot as booked
router.post("/book", async (req, res) => {
  const { appointmentDate, timeSlot } = req.body;
  try {
    const slot = await Availability.findOneAndUpdate(
      { appointmentDate, timeSlot, isBooked: false },
      { isBooked: true },
      { new: true }
    );
    if (!slot) return res.status(404).json({ message: "Slot not available" });
    res.status(200).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
