// routes/prompt.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const { connect } = require("../connect");
const Prompt = require("../models/Prompt"); // ✅ make sure file exists

const router = express.Router();

// ----------------------------
// 📸 Multer setup for uploads
// ----------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ----------------------------
// 🔐 Middleware: Verify JWT
// ----------------------------
function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(403).json({ error: "Invalid token" });
  }
}

// ----------------------------
// 🧩 POST: Add new prompt
// ----------------------------
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, category, description, resultOutput } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !category || !description || !resultOutput || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Verify user existence (if you store users in DB)
    const db = await connect();
    const user = await db.collection("users").findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newPrompt = {
      title,
      category,
      description,
      resultOutput,
      image,
      createdBy: req.user.email,
      createdAt: new Date(),
    };

    const result = await db.collection("prompts").insertOne(newPrompt);
    res.status(201).json({ message: "Prompt added successfully", data: result });
  } catch (err) {
    console.error("Error adding prompt:", err);
    res.status(500).json({ error: "Server error while adding prompt" });
  }
});

// ----------------------------
// 📚 GET all prompts (optional public route)
// ----------------------------
router.get("/", async (req, res) => {
  try {
    const db = await connect();
    const prompts = await db.collection("prompts").find().toArray();
    res.json(prompts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch prompts" });
  }
});

module.exports = router;
