import express from 'express';
import fs from 'fs';

const router = express.Router();
const dataFile = './data/prompts.json';

// Get all prompts
router.get('/', (req, res) => {
  if (!fs.existsSync(dataFile)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.json(data);
});

// Add a new prompt
router.post('/', (req, res) => {
  const { category, prompt } = req.body;
  if (!category || !prompt) return res.status(400).json({ error: 'Category and prompt required' });

  let data = [];
  if (fs.existsSync(dataFile)) data = JSON.parse(fs.readFileSync(dataFile));

  data.push({ category, prompt });
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  res.json({ message: 'Prompt added successfully' });
});

export default router;
