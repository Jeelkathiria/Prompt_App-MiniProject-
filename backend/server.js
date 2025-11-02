// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connect } = require("./connect");
const authRoutes = require("./routes/auth"); // ✅ fixed path

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);


// ---------- ROUTES ----------

// 🧠 PROMPT ROUTES
app.get("/api/prompts", async (req, res) => {
  try {
    const db = await connect();
    const prompts = await db.collection("prompts").find().toArray();
    res.json(prompts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch prompts" });
  }
});

app.post("/api/prompts", async (req, res) => {
  try {
    const db = await connect();
    const result = await db.collection("prompts").insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to add prompt" });
  }
});

// 🧩 CATEGORY ROUTES
app.get("/api/categories", async (req, res) => {
  try {
    const db = await connect();
    const categories = await db.collection("categories").find().toArray();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const db = await connect();
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required" });

    const exists = await db.collection("categories").findOne({ name });
    if (exists) return res.status(400).json({ error: "Category already exists" });

    const result = await db.collection("categories").insertOne({ name });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to add category" });
  }
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connect();
  console.log(`✅ Connected to MongoDB`);
  console.log(`🚀 Server running on port ${PORT}`);
});
