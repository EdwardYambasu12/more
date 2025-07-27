const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  church: String,
  country: String,
  ageGroup: String,
  cluster: String,
  color: String,
  accommodation: String,
  specialRequests: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Participant", ParticipantSchema);
