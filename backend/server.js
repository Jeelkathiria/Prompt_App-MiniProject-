import express from 'express';
import cors from 'cors';
import promptRoutes from './routes/promptRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/prompts', promptRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));

const categories = ["Coding", "Idea", "Writing", "Design"];

app.get('/api/categories', (req, res) => {
  res.json(categories);
});
