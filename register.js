const express = require("express");
const router = express.Router();
const Registration = require("./models/participant.js");

const colors = ["hope", "love", "grace", "faith"];

router.post("/", async (req, res) => {

  console.log("Received registration data:", req.body);
  const id = Math.floor(Math.random() * 2000) + 1; // Generate a random ID between 1 and 2000
  const {
   
    fullName,
    email,
    phone,
    church,
    country,
    ageGroup,
    accommodation,
    photo,
    gender,
    cluster,
    specialRequests
  } = req.body;

  if (!id || !fullName || !email || !phone) {
    return res.status(400).json({ message: "ID, Full Name, Email, and Phone are required." });
  }

  // ✅ Ensure ID is a valid number within range
  const numericId = parseInt(id, 10);
  if (isNaN(numericId) || numericId < 1 || numericId > 2000) {
    return res.status(400).json({ message: "ID must be a number between 0001 and 2000." });
  }

  try {
    // ✅ Check if ID already exists
    const existing = await Registration.findOne({ id: id });
    if (existing) {
      return res.status(409).json({ message: "ID already registered." });
    }

    const color = colors[Math.floor(Math.random() * colors.length)];

    const newEntry = new Registration({
      id,
      fullName,
      email,
      phone,
      church,
      country,
      ageGroup,
      photo,
      gender,
      cluster,
      color,
      accommodation,
      specialRequests
    });

    await newEntry.save();
    res.status(201).json({ message: "Registration successful!", data: newEntry });
  } catch (error) {
    console.error("Error saving registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  const all = await Registration.find().sort({ timestamp: -1 });
  res.json(all);
});

module.exports = router;
