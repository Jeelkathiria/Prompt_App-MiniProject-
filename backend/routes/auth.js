// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connect } = require("../connect");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const router = express.Router();

// 🧩 Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/certificates");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// 🧩 REGISTER
// routes/auth.js
router.post("/register", upload.single("certificate"), async (req, res) => {
  try {
    const db = await connect();
    const { name, email, password, field, newField } = req.body;
    const certificate = req.file ? req.file.filename : null;

    // 1️⃣ Basic validation
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    // 2️⃣ Conditional validation logic
    if (certificate && !field)
      return res
        .status(400)
        .json({ message: "Category required when uploading certificate" });

    if (field && field !== "Other" && !certificate)
      return res
        .status(400)
        .json({ message: "Certificate required when selecting a category" });

    if (field === "Other" && (!newField || !certificate))
      return res.status(400).json({
        message:
          "Both new field name and certificate required for 'Other' category",
      });

    // 3️⃣ Check if user already exists
    const existing = await db.collection("users").findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    // 4️⃣ Determine final category name
    let finalField = field === "Other" ? newField?.trim() : field;

    // 5️⃣ If category doesn’t exist, insert it into Categories
    if (finalField) {
      // Convert to lowercase for case-insensitive matching
      const normalizedField = finalField.trim().toLowerCase();

      // Find category ignoring case
      const existingCategory = await db.collection("categories").findOne({
        normalized: normalizedField,
      });

      if (!existingCategory) {
        await db.collection("categories").insertOne({
          name: finalField.trim(),
          normalized: normalizedField,
        });
      }
    }

    // 6️⃣ Hash password and save user
    const hashed = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({
      name,
      email,
      password: hashed,
      field: finalField || null,
      certificate,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 🧩 LOGIN
router.post("/login", async (req, res) => {
  try {
    const db = await connect();
    const { email, password } = req.body;

    const user = await db.collection("users").findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, field: user.field },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
