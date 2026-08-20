import express from 'express';
import { Subscription } from '../models/Subscription';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { plan } = req.body;
    
    // In a real app, this would integrate with a payment gateway (Stripe/Razorpay)
    // For now, we'll just create the subscription directly.
    const sub = new Subscription({
      userId: req.user.userId,
      plan,
      status: 'active'
    });
    
    await sub.save();
    res.status(201).json(sub);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

router.get('/current', authenticateToken, async (req: any, res) => {
  try {
    const sub = await Subscription.findOne({ userId: req.user.userId, status: 'active' });
    if (!sub) return res.status(404).json({ error: 'No active subscription found' });
    res.json(sub);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

export default router;
