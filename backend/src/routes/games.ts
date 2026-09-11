import express from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { GameSession, GameType } from '../models/GameSession';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { SignalEngineService } from '../services/SignalEngineService';

const router = express.Router();

const createSessionSchema = z.object({
  gameType: z.enum(['BREATHING_FLOW', 'FOCUS_TAP', 'MOOD_MATCH']),
  preCheckin: z.string().max(100).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const updateSessionSchema = z.object({
  status: z.enum(['COMPLETED', 'ABANDONED']).optional(),
  durationSeconds: z.number().min(0).max(7200).optional(),
  resultSummary: z.string().max(1000).optional(),
  accuracy: z.number().min(0).max(100).optional(),
  postCheckin: z.string().max(100).optional(),
  reflection: z
    .object({
      question: z.string().max(300).optional(),
      response: z.string().max(1000).optional(),
    })
    .optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// ── POST /api/v1/games/sessions ─────────────────────────────────────────────
// Start a new mindful reset session
router.post('/sessions', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const parseResult = createSessionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Invalid game session parameters',
        parseResult.error.flatten().fieldErrors
      );
    }

    const { gameType, preCheckin, metadata } = parseResult.data;

    const session = new GameSession({
      userId: req.user?.userId,
      tenantId: req.user?.tenantId,
      gameType,
      preCheckin,
      startedAt: new Date(),
      status: 'IN_PROGRESS',
      metadata: metadata || {},
    });

    await session.save();

    return sendSuccess(res, session, 'Game session started successfully', 201);
  } catch (error) {
    next(error);
  }
});

// ── PATCH /api/v1/games/sessions/:id ─────────────────────────────────────────
// Complete or update an in-progress game session with optional reflection & safe signals
router.patch('/sessions/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'INVALID_ID', 'Invalid session ID provided');
    }

    const parseResult = updateSessionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Invalid session update data',
        parseResult.error.flatten().fieldErrors
      );
    }

    // Only allow updating sessions belonging to the authenticated user
    const session = await GameSession.findOne({
      _id: id,
      userId: req.user?.userId,
    });

    if (!session) {
      return sendError(res, 404, 'NOT_FOUND', 'Game session not found or unauthorized');
    }

    const { status, durationSeconds, resultSummary, accuracy, postCheckin, reflection, metadata } =
      parseResult.data;

    // Safety check on optional reflection text
    let crisisTriggered = false;
    let crisisEvaluation = null;
    if (reflection?.response) {
      const evaluation = SignalEngineService.evaluateReflectionSafety(reflection.response);
      if (evaluation.isCrisis) {
        crisisTriggered = true;
        crisisEvaluation = evaluation;
      }
    }

    if (status) {
      session.status = status;
      session.completedAt = new Date();
    }
    if (durationSeconds !== undefined) {
      session.durationSeconds = durationSeconds;
    }
    if (resultSummary !== undefined) {
      session.resultSummary = resultSummary;
    }
    if (accuracy !== undefined) {
      session.accuracy = accuracy;
    }
    if (postCheckin !== undefined) {
      session.postCheckin = postCheckin;
    }
    if (reflection && !crisisTriggered) {
      session.reflection = {
        question: reflection.question,
        response: reflection.response,
        savedAt: new Date(),
      };
    }
    if (metadata) {
      session.metadata = { ...session.metadata, ...metadata };
    }

    // Generate non-diagnostic supportive insight
    session.insight = SignalEngineService.generateSessionInsight(session);

    await session.save();

    // Process non-clinical wellbeing signals asynchronously
    if (session.status === 'COMPLETED') {
      await SignalEngineService.processGameSessionSignals(session);
    }

    return sendSuccess(
      res,
      {
        session,
        crisisAlert: crisisTriggered ? crisisEvaluation : null,
      },
      'Game session updated successfully'
    );
  } catch (error) {
    next(error);
  }
});

// ── GET /api/v1/games/sessions ──────────────────────────────────────────────
// Retrieve authenticated user's game sessions
router.get('/sessions', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 50);
    const gameType = req.query.gameType as GameType | undefined;

    const query: any = { userId: req.user?.userId };
    if (gameType && ['BREATHING_FLOW', 'FOCUS_TAP', 'MOOD_MATCH'].includes(gameType)) {
      query.gameType = gameType;
    }

    const sessions = await GameSession.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return sendSuccess(res, sessions, 'Game sessions retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// ── GET /api/v1/games/summary ───────────────────────────────────────────────
// Get user's aggregated mindful reset summary
router.get('/summary', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, 401, 'UNAUTHORIZED', 'User not authenticated');
    }

    const completedSessions = await GameSession.find({
      userId,
      status: 'COMPLETED',
    }).sort({ createdAt: -1 });

    const totalSessions = completedSessions.length;
    const totalDurationSeconds = completedSessions.reduce(
      (acc, s) => acc + (s.durationSeconds || 0),
      0
    );
    const totalMinutes = Math.round(totalDurationSeconds / 60);

    const gameCounts: Record<string, number> = {};
    for (const session of completedSessions) {
      gameCounts[session.gameType] = (gameCounts[session.gameType] || 0) + 1;
    }

    let favoriteGame = 'BREATHING_FLOW';
    let maxCount = 0;
    for (const [game, count] of Object.entries(gameCounts)) {
      if (count > maxCount) {
        maxCount = count;
        favoriteGame = game;
      }
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyResetCount = completedSessions.filter(
      (s) => new Date(s.createdAt) >= sevenDaysAgo
    ).length;

    const summaryData = {
      totalSessions,
      totalDurationSeconds,
      totalMinutes,
      favoriteGame,
      weeklyResetCount,
      recentSessions: completedSessions.slice(0, 5),
    };

    return sendSuccess(res, summaryData, 'Game summary retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// ── GET /api/v1/games/patterns ──────────────────────────────────────────────
// Get non-diagnostic pattern insights & dynamic recommendations
router.get('/patterns', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, 401, 'UNAUTHORIZED', 'User not authenticated');
    }

    const patterns = await SignalEngineService.getUserPatterns(userId);
    const recommendations = await SignalEngineService.getDynamicRecommendations(userId);

    return sendSuccess(
      res,
      {
        patterns,
        recommendations,
      },
      'Personal wellbeing patterns retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
});

// ── DELETE /api/v1/games/sessions/:id ────────────────────────────────────────
// Delete a game session and associated signals (Student Data Control)
router.delete('/sessions/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'INVALID_ID', 'Invalid session ID provided');
    }

    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, 401, 'UNAUTHORIZED', 'User not authenticated');
    }

    const deleted = await SignalEngineService.deleteGameSessionAndSignals(id, userId);

    if (!deleted) {
      return sendError(res, 404, 'NOT_FOUND', 'Session not found or unauthorized to delete');
    }

    return sendSuccess(res, { deletedId: id }, 'Game session and associated signals removed successfully');
  } catch (error) {
    next(error);
  }
});

export default router;
