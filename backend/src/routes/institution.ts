import express from 'express';
import { User } from '../models/User';
import { Assessment } from '../models/Assessment';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Middleware to check institution role
const requireInstitution = async (req: any, res: any, next: any) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'institution') {
      return res.status(403).json({ error: 'Institution access required' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Authorization error' });
  }
};

router.get('/stats', authenticateToken, requireInstitution, async (req, res) => {
  try {
    // In a real app, this would be scoped to students belonging to this institution
    const totalStudents = await User.countDocuments({ role: 'student' });
    const assessmentCount = await Assessment.countDocuments();
    
    res.json({
      activeStudents: totalStudents,
      checkInParticipation: assessmentCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch institution stats' });
  }
});

export default router;
