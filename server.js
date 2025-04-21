const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes"); // Import appointmentRoutes
const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes"); // Import doctorRoutes
const admin = require("./routes/admin"); // Import adminRoutes
const slotRoutes = require("./routes/slotRoutes");
const queryRoutes = require("./routes/queryRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const multer = require("multer");
const mongoose = require("mongoose");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

dotenv.config();
connectDB();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    console.log("insidefilename fxn", file);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();

const corsOptions = {
  origin: "https://doc-hub-three.vercel.app", // Replace with your frontend's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies if needed
};

// Middleware
app.use(cors());
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes); // Import appointmentRoutes
app.use("/api/users", userRoutes);
app.use("/api/admin", admin); // Import adminRoutes);
app.use("/api/doctors", doctorRoutes); //  doctor routes
app.use("/api/slots", slotRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/availability", availabilityRoutes);

const Image = mongoose.model("Image", { Img_Url: String });
app.post("/", upload.single("img"), async (req, res) => {
  console.log(req.file.path);
  const x = await cloudinary.uploader.upload(req.file.path);
  console.log("cloudinary", x);
  const newvar = new Image({ Img_Url: x.secure_url });
  newvar.save().then(() => {
    console.log("saved");
  });
  res.json({
    msg: "file uploaded",
    your_url: { img_url: x.secure_url },
  });
});

// Sample API Route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
