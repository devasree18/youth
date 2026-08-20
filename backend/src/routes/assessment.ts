import express from 'express';
import { Assessment } from '../models/Assessment';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const mockResult = "Thank you for completing your assessment! Based on your responses, here are 2 steps you can take today: 1) Take a 10-minute mindful walk to clear your head. 2) Write down 3 things you're grateful for. Remember, small steps lead to big changes. You've got this! 💪";
    res.json({ result: mockResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate assessment' });
  }
});

router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { type, responses, score } = req.body;
    const assessment = new Assessment({
      userId: req.user.userId,
      type,
      responses,
      score
    });
    await assessment.save();
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save assessment' });
  }
});

router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

export default router;
