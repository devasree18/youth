import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { Conversation } from '../models/Conversation';

const router = express.Router();

router.post('/chat', authenticateToken, async (req: any, res) => {
  try {
    const { message } = req.body;

    // Fully mocked AI response since Gemini is disabled
    const mockReply = "Hi! I am currently a mock AI assistant. AI features are disabled at the moment, but I'm here to remind you that you have access to a great resource hub and professional counselors on this platform. If you need urgent help, please use the crisis button.";

    // Save to conversation history
    let conv = await Conversation.findOne({ userId: req.user.userId });
    if (!conv) {
      conv = new Conversation({ userId: req.user.userId, messages: [] });
    }
    conv.messages.push({ role: 'user', content: message, timestamp: new Date() });
    conv.messages.push({ role: 'ai', content: mockReply, timestamp: new Date() });
    await conv.save();

    res.json({ reply: mockReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

export default router;
