const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  fullName: String,
  email: String,
  phone: String,
  church: String,
  country: String,
  ageGroup: String,
  cluster: String,
  color: String,
  accommodation: String,
  specialRequests: String,
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Registration", RegistrationSchema);
