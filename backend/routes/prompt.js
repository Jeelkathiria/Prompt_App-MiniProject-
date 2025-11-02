// routes/prompt.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const { connect } = require("../connect");

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
      createdBy: req.user.email, // link by email
      certificate: user.certificate || null,
      createdAt: new Date(),
    };

    await db.collection("prompts").insertOne(newPrompt);
    res.status(201).json({
      message: "Prompt added successfully",
      data: newPrompt,
    });
  } catch (err) {
    console.error("Error adding prompt:", err);
    res.status(500).json({ error: "Server error while adding prompt" });
  }
});

// ----------------------------
// 📚 GET all prompts (with user info)

// routes/prompt.js
router.get("/", async (req, res) => {
  try {
    const db = await connect();
    const prompts = await db.collection("prompts").find().sort({ createdAt: -1 }).toArray();

    // Attach user details manually
    for (let prompt of prompts) {
      const user = await db.collection("users").findOne({ email: prompt.createdBy });
      prompt.user = user
        ? { name: user.name, email: user.email, certificate: user.certificate }
        : { name: "Unknown", email: "Unknown", certificate: null };
    }

    res.json(prompts);
  } catch (err) {
    console.error("Error fetching prompts:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/comments", async (req, res) => {
  try {
    const { name, text } = req.body;
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) return res.status(404).json({ message: "Prompt not found" });

    prompt.comments.push({ name, text });
    await prompt.save();

    res.json(prompt.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
