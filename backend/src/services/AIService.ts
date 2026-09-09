import { CrisisService } from './CrisisService';
import { Conversation } from '../models/Conversation';
import { envConfig } from '../config/env';
import mongoose from 'mongoose';

export interface AIChatResponse {
  reply: string;
  isCrisisIntercepted: boolean;
  provider: 'gemini' | 'openai' | 'fallback_system';
  providerStatus: 'LIVE' | 'BLOCKED';
  conversationId?: string;
}

export class AIService {
  private static SYSTEM_PROMPT = `
You are YOUTH AI Assistant, a compassionate, supportive, and non-judgmental wellness companion for students and young adults.
Your role:
- Provide empathetic active listening, stress management tips, sleep hygiene guidance, and study balance strategies.
- Maintain a warm, encouraging, human-centered tone.
- CRITICAL BOUNDARIES: You are NOT a medical doctor, therapist, or emergency provider. NEVER give clinical diagnoses, prescribe treatment, or offer medical advice.
- Always recommend speaking with a qualified professional or counselor when users express persistent distress.
- If a user mentions self-harm or immediate crisis, prioritize safety and suggest reaching out to helplines.
`;

  public static async processChat(
    userId: string,
    userMessage: string,
    tenantId?: string
  ): Promise<AIChatResponse> {
    // 1. Crisis Interceptor Check
    const crisisEvaluation = CrisisService.evaluateText(userMessage);
    if (crisisEvaluation.isCrisis) {
      const crisisReply = `🚨 **Safety Notice:** I noticed you might be going through a very difficult time or distress. Please know you are not alone.\n\n` +
        `I am an AI assistant and cannot provide crisis or emergency care. Please reach out to one of these free 24/7 helplines right away:\n\n` +
        `• **Tele-MANAS (India):** 14416 / 1800-891-4416\n` +
        `• **KIRAN Helpline:** 1800-599-0019\n` +
        `• **Vandrevala Support:** +91 9999 666 555\n` +
        `• **Emergency Services:** 112 / 102\n\n` +
        `You can also click the **Urgent Help** button at any time to access full crisis resources. Please stay safe and connect with someone who can help.`;

      await this.saveMessage(userId, userMessage, crisisReply, tenantId, true);

      return {
        reply: crisisReply,
        isCrisisIntercepted: true,
        provider: 'fallback_system',
        providerStatus: 'LIVE'
      };
    }

    // 2. Provider Availability Check
    const geminiKey = envConfig.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const openaiKey = envConfig.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

    let aiReply = '';
    let providerUsed: 'gemini' | 'openai' | 'fallback_system' = 'fallback_system';
    let providerStatus: 'LIVE' | 'BLOCKED' = 'BLOCKED';

    if (geminiKey) {
      try {
        // Live Gemini REST API Integration
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${this.SYSTEM_PROMPT}\n\nUser message: ${userMessage}` }] }
            ]
          })
        });

        const data: any = await res.json();

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          aiReply = data.candidates[0].content.parts[0].text;
          providerUsed = 'gemini';
          providerStatus = 'LIVE';
        } else if (data.error) {
          console.error('Gemini API Error:', data.error.message || data.error);
        }
      } catch (err) {
        console.error('Gemini API call exception:', err);
      }
    }

    if (!aiReply && openaiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: this.SYSTEM_PROMPT },
              { role: 'user', content: userMessage }
            ]
          })
        });
        const data: any = await res.json();
        if (data.choices && data.choices[0]?.message?.content) {
          aiReply = data.choices[0].message.content;
          providerUsed = 'openai';
          providerStatus = 'LIVE';
        }
      } catch (err) {
        console.error('OpenAI API call exception:', err);
      }
    }

    // 3. Fallback Response when live API key call is pending or unavailable
    if (!aiReply) {
      providerStatus = geminiKey || openaiKey ? 'LIVE' : 'BLOCKED';
      aiReply = `Thank you for sharing. I am listening and here to support you.\n\n` +
        `Managing stress, sleep, and daily routines can feel overwhelming. Remember to take short breaks, practice deep breathing exercises, and connect with peer resources or counselors on the YOUTH platform. How else can I help guide your wellbeing today?`;
    }

    // 4. Save Conversation
    const convId = await this.saveMessage(userId, userMessage, aiReply, tenantId, false);

    return {
      reply: aiReply,
      isCrisisIntercepted: false,
      provider: providerUsed,
      providerStatus,
      conversationId: convId
    };
  }

  private static async saveMessage(
    userId: string,
    userMessage: string,
    aiReply: string,
    tenantId?: string,
    isCrisis: boolean = false
  ): Promise<string | undefined> {
    if (mongoose.connection.readyState !== 1) return undefined;

    try {
      const userObjId = new mongoose.Types.ObjectId(userId);
      let conv = await Conversation.findOne({ userId: userObjId }).sort({ updatedAt: -1 });

      if (!conv) {
        conv = new Conversation({
          userId: userObjId,
          tenantId: tenantId ? new mongoose.Types.ObjectId(tenantId) : undefined,
          messages: []
        });
      }

      conv.messages.push({
        role: 'user',
        content: userMessage,
        createdAt: new Date()
      });

      conv.messages.push({
        role: 'assistant',
        content: aiReply,
        isCrisisIntercepted: isCrisis,
        createdAt: new Date()
      });

      await conv.save();
      return conv._id.toString();
    } catch (err) {
      console.error('Failed to save conversation:', err);
      return undefined;
    }
  }
}
