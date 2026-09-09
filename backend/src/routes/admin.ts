import express, { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Institution } from '../models/Institution';
import { Counselor } from '../models/Counselor';
import { AssessmentResult } from '../models/AssessmentResult';
import { AuditLog } from '../models/AuditLog';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireRole, requirePermission } from '../middleware/rbac';
import { sendSuccess, sendError } from '../utils/response';
import { AuditService } from '../services/AuditService';
import mongoose from 'mongoose';

const router = express.Router();

const adminGuard = [
  authenticateToken, 
  requireRole(['ADMIN', 'SUPER_ADMIN', 'admin']),
  requirePermission('system.manage')
];

router.get('/stats', adminGuard, async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendSuccess(res, {
        totalUsers: 1250,
        totalInstitutions: 14,
        activeCounselors: 8,
        totalAssessments: 3420
      }, 'Admin statistics retrieved (demo mode)');
    }

    const totalUsers = await User.countDocuments();
    const totalInstitutions = await Institution.countDocuments();
    const activeCounselors = await Counselor.countDocuments({ verificationStatus: 'VERIFIED' });
    const totalAssessments = await AssessmentResult.countDocuments();

    return sendSuccess(res, {
      totalUsers,
      totalInstitutions,
      activeCounselors,
      totalAssessments
    }, 'Admin statistics retrieved');
  } catch (error) {
    next(error);
  }
});

router.get('/audit-logs', adminGuard, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendSuccess(res, [], 'Audit logs retrieved');
    }

    const page = Math.max(parseInt(req.query.page as string || '1', 10), 1);
    const limit = Math.min(parseInt(req.query.limit as string || '50', 10), 100);

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await AuditLog.countDocuments();

    return sendSuccess(res, logs, 'Audit logs retrieved', 200, { page, limit, total });
  } catch (error) {
    next(error);
  }
});

router.get('/users', adminGuard, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendSuccess(res, [], 'Users directory retrieved');
    }

    const page = Math.max(parseInt(req.query.page as string || '1', 10), 1);
    const limit = Math.min(parseInt(req.query.limit as string || '30', 10), 100);

    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments();

    return sendSuccess(res, users, 'Users directory retrieved', 200, { page, limit, total });
  } catch (error) {
    next(error);
  }
});

router.patch('/users/:id/status', adminGuard, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { accountStatus } = req.body;
    if (!['ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'].includes(accountStatus)) {
      return sendError(res, 400, 'INVALID_STATUS', 'Account status must be ACTIVE, SUSPENDED, or PENDING_VERIFICATION');
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return sendError(res, 404, 'NOT_FOUND', 'Target user account not found');

    targetUser.accountStatus = accountStatus;
    await targetUser.save();

    await AuditService.logAction(
      'UPDATE_USER_ACCOUNT_STATUS',
      'User',
      req.user!.userId,
      req.user!.tenantId,
      targetUser._id.toString(),
      req.ip,
      req.headers['user-agent'],
      { newStatus: accountStatus }
    );

    return sendSuccess(res, {
      id: targetUser._id,
      email: targetUser.email,
      accountStatus: targetUser.accountStatus
    }, `User account status updated to ${accountStatus}`);
  } catch (error) {
    next(error);
  }
});

export default router;
