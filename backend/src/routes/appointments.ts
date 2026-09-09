import express from 'express';
import { z } from 'zod';
import { Appointment } from '../models/Appointment';
import { Counselor } from '../models/Counselor';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';

const router = express.Router();

const bookAppointmentSchema = z.object({
  counselorId: z.string(),
  scheduledAt: z.string().datetime('Scheduled date must be an ISO date string'),
  consultationType: z.enum(['online', 'in_person']).default('online'),
  notes: z.string().max(500).optional()
});

router.post('/book', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const parseResult = bookAppointmentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid booking parameters', parseResult.error.flatten().fieldErrors);
    }

    const { counselorId, scheduledAt, consultationType, notes } = parseResult.data;
    const scheduledDate = new Date(scheduledAt);

    if (scheduledDate <= new Date()) {
      return sendError(res, 400, 'INVALID_SCHEDULE_TIME', 'Appointment time must be in the future.');
    }

    // Check if counselor exists
    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
      return sendError(res, 404, 'COUNSELOR_NOT_FOUND', 'Selected counselor does not exist.');
    }

    // Conflict prevention check: Check if appointment slot is already taken
    const existingConflict = await Appointment.findOne({
      counselorId,
      scheduledAt: scheduledDate,
      status: { $in: ['PENDING', 'CONFIRMED'] }
    });

    if (existingConflict) {
      return sendError(res, 409, 'SLOT_UNAVAILABLE', 'This time slot has already been booked. Please select another slot.');
    }

    const appointment = new Appointment({
      counselorId,
      studentId: req.user!.userId,
      tenantId: req.user!.tenantId,
      scheduledAt: scheduledDate,
      consultationType,
      notes,
      status: 'CONFIRMED'
    });

    await appointment.save();

    return sendSuccess(res, appointment, 'Appointment booked successfully', 201);
  } catch (error: any) {
    if (error.code === 11000) {
      return sendError(res, 409, 'SLOT_UNAVAILABLE', 'This time slot has already been booked by another user.');
    }
    next(error);
  }
});

router.get('/my', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const appointments = await Appointment.find({ studentId: req.user!.userId })
      .populate('counselorId', 'name specialization avatarUrl rating')
      .sort({ scheduledAt: 1 });

    return sendSuccess(res, appointments, 'Appointments retrieved');
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { status, cancellationReason } = req.body;
    if (!['CANCELLED', 'COMPLETED'].includes(status)) {
      return sendError(res, 400, 'INVALID_STATUS', 'Status can only be updated to CANCELLED or COMPLETED');
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      $or: [{ studentId: req.user!.userId }, { counselorId: req.user!.userId }]
    });

    if (!appointment) {
      return sendError(res, 404, 'NOT_FOUND', 'Appointment not found or unauthorized');
    }

    appointment.status = status;
    if (cancellationReason) appointment.cancellationReason = cancellationReason;

    await appointment.save();

    return sendSuccess(res, appointment, `Appointment status updated to ${status}`);
  } catch (error) {
    next(error);
  }
});

export default router;
