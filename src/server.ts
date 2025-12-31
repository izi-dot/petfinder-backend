import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { config } from './config.js';
import { DatabaseController } from './database.controller.js';
import type { NewPostRequest } from 'domains/post.domain.js';

const app = express();
const dbController = new DatabaseController();

app.use(express.json());
app.use(cors());



app.get('/api/posts', async (req, res) => {
  try {
    const results = await dbController.getAllPosts();
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

app.post('/api/post', async (req: Request<{}, {}, NewPostRequest>, res) => {
  try {
    await dbController.createPost(req.body);
    res.status(201).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});



app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});