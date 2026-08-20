import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { authenticateToken } from '../middleware/auth';
import { Conversation } from '../models/Conversation';

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

router.post('/chat', authenticateToken, async (req: any, res) => {
  try {
    const { message } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ reply: "I'm a mock AI assistant since the GEMINI_API_KEY is not configured. Remember that I am here to help you find resources, but I am not a substitute for professional care." });
    }

    const systemInstruction = `You are a supportive, respectful, non-judgmental AI mental health assistant for college students. 
Your primary goal is to encourage healthy coping and recommend appropriate resources. 
RULES:
1. DO NOT diagnose.
2. DO NOT claim to be a therapist or doctor.
3. DO NOT replace professional care.
4. If a user expresses high risk (self-harm, severe crisis), strongly encourage them to seek professional help and guide them to use the 'Need urgent help?' button for immediate crisis resources.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${systemInstruction}\n\nUser: ${message}`,
    });

    // Save to conversation history (basic implementation for now)
    let conv = await Conversation.findOne({ userId: req.user.userId });
    if (!conv) {
      conv = new Conversation({ userId: req.user.userId, messages: [] });
    }
    conv.messages.push({ role: 'user', content: message, timestamp: new Date() });
    conv.messages.push({ role: 'ai', content: response.text || '', timestamp: new Date() });
    await conv.save();

    res.json({ reply: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

export default router;
