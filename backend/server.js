// ----------------------------
// 🌟 IMPORTS & SETUP
// ----------------------------
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { connect } = require("./connect");

// Import routes
const authRoutes = require("./routes/auth");
const promptRoutes = require("./routes/prompt");

dotenv.config();
const app = express();

// ----------------------------
// ⚙️ MIDDLEWARE
// ----------------------------
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded images statically
app.use("/uploads", express.static(uploadDir));

// ----------------------------
// 🔐 TOKEN VERIFICATION MIDDLEWARE
// ----------------------------
function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

// ----------------------------
// 🧭 ROUTES
// ----------------------------

// ✅ Authentication routes
app.use("/api/auth", authRoutes);

// ✅ Prompt routes (registered from separate file)
app.use("/api/prompts", promptRoutes);

// ✅ Category routes
app.get("/api/categories", async (req, res) => {
  try {
    const db = await connect();
    const categories = await db.collection("categories").find().toArray();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const db = await connect();
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Normalize category name to avoid duplicates like AIML / AiMl / AI/ML
    const normalized = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    const existing = await db.collection("categories").findOne({ normalized });
    if (existing) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const result = await db.collection("categories").insertOne({ name, normalized });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to add category" });
  }
});

// ✅ Public “All Prompts” endpoint
// ✅ Public “All Prompts” endpoint
app.get("/api/allPrompts", async (req, res) => {
  try {
    const db = await connect();
    const prompts = await db
      .collection("prompts")
      .find({}, {
        projection: {
          title: 1,
          category: 1,
          description: 1,
          resultOutput: 1,
          image: 1,
          createdBy: 1,
          certificate: 1,
          createdAt: 1,
        },
      })
      .toArray();
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all prompts" });
  }
});


// ✅ Default route for sanity check
app.get("/", (req, res) => {
  res.send("🚀 Prompt App Backend Running Successfully!");
});

// ----------------------------
// 🚀 START SERVER
// ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connect();
  console.log("✅ Connected to MongoDB");
  console.log(`🚀 Server running on port ${PORT}`);
});
