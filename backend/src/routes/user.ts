import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { User } from '../models/User';

const router = express.Router();

router.get('/me', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
