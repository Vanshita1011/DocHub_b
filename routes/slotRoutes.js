const express = require("express");
const router = express.Router();
const Slot = require("../models/slotModel");
const Doctor = require("../models/doctorModel");
const sendEmail = require("../utils/email");

//  Route to book a slot (ensure logged-in user email is stored)
router.post("/book-slot", async (req, res) => {
  try {
    const {
      userEmail,
      name,
      phone,
      age,
      gender,
      appointmentDate,
      timeSlot,
      hospital,
      doctor,
    } = req.body;

    if (
      !userEmail ||
      !name ||
      !phone ||
      !age ||
      !appointmentDate ||
      !timeSlot ||
      !hospital ||
      !doctor ||
      !gender
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const doctorData = await Doctor.findOne({ name: doctor });
    if (!doctorData) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const newSlot = new Slot({
      userEmail,
      name,
      phone,
      age,
      appointmentDate,
      timeSlot,
      hospital,
      gender,
      doctor: doctorData._id,
    });

    await newSlot.save();
    // Send email notification
    const emailSubject = "Appointment Confirmation";
    const emailBody = `
          Dear ${name},

          Your appointment has been successfully booked.

          Details:
          - Doctor: ${doctor}
          - Date: ${appointmentDate}
          - Time Slot: ${timeSlot}
          - Hospital: ${hospital}

          Thank you for choosing our platform.

          Regards,
          DocHub Team
        `;

    await sendEmail(userEmail, emailSubject, emailBody);

    res.status(201).json({ message: "Slot booked successfully", newSlot });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//  Fetch slots by logged-in user’s email
router.get("/:userEmail", async (req, res) => {
  try {
    const slots = await Slot.find({ userEmail: req.params.userEmail }).populate(
      "doctor"
    );

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch slots by doctor ID
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const slots = await Slot.find({ doctor: req.params.doctorId }).populate(
      "doctor"
    );

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel a slot by ID
router.delete("/:id", async (req, res) => {
  try {
    const slot = await Slot.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    res.json({ message: "Slot cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
