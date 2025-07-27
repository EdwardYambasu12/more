const express = require("express");
const router = express.Router();
const Participant = require("./models/Participant");

const colors = ["hope", "love", "grace", "faith"];

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      church,
      country,
      ageGroup,
      accommodation,
      cluster,
      specialRequests,
    } = req.body;

    if (!fullName || !email || !phone) {
      return res
        .status(400)
        .json({ message: "Full Name, Email, and Phone are required." });
    }

    // Generate a unique numeric ID (improve as needed)
    const user_id = Math.floor(100000 + Math.random() * 900000);

    const color = colors[Math.floor(Math.random() * colors.length)];

    const newParticipant = new Participant({
      id: user_id,
      fullName,
      email,
      phone,
      church,
      country,
      ageGroup,
      cluster,
      color,
      accommodation,
      specialRequests,
    });

    console.log(await newParticipant.find())

    await newParticipant.save();

    res.status(201).json({ message: "Registration successful!", data: newParticipant });
  } catch (error) {
    console.error("Error saving registration:", error);
    res.status(500).json({ message: "Failed to register participant." });
  }
});

router.get("/", async (req, res) => {
  try {
    const participants = await Participant.find({});
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch participants" });
  }
});

module.exports = router;
