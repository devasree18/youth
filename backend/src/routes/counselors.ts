import express from 'express';
import { Counselor } from '../models/Counselor';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { specialization, type } = req.query;
    let query: any = {};
    if (specialization) query.specialization = specialization;
    if (type) query.consultationType = type;
    
    const counselors = await Counselor.find(query).sort({ createdAt: -1 });
    res.json(counselors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch counselors' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const counselor = await Counselor.findById(req.params.id);
    if (!counselor) return res.status(404).json({ error: 'Counselor not found' });
    res.json(counselor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch counselor' });
  }
});

export default router;
