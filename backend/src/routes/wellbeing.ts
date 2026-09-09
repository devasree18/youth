import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { WellbeingService } from '../services/WellbeingService';
import { sendSuccess } from '../utils/response';

const router = express.Router();

router.get('/summary', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const summary = await WellbeingService.calculateWellbeingScore(req.user!.userId);
    return sendSuccess(res, summary, 'Wellbeing summary calculated successfully');
  } catch (error) {
    next(error);
  }
});

export default router;
