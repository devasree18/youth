import express from 'express';
import { Post } from '../models/Post';

const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(20);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/posts', async (req, res) => {
  try {
    const { author, content } = req.body;
    const post = new Post({ author, content });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

export default router;
