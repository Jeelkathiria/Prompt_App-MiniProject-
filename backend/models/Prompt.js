// backend/models/Prompt.js
const mongoose = require("mongoose");

const PromptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  resultOutput: { type: String },
  image: { type: String },
  userId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prompt", PromptSchema);
