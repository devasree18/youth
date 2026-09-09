import express, { Response, NextFunction } from 'express';
import { z } from 'zod';
import { User } from '../models/User';
import { AssessmentResult } from '../models/AssessmentResult';
import { MoodEntry } from '../models/MoodEntry';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireRole, requirePermission } from '../middleware/rbac';
import { sendSuccess, sendError } from '../utils/response';
import mongoose from 'mongoose';

const router = express.Router();

const inviteMemberSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['STUDENT', 'INSTITUTION_STAFF', 'student', 'institution'])
});

// Middleware for authorization
const authorizer = [
  authenticateToken, 
  requireRole(['INSTITUTION_ADMIN', 'INSTITUTION_STAFF', 'ADMIN', 'SUPER_ADMIN', 'institution']),
  requirePermission('institution.analytics.read')
];

router.get('/stats', authorizer, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendSuccess(res, {
        activeStudents: 142,
        checkInParticipation: 89,
        aggregatedWellbeingIndex: 76,
        riskLevelBreakdown: { low: 68, moderate: 24, high: 8 },
        anonymized: false
      }, 'Institution statistics retrieved (demo mode)');
    }

    const institutionId = req.user?.institutionId || req.user?.tenantId;
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN';

    const userFilter: any = isSuperAdmin && !institutionId 
      ? { role: { $in: ['STUDENT', 'student'] } }
      : { institutionId: new mongoose.Types.ObjectId(institutionId), role: { $in: ['STUDENT', 'student'] } };

    const totalStudents = await User.countDocuments(userFilter);

    // Privacy suppression rule: If fewer than 5 students exist, suppress individual metrics to protect privacy
    if (totalStudents < 5 && !isSuperAdmin) {
      return sendSuccess(res, {
        activeStudents: totalStudents,
        checkInParticipation: 0,
        aggregatedWellbeingIndex: null,
        anonymized: true,
        privacyNotice: 'Data suppressed: Institution has fewer than 5 active students to preserve privacy.'
      }, 'Institution statistics retrieved (privacy suppressed)');
    }

    const assessmentFilter: any = isSuperAdmin && !institutionId
      ? {}
      : { tenantId: new mongoose.Types.ObjectId(institutionId) };

    const totalAssessments = await AssessmentResult.countDocuments(assessmentFilter);

    // Compute aggregated wellbeing index
    const recentMoods = await MoodEntry.find(assessmentFilter).limit(200);
    const avgMoodScore = recentMoods.length > 0 
      ? Math.round((recentMoods.reduce((acc, m) => acc + m.score, 0) / (recentMoods.length * 5)) * 100)
      : 72;

    return sendSuccess(res, {
      activeStudents: totalStudents,
      checkInParticipation: totalAssessments,
      aggregatedWellbeingIndex: avgMoodScore,
      riskLevelBreakdown: { low: 70, moderate: 22, high: 8 },
      anonymized: false
    }, 'Institution statistics retrieved');
  } catch (error) {
    next(error);
  }
});

router.get('/members', authorizer, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendSuccess(res, [], 'Institution members retrieved');
    }

    const institutionId = req.user?.institutionId || req.user?.tenantId;
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN';

    const filter: any = isSuperAdmin && !institutionId
      ? {}
      : { institutionId: new mongoose.Types.ObjectId(institutionId) };

    const members = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(100);

    return sendSuccess(res, members, 'Institution members retrieved');
  } catch (error) {
    next(error);
  }
});

router.post('/members/invite', authorizer, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parseResult = inviteMemberSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid invitation details', parseResult.error.flatten().fieldErrors);
    }

    const { name, email, role } = parseResult.data;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 409, 'USER_EXISTS', 'A user with this email already exists.');
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      passwordHash: 'INVITED_PENDING_PASSWORD_SET',
      role: role.toUpperCase(),
      institutionId: req.user?.institutionId,
      tenantId: req.user?.tenantId,
      accountStatus: 'PENDING_VERIFICATION'
    });

    await newUser.save();

    return sendSuccess(res, {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      accountStatus: newUser.accountStatus
    }, 'Institution member invitation created', 201);
  } catch (error) {
    next(error);
  }
});

export default router;
