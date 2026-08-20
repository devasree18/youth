import express from 'express';
import { MoodEntry } from '../models/MoodEntry';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { mood, note } = req.body;
    const newMood = new MoodEntry({
      userId: req.user.userId,
      mood,
      note
    });
    await newMood.save();
    res.status(201).json(newMood);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save mood entry' });
  }
});

router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const moods = await MoodEntry.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mood entries' });
  }
});

export default router;
