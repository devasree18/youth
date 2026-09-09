import express from 'express';
import { z } from 'zod';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { AIService } from '../services/AIService';
import { Conversation } from '../models/Conversation';
import { sendSuccess, sendError } from '../utils/response';

const router = express.Router();

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message exceeds 2000 characters limit')
});

router.post('/chat', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid message input', parseResult.error.flatten().fieldErrors);
    }

    const { message } = parseResult.data;
    const aiResponse = await AIService.processChat(req.user!.userId, message, req.user!.tenantId);

    return sendSuccess(res, aiResponse, 'AI response generated successfully');
  } catch (error) {
    next(error);
  }
});

router.get('/history', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const conv = await Conversation.findOne({ userId: req.user!.userId }).sort({ updatedAt: -1 });
    return sendSuccess(res, conv ? conv.messages : [], 'Conversation history retrieved');
  } catch (error) {
    next(error);
  }
});

export default router;
