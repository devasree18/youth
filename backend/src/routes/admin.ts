import express from 'express';
import { User } from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Middleware to check admin role
const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Authorization error' });
  }
};

router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    // In a real app, you'd aggregate more metrics here
    res.json({ totalUsers: userCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

export default router;
