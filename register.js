const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Path to data folder and file
const dataDir = path.join(__dirname, "./data");
const dataFilePath = path.join(dataDir, "registrations.json");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Ensure JSON file exists
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, "[]");
}


const colors = ["hope", "love", "grace", "faith"]


router.post("/", (req, res) => {
  const {
    fullName,
    email,
    phone,
    church,
    country,
    ageGroup,
    accommodation,
    specialRequests
  } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ message: "Full Name, Email, and Phone are required." });
  }

const user_id = Math.round(Math.random()*9999)

const color = colors[Math.round(Math.random()*3)]

  const newEntry = {
    id: user_id,
    fullName,
    email,
    phone,
    church,
    country,
    ageGroup,
    color,
    accommodation,
    specialRequests,
    timestamp: new Date().toISOString(),
  };

  // Read current registrations
  const registrations = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));

  // Add new entry
  registrations.push(newEntry);

  // Save updated registrations
  fs.writeFileSync(dataFilePath, JSON.stringify(registrations, null, 2));

  console.log("New Registration Saved:", newEntry);
  res.status(201).json({ message: "Registration successful!", data: newEntry });
});

router.get("/", (req, res) => {
  const registrations = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
  res.json(registrations);
});

module.exports = router;
