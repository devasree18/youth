import express from 'express';
import { z } from 'zod';
import { CrisisService } from '../services/CrisisService';
import { sendSuccess, sendError } from '../utils/response';

const router = express.Router();

const evaluateSchema = z.object({
  text: z.string().min(1, 'Text parameter is required')
});

router.get('/resources', (_req, res) => {
  return sendSuccess(res, CrisisService.EMERGENCY_RESOURCES, 'Emergency crisis resources retrieved');
});

router.post('/evaluate', (req, res) => {
  const parseResult = evaluateSchema.safeParse(req.body);
  if (!parseResult.success) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid evaluation input', parseResult.error.flatten().fieldErrors);
  }

  const result = CrisisService.evaluateText(parseResult.data.text);
  return sendSuccess(res, result, 'Crisis safety evaluation complete');
});

export default router;
