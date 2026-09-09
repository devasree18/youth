import express from 'express';
import { Resource } from '../models/Resource';
import { sendSuccess, sendError } from '../utils/response';
import mongoose from 'mongoose';

const router = express.Router();

export const DEFAULT_RESOURCES = [
  {
    title: 'Managing Exam Anxiety & Performance Pressure',
    category: 'Academic Stress',
    description: 'Evidence-based cognitive restructuring and grounding techniques for handling high-pressure college exam periods.',
    content: 'Exam anxiety is a common challenge for students. Key strategies include: 1) The 4-7-8 breathing technique to regulate heart rate. 2) Breaking study topics into 25-minute Pomodoro sessions. 3) Practicing active recall rather than passive re-reading. 4) Prioritizing 7-8 hours of sleep before exam days.',
    author: 'YOUTH Mental Health Team',
    readTimeMinutes: 5,
    tags: ['Exams', 'Anxiety', 'Study Tips']
  },
  {
    title: 'Sleep Hygiene Guide for University Students',
    category: 'Sleep & Health',
    description: 'Practical steps to reset your circadian rhythm and improve deep sleep quality amidst late-night study schedules.',
    content: 'Quality sleep directly impacts memory consolidation and emotional resilience. Steps to optimize sleep: 1) Dim blue light screens 45 minutes before sleep. 2) Keep your room cool (around 18-20°C). 3) Avoid heavy meals and caffeine after 4 PM. 4) Use your bed exclusively for sleep rather than studying.',
    author: 'Dr. Ananya Sharma',
    readTimeMinutes: 7,
    tags: ['Sleep', 'Habits', 'Wellness']
  },
  {
    title: 'Navigating Social Loneliness & Building Peer Support',
    category: 'Relationships',
    description: 'How to build genuine campus friendships, overcome social anxiety, and establish supportive peer circles.',
    content: 'Feeling isolated in college is more common than most realize. Guidance: 1) Join interest-based campus clubs or study groups. 2) Practice active listening in daily conversations. 3) Utilize YOUTH anonymous community boards to share thoughts safely. 4) Remember that vulnerability builds genuine connections.',
    author: 'YOUTH Counseling Network',
    readTimeMinutes: 6,
    tags: ['Social', 'Community', 'Relationships']
  }
];

router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let filtered = DEFAULT_RESOURCES;
      if (category) filtered = filtered.filter(r => r.category.toLowerCase() === (category as string).toLowerCase());
      if (search) filtered = filtered.filter(r => r.title.toLowerCase().includes((search as string).toLowerCase()));
      return sendSuccess(res, filtered, 'Resources retrieved');
    }

    const query: any = {};
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    let resources = await Resource.find(query).sort({ createdAt: -1 });

    if (resources.length === 0 && !category && !search) {
      await Resource.insertMany(DEFAULT_RESOURCES);
      resources = await Resource.find().sort({ createdAt: -1 });
    }

    return sendSuccess(res, resources, 'Resources retrieved');
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendSuccess(res, DEFAULT_RESOURCES[0], 'Resource retrieved');
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) return sendError(res, 404, 'NOT_FOUND', 'Resource article not found');

    return sendSuccess(res, resource, 'Resource retrieved');
  } catch (error) {
    next(error);
  }
});

export default router;
