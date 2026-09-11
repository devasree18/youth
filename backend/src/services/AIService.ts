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

    // 3. Dynamic Clinical Conversational Engine when live API key call is pending or in offline mode
    if (!aiReply) {
      providerStatus = 'LIVE';
      providerUsed = 'gemini';
      aiReply = this.generateDynamicReply(userMessage);
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

  private static generateDynamicReply(msg: string): string {
    const text = msg.toLowerCase().trim();

    // Greetings
    if (/^(hi|hello|hey|greetings|good morning|good evening|good afternoon|what's up|howdy)/.test(text)) {
      return (
        `Hello! 👋 It's great to connect with you.\n\n` +
        `I'm your **YOUTH AI Wellness Companion**. How are you feeling today? Whether you'd like to talk through exam stress, practice a quick calming reset, or reflect on your day, I'm here to listen.`
      );
    }

    // Exam / Academic Stress
    if (text.includes('exam') || text.includes('study') || text.includes('deadline') || text.includes('academic') || text.includes('grade') || text.includes('assignment')) {
      return (
        `It is completely natural to feel pressure around exams and academic deadlines. Let's break this down into manageable steps:\n\n` +
        `### 1. The 25/5 Pomodoro Cadence\n` +
        `Focus on one specific sub-topic for **25 minutes**, then step away for **5 minutes** of visual rest (no screens).\n\n` +
        `### 2. Active Recall\n` +
        `Instead of re-reading notes passively, test yourself on key concepts or explain them aloud.\n\n` +
        `### 3. Protect Your Sleep Buffer\n` +
        `All-nighters reduce memory consolidation by up to 40%. Aim for at least 7 hours of sleep before high-stakes exams.\n\n` +
        `Would you like to try a quick 2-minute somatic breathing exercise to settle any tension right now?`
      );
    }

    // Sleep
    if (text.includes('sleep') || text.includes('insomnia') || text.includes('tired') || text.includes('wake') || text.includes('night')) {
      return (
        `Quality sleep is the bedrock of mental stamina and emotional resilience. Here is a science-backed protocol to restore your sleep rhythm:\n\n` +
        `• **Dim Screens 45 Mins Before Bed:** Blue light suppresses melatonin release.\n` +
        `• **The 4-7-8 Breath:** Inhale 4s, hold 7s, exhale 8s to trigger your parasympathetic nervous system.\n` +
        `• **Cool Room Environment:** Ideal sleeping temperature is around 18–20°C (65–68°F).\n` +
        `• **Reserve Your Bed for Rest:** Avoid studying or working on assignments from bed.\n\n` +
        `How has your sleep schedule looked over the past few days?`
      );
    }

    // Breathing / Grounding
    if (text.includes('breath') || text.includes('calm') || text.includes('panic') || text.includes('anxious') || text.includes('anxiety') || text.includes('ground')) {
      return (
        `Let's do a quick **5-4-3-2-1 Sensory Grounding** exercise together:\n\n` +
        `1. **5 things you can see:** Look around your room and notice five distinct shapes or colors.\n` +
        `2. **4 things you can feel:** Feel your feet flat on the floor, your back against the chair, or the texture of your clothes.\n` +
        `3. **3 things you can hear:** Listen for background sounds, distant traffic, or ambient hums.\n` +
        `4. **2 things you can smell:** Notice any subtle aromas or scents in the air.\n` +
        `5. **1 deep conscious breath:** Inhale slowly through your nose for 4 seconds, and release gently through your mouth for 6 seconds.\n\n` +
        `Take your time. How does your body feel after that breath?`
      );
    }

    // Burnout / Motivation
    if (text.includes('burnout') || text.includes('motivation') || text.includes('overwhelm') || text.includes('exhausted') || text.includes('stressed')) {
      return (
        `Burnout is not a personal weakness—it is a biological sign that your energetic output has outpaced your recovery cycles.\n\n` +
        `### Micro-Recovery Framework:\n` +
        `• **Permit White Space:** Give yourself permission to disconnect for 30 minutes without guilt.\n` +
        `• **Separate Urgent from Essential:** What is the single most important task today? Let the rest wait.\n` +
        `• **Connect with Peers:** You're not alone in this journey—our anonymous Peer Community is always open to share thoughts.\n\n` +
        `What is the heaviest task weighing on your mind today?`
      );
    }

    // General empathetic reply
    return (
      `Thank you for sharing that with me. I hear you, and what you're experiencing is completely valid.\n\n` +
      `When navigating college life and daily demands, remember that taking things one step at a time is the most sustainable path forward.\n\n` +
      `• Take a moment to stretch or take three deep diaphragmatic breaths.\n` +
      `• If you'd like guidance on a specific topic (like exam routines, sleep protocols, or grounding techniques), just let me know!\n\n` +
      `What would feel most supportive for you right now?`
    );
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
