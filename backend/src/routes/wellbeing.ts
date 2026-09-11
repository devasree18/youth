import express from 'express';
import mongoose from 'mongoose';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { WellbeingInsightService } from '../services/WellbeingInsightService';
import { WellbeingService } from '../services/WellbeingService';
import { sendSuccess, sendError } from '../utils/response';

const router = express.Router();

// ── GET /api/v1/wellbeing/insights ──────────────────────────────────────────
// Complete private wellbeing dashboard insights
router.get('/insights', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, 401, 'UNAUTHORIZED', 'User authentication required');
    }

    const insights = await WellbeingInsightService.getDashboardInsights(userId);
    return sendSuccess(res, insights, 'Personal wellbeing insights generated successfully');
  } catch (error) {
    next(error);
  }
});

// ── GET /api/v1/wellbeing/summary ───────────────────────────────────────────
// Legacy wellbeing summary score (non-diagnostic)
router.get('/summary', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, 401, 'UNAUTHORIZED', 'User authentication required');
    }

    const summary = await WellbeingService.calculateWellbeingScore(userId);
    return sendSuccess(res, summary, 'Wellbeing summary calculated successfully');
  } catch (error) {
    next(error);
  }
});

// ── GET /api/v1/wellbeing/trends ────────────────────────────────────────────
// Non-clinical emotional and focus trends
router.get('/trends', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, 401, 'UNAUTHORIZED', 'User authentication required');
    }

    const dashboard = await WellbeingInsightService.getDashboardInsights(userId);
    return sendSuccess(
      res,
      {
        emotionalTrend: dashboard.emotionalTrend,
        focusReset: dashboard.focusReset,
        todayCheckIn: dashboard.todayCheckIn,
        generatedAt: dashboard.generatedAt,
      },
      'Wellbeing trends retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
});

// ── DELETE /api/v1/wellbeing/insights/:id ────────────────────────────────────
// Delete a specific personal wellbeing insight (Student Data Control)
router.delete('/insights/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'INVALID_ID', 'Invalid insight ID provided');
    }

    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, 401, 'UNAUTHORIZED', 'User authentication required');
    }

    const deleted = await WellbeingInsightService.deleteInsight(id, userId);
    if (!deleted) {
      return sendError(res, 404, 'NOT_FOUND', 'Insight not found or unauthorized to delete');
    }

    return sendSuccess(res, { deletedId: id }, 'Wellbeing insight deleted successfully');
  } catch (error) {
    next(error);
  }
});

export default router;

