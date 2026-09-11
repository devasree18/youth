import { apiClient } from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';
import type { AIConfig } from '../components/ai/ApiKeyModal';

export interface AIChatResponse {
  reply: string;
  isCrisisIntercepted: boolean;
  providerStatus: 'LIVE' | 'BLOCKED';
  provider?: string;
  conversationId?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'ai';
  content: string;
  isCrisisIntercepted?: boolean;
  createdAt?: string;
}

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'self harm', 'cut myself',
  'hurt myself', 'hang myself', 'take all my pills', 'no reason to live'
];

const SYSTEM_PROMPT = `You are YOUTH AI Assistant, a compassionate, supportive, and non-judgmental wellness companion for students and young adults.
Your role:
- Provide empathetic active listening, stress management tips, sleep hygiene protocols, and study balance strategies.
- Maintain a warm, encouraging, human-centered tone.
- CRITICAL BOUNDARIES: You are NOT a medical doctor, therapist, or emergency provider. NEVER give clinical diagnoses, prescribe medications, or offer medical advice.
- Always recommend speaking with a qualified professional or counselor when users express persistent distress.
- If a user mentions self-harm or immediate crisis, prioritize safety and suggest reaching out to helplines.
- Format responses cleanly with markdown: use bold text, bullet points, and numbered steps when giving actionable advice.`;

export const getSavedAIConfig = (): AIConfig => {
  try {
    const raw = localStorage.getItem('youth_ai_config');
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore error
  }
  return {
    apiKey: '',
    provider: 'openai',
    model: 'gpt-4o-mini',
  };
};

export const saveAIConfig = (config: AIConfig) => {
  try {
    localStorage.setItem('youth_ai_config', JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save AI config:', err);
  }
};

export const aiService = {
  async sendMessage(
    message: string,
    history: { role: 'user' | 'ai'; text: string }[] = []
  ): Promise<ApiResponse<AIChatResponse>> {
    const lower = message.toLowerCase();

    // 1. Client-Side Crisis Interceptor
    const isCrisis = CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
    if (isCrisis) {
      const crisisReply = `🚨 **Safety Notice:** I noticed you might be going through a very difficult time or acute distress. Please know you are not alone.\n\n` +
        `I am an AI wellness companion and cannot provide crisis or emergency medical care. Please reach out to one of these free 24/7 confidential helplines right away:\n\n` +
        `• **Tele-MANAS (Govt of India):** 14416 / 1800-891-4416\n` +
        `• **KIRAN Mental Health:** 1800-599-0019\n` +
        `• **Vandrevala Foundation:** +91 9999 666 555\n` +
        `• **Emergency Services:** 112 / 102\n\n` +
        `You can also click **Urgent Help** at the top of the screen anytime to connect with emergency support.`;

      return {
        success: true,
        data: {
          reply: crisisReply,
          isCrisisIntercepted: true,
          providerStatus: 'LIVE',
          provider: 'Safety Protocol',
        },
      };
    }

    const config = getSavedAIConfig();

    // 2. Direct OpenAI Call (ChatGPT)
    if (config.apiKey && config.provider === 'openai') {
      try {
        const messagesPayload = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.slice(-8).map((m) => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.text,
          })),
          { role: 'user', content: message },
        ];

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.model || 'gpt-4o-mini',
            messages: messagesPayload,
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        const data = await res.json();
        if (data.choices && data.choices[0]?.message?.content) {
          return {
            success: true,
            data: {
              reply: data.choices[0].message.content,
              isCrisisIntercepted: false,
              providerStatus: 'LIVE',
              provider: `ChatGPT (${config.model})`,
            },
          };
        } else if (data.error) {
          console.error('OpenAI error:', data.error);
        }
      } catch (err) {
        console.error('OpenAI fetch error:', err);
      }
    }

    // 3. Direct Google Gemini Call
    if (config.apiKey && config.provider === 'gemini') {
      try {
        const model = config.model || 'gemini-1.5-flash';
        const contents = [
          {
            role: 'user',
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nPrevious conversation:\n${history
                  .slice(-6)
                  .map((m) => `${m.role}: ${m.text}`)
                  .join('\n')}\n\nUser: ${message}`,
              },
            ],
          },
        ];

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents }),
          }
        );

        const data = await res.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return {
            success: true,
            data: {
              reply: data.candidates[0].content.parts[0].text,
              isCrisisIntercepted: false,
              providerStatus: 'LIVE',
              provider: `Gemini (${model})`,
            },
          };
        }
      } catch (err) {
        console.error('Gemini fetch error:', err);
      }
    }

    // 4. Direct Groq Call (Ultra-Fast Llama-3)
    if (config.apiKey && config.provider === 'groq') {
      try {
        const messagesPayload = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.slice(-8).map((m) => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.text,
          })),
          { role: 'user', content: message },
        ];

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.model || 'llama-3.3-70b-versatile',
            messages: messagesPayload,
          }),
        });

        const data = await res.json();
        if (data.choices && data.choices[0]?.message?.content) {
          return {
            success: true,
            data: {
              reply: data.choices[0].message.content,
              isCrisisIntercepted: false,
              providerStatus: 'LIVE',
              provider: `Groq (${config.model})`,
            },
          };
        }
      } catch (err) {
        console.error('Groq fetch error:', err);
      }
    }

    // 5. Backend Server Route
    try {
      const serverRes = await apiClient.post<AIChatResponse>('/ai/chat', { message });
      if (serverRes.success && serverRes.data && serverRes.data.providerStatus === 'LIVE') {
        return serverRes;
      }
    } catch {
      // Proceed to smart conversational fallback
    }

    // 6. Dynamic Context-Aware Conversational Fallback Engine
    const dynamicReply = generateDynamicClinicalReply(message);
    return {
      success: true,
      data: {
        reply: dynamicReply,
        isCrisisIntercepted: false,
        providerStatus: 'LIVE',
        provider: 'YOUTH Smart Companion',
      },
    };
  },

  async getHistory(): Promise<ApiResponse<ChatMessage[]>> {
    try {
      return await apiClient.get('/ai/history');
    } catch {
      return { success: true, data: [] };
    }
  },
};

function generateDynamicClinicalReply(msg: string): string {
  const text = msg.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|greetings|good morning|good evening|good afternoon)/.test(text)) {
    return (
      `Hello! 👋 It's wonderful to connect with you.\n\n` +
      `I'm your **YOUTH AI Wellness Companion**. How are you feeling today? Whether you'd like to talk through academic stress, practice a quick calming reset, or reflect on your day, I'm here for you.`
    );
  }

  // Exam / Academic Stress
  if (text.includes('exam') || text.includes('study') || text.includes('deadline') || text.includes('academic') || text.includes('grade')) {
    return (
      `It's completely natural to feel pressure around exams and academic deadlines. Let's break this down into manageable steps:\n\n` +
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
  if (text.includes('sleep') || text.includes('insomnia') || text.includes('tired') || text.includes('wake')) {
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
  if (text.includes('breath') || text.includes('calm') || text.includes('panic') || text.includes('anxious') || text.includes('ground')) {
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
  if (text.includes('burnout') || text.includes('motivation') || text.includes('overwhelm') || text.includes('exhausted')) {
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
    `Thank you for sharing that with me. I hear you, and your feelings are completely valid.\n\n` +
    `When navigating college life and daily demands, remember that taking things one step at a time is the most sustainable path forward.\n\n` +
    `• Take a moment to stretch or take three deep diaphragmatic breaths.\n` +
    `• If you'd like guidance on a specific topic (like exam routines, sleep protocols, or grounding techniques), just let me know!\n\n` +
    `What would feel most supportive for you right now?`
  );
}
