import express from 'express';
import { z } from 'zod';
import { AssessmentResult } from '../models/AssessmentResult';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';

const router = express.Router();

export const DEFAULT_ASSESSMENT_TEMPLATE = {
  code: 'WELLBEING_CHECKIN_V1',
  title: 'Comprehensive Student Wellbeing Check-in',
  description: 'A 5-question baseline assessment covering emotional state, stress management, sleep quality, and academic balance.',
  version: 1,
  questions: [
    {
      id: 'q1_mood',
      text: 'How would you describe your general mood over the past week?',
      options: [
        { label: 'Very low / Exhausted', value: 1 },
        { label: 'Somewhat stressed / Anxious', value: 2 },
        { label: 'Balanced / Okay', value: 3 },
        { label: 'Mostly positive', value: 4 },
        { label: 'Optimistic and energized', value: 5 }
      ]
    },
    {
      id: 'q2_sleep',
      text: 'How restful has your sleep been recently?',
      options: [
        { label: 'Severely disrupted (<4 hrs)', value: 1 },
        { label: 'Irregular or restless', value: 2 },
        { label: 'Moderate / Adequate', value: 3 },
        { label: 'Good quality sleep', value: 4 },
        { label: 'Consistently restful & refreshing', value: 5 }
      ]
    },
    {
      id: 'q3_stress',
      text: 'How well do you feel you are coping with current stress levels?',
      options: [
        { label: 'Overwhelmed / Unable to cope', value: 1 },
        { label: 'Struggling to keep up', value: 2 },
        { label: 'Managing with effort', value: 3 },
        { label: 'Coping well', value: 4 },
        { label: 'Thriving under pressure', value: 5 }
      ]
    },
    {
      id: 'q4_social',
      text: 'Do you feel supported by friends, family, or campus community?',
      options: [
        { label: 'Isolated / No support', value: 1 },
        { label: 'Rarely supported', value: 2 },
        { label: 'Sometimes supported', value: 3 },
        { label: 'Well supported', value: 4 },
        { label: 'Strong, supportive network', value: 5 }
      ]
    },
    {
      id: 'q5_focus',
      text: 'How would you rate your ability to concentrate on daily goals?',
      options: [
        { label: 'Extremely difficult', value: 1 },
        { label: 'Frequently distracted', value: 2 },
        { label: 'Moderate concentration', value: 3 },
        { label: 'Good focus', value: 4 },
        { label: 'Sharp and consistent focus', value: 5 }
      ]
    }
  ]
};

const submitAssessmentSchema = z.object({
  templateCode: z.string().default('WELLBEING_CHECKIN_V1'),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedValue: z.number().min(1).max(5)
  })).min(1, 'At least one answer is required')
});

router.get('/templates', (_req, res) => {
  return sendSuccess(res, [DEFAULT_ASSESSMENT_TEMPLATE], 'Assessment templates retrieved');
});

router.post(['/submit', '/'], authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const parseResult = submitAssessmentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid assessment submission', parseResult.error.flatten().fieldErrors);
    }

    const { templateCode, answers } = parseResult.data;

    // Calculate score
    const totalScore = answers.reduce((sum, a) => sum + a.selectedValue, 0);
    const maxPossibleScore = answers.length * 5;
    const normalizedScore = Math.round((totalScore / maxPossibleScore) * 100);

    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRISIS' = 'LOW';
    let interpretationLabel = 'Optimal Wellbeing';
    let summary = 'Your responses reflect strong coping mechanisms and high emotional balance.';
    let recommendations = [
      'Maintain your current healthy routines.',
      'Continue engaging with supportive social networks.'
    ];

    if (normalizedScore < 40) {
      riskLevel = 'HIGH';
      interpretationLabel = 'Elevated Stress / Needs Attention';
      summary = 'Your responses indicate significant stress and potential burnout risk.';
      recommendations = [
        'Consider scheduling a confidential session with a campus counselor.',
        'Prioritize rest and break down your workload into manageable steps.'
      ];
    } else if (normalizedScore < 70) {
      riskLevel = 'MODERATE';
      interpretationLabel = 'Moderate Stress / Balanced';
      summary = 'You are coping moderately well, but experiencing periodic stress.';
      recommendations = [
        'Practice daily 10-minute mindfulness or exercise sessions.',
        'Reach out to peers or mentors when feeling overwhelmed.'
      ];
    }

    const result = new AssessmentResult({
      userId: req.user?.userId,
      tenantId: req.user?.tenantId,
      templateCode,
      templateVersion: 1,
      answers,
      totalScore,
      maxPossibleScore,
      normalizedScore,
      riskLevel,
      interpretationLabel,
      summary,
      recommendations
    });

    await result.save();

    return sendSuccess(res, result, 'Assessment completed successfully', 201);
  } catch (error) {
    next(error);
  }
});

router.get(['/history', '/'], authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const results = await AssessmentResult.find({ userId: req.user?.userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return sendSuccess(res, results, 'Assessment history retrieved');
  } catch (error) {
    next(error);
  }
});

export default router;
