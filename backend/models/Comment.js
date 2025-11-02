const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  promptId: { type: mongoose.Schema.Types.ObjectId, ref: "Prompt", required: true },
  text: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
