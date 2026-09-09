import express from 'express';
import { z } from 'zod';
import { MoodEntry, MoodValue } from '../models/MoodEntry';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';

const router = express.Router();

const moodScoreMap: Record<MoodValue, number> = {
  very_low: 1,
  low: 2,
  okay: 3,
  good: 4,
  great: 5
};

const moodSchema = z.object({
  mood: z.enum(['very_low', 'low', 'okay', 'good', 'great']),
  note: z.string().max(500).optional(),
  factors: z.array(z.string()).optional()
});

router.post('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const parseResult = moodSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid mood parameters', parseResult.error.flatten().fieldErrors);
    }

    const { mood, note, factors } = parseResult.data;
    const numericScore = moodScoreMap[mood];

    const moodEntry = new MoodEntry({
      userId: req.user?.userId,
      tenantId: req.user?.tenantId,
      mood,
      score: numericScore,
      note,
      factors: factors || []
    });

    await moodEntry.save();

    return sendSuccess(res, moodEntry, 'Mood check-in recorded successfully', 201);
  } catch (error) {
    next(error);
  }
});

router.get(['/', '/history'], authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string || '30', 10), 100);
    const moods = await MoodEntry.find({ userId: req.user?.userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    return sendSuccess(res, moods, 'Mood history retrieved successfully');
  } catch (error) {
    next(error);
  }
});

export default router;
