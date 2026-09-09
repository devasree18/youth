import express from 'express';
import { Counselor } from '../models/Counselor';
import { sendSuccess, sendError } from '../utils/response';
import mongoose from 'mongoose';

const router = express.Router();

export const DEFAULT_COUNSELORS = [
  {
    name: 'Dr. Ananya Sharma',
    specialization: 'Student Anxiety & Exam Stress',
    qualifications: ['Ph.D. Clinical Psychology', 'M.Phil NIMHANS'],
    languages: ['English', 'Hindi'],
    consultationType: 'online',
    price: 0,
    currency: 'INR',
    rating: 4.9,
    reviewsCount: 38,
    description: 'Specializing in academic pressure, burnout prevention, and mindfulness-based stress reduction for university students.',
    verificationStatus: 'VERIFIED',
    availabilitySlots: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '11:00' },
      { dayOfWeek: 3, startTime: '14:00', endTime: '15:00' },
      { dayOfWeek: 5, startTime: '16:00', endTime: '17:00' }
    ]
  },
  {
    name: 'Rajesh Verma, M.Sc.',
    specialization: 'Career Transition & Peer Relationships',
    qualifications: ['M.Sc. Counseling Psychology', 'Certified CBT Practitioner'],
    languages: ['English', 'Hindi', 'Marathi'],
    consultationType: 'both',
    price: 0,
    currency: 'INR',
    rating: 4.8,
    reviewsCount: 29,
    description: 'Focusing on early career uncertainty, interpersonal communication, and building self-confidence.',
    verificationStatus: 'VERIFIED',
    availabilitySlots: [
      { dayOfWeek: 2, startTime: '11:00', endTime: '12:00' },
      { dayOfWeek: 4, startTime: '15:00', endTime: '16:00' }
    ]
  }
];

router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendSuccess(res, DEFAULT_COUNSELORS, 'Counselors list retrieved');
    }

    const { specialization, type, language } = req.query;
    const query: any = { verificationStatus: 'VERIFIED' };

    if (specialization) query.specialization = new RegExp(specialization as string, 'i');
    if (type) query.consultationType = type;
    if (language) query.languages = language;

    let counselors = await Counselor.find(query).sort({ rating: -1 });

    if (counselors.length === 0) {
      // Seed initial counselors if database is empty
      await Counselor.insertMany(DEFAULT_COUNSELORS);
      counselors = await Counselor.find(query).sort({ rating: -1 });
    }

    return sendSuccess(res, counselors, 'Counselors list retrieved');
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendSuccess(res, DEFAULT_COUNSELORS[0], 'Counselor details retrieved');
    }

    const counselor = await Counselor.findById(req.params.id);
    if (!counselor) return sendError(res, 404, 'NOT_FOUND', 'Counselor profile not found');

    return sendSuccess(res, counselor, 'Counselor profile retrieved');
  } catch (error) {
    next(error);
  }
});

export default router;
