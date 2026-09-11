import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Send, Bot, User, ShieldAlert } from 'lucide-react';
import { aiService, type ChatMessage as ServiceChatMessage } from '../services/aiService';
import { AppShell } from '../components/layout/AppShell';
import { fadeUpVariants } from '../lib/motion';

const SUGGESTED_PROMPTS = [
  'I am feeling overwhelmed with impending exams.',
  'Can you suggest techniques to improve sleep quality?',
  'How do I handle academic burnout and stay motivated?',
  'Give me a 3-minute calming breathing exercise.',
];

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  isCrisis?: boolean;
}

export const AiAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      text: 'Hello. I am your confidential AI Wellness Companion. I am here to help you reflect on stress, practice calming techniques, or discuss academic wellness. What is on your mind today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await aiService.getHistory();
        if (res.success && res.data && res.data.length > 0) {
          const formatted = res.data.map((m: ServiceChatMessage) => ({
            role: (m.role === 'assistant' || m.role === 'ai' ? 'ai' : 'user') as 'ai' | 'user',
            text: m.content,
            isCrisis: m.isCrisisIntercepted,
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    fetchHistory();
  }, []);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userText = text.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await aiService.sendMessage(userText);
      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: res.data!.reply,
            isCrisis: res.data!.isCrisisIntercepted,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: 'I am here to support your wellbeing goals. How else can I assist you?',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'I am currently unable to reach the knowledge network. If you are experiencing urgent distress, please dial Tele-MANAS at 14416 or KIRAN at 1800-599-0019 immediately.',
          isCrisis: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppShell
      title="AI Wellness Companion"
      subtitle="Confidential conversational guidance with automated crisis detection"
    >
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-13rem)] min-h-[460px]">
        {/* Chat message history container */}
        <Card className="flex-1 flex flex-col overflow-hidden p-0 bg-white shadow-xs border-slate-200/90 rounded-2xl min-h-0">
          {/* Messages list */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4">
            {messages.map((msg, idx) => {
              const isAi = msg.role === 'ai';
              return (
                <motion.div
                  key={idx}
                  variants={fadeUpVariants}
                  initial="initial"
                  animate="animate"
                  className={`flex items-start space-x-2.5 sm:space-x-3 ${
                    isAi ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                      isAi
                        ? 'bg-slate-50/90 border border-slate-200/80 text-[#111827]'
                        : 'bg-[#111827] text-white font-normal'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                    {msg.isCrisis && (
                      <div className="mt-3 pt-3 border-t border-rose-200 bg-rose-50 -mx-3.5 sm:-mx-4 -mb-3.5 sm:-mb-4 p-3 rounded-b-2xl text-xs text-rose-950 flex flex-col gap-1.5">
                        <div className="flex items-center space-x-1.5 font-bold text-rose-700">
                          <ShieldAlert className="w-4 h-4" />
                          <span>Emergency Helpline Interception</span>
                        </div>
                        <p className="text-[11px] text-rose-900 leading-relaxed">
                          Our safety filters detected elevated distress. Please reach out to licensed counselors immediately:
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <a
                            href="tel:14416"
                            className="bg-white border border-rose-300 text-rose-700 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-rose-100 transition-colors min-h-[36px] flex items-center"
                          >
                            Tele-MANAS (14416)
                          </a>
                          <a
                            href="tel:18005990019"
                            className="bg-white border border-rose-300 text-rose-700 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-rose-100 transition-colors min-h-[36px] flex items-center"
                          >
                            KIRAN (1800-599-0019)
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-2xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              );
            })}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start space-x-2.5 sm:space-x-3"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center space-x-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse [animation-delay:0.4s]" />
                  <span className="text-[11px] font-medium ml-1 text-slate-600">Reflecting...</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Starter Prompts */}
          <div className="px-3 sm:px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center space-x-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
              Suggested:
            </span>
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] font-medium bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 px-3 py-1.5 rounded-full shrink-0 transition-colors cursor-pointer min-h-[32px]"
              >
                {prompt}
              </motion.button>
            ))}
          </div>

          {/* Input Box Footer */}
          <div className="p-2.5 sm:p-4 border-t border-slate-200/80 bg-white">
            <div className="flex items-end space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share what is on your mind..."
                rows={1}
                className="flex-1 max-h-28 min-h-[44px] bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm text-[#111827] placeholder:text-slate-400 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none transition-all"
              />
              <Button
                variant="primary"
                size="default"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="min-h-[44px] h-11 px-4 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Conversations are confidential. AI guidance supports reflection and does not replace medical advice.
            </p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
};

export default AiAssistant;

