const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
// const sendEmail = require("../utils/email");
const nodemailer = require("nodemailer");

// Function to send email
const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail or your email service provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to, // Recipient address
      subject, // Email subject
      text, // Email body
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

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
