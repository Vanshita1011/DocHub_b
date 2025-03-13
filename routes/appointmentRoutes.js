const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// Create a new appointment
router.post("/", async (req, res) => {
  try {
    const {
      userEmail,
      name,
      phone,
      appointmentDate,
      hospital,
      timeSlot,
      doctor,
      age,
      gender,
    } = req.body;
    const newAppointment = new Appointment({
      userEmail,
      name,
      phone,
      appointmentDate,
      hospital,
      timeSlot,
      doctor,
      age,
      gender,
    });
    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Get appointments by user email
router.get("/:userEmail", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userEmail: req.params.userEmail,
    }).populate("doctor");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.params.doctorId,
    }).populate("doctor");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an appointment by ID
router.delete("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
