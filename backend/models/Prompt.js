// models/Prompt.js
const mongoose = require("mongoose");
// models/Prompt.js
const CommentSchema = new mongoose.Schema({
  name: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const PromptSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  resultOutput: String,
  image: String,
  certificate: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  comments: [CommentSchema],
});


module.exports = mongoose.model("Prompt", PromptSchema);

