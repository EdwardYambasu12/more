const mongoose = require("mongoose");

const FedSchema = new mongoose.Schema({
  participantId: { type: Number, required: true, unique: true },
  fullName: String,
  fedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Fed", FedSchema);
