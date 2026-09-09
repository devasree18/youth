import { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService, type ChatMessage as ServiceChatMessage } from '../services/aiService';
import { AppShell } from '../components/layout/AppShell';

const SUGGESTED_PROMPTS = [
  "I'm feeling stressed about college exams.",
  "I'm having trouble sleeping at night.",
  "How can I manage daily anxiety?",
  "I need study techniques to prevent burnout."
];

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  isCrisis?: boolean;
}

const AiAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'ai', 
      text: "Hi there. I'm your YOUTH AI Wellness Companion. I'm here to listen, support, and help you discover stress management techniques. How are you feeling today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await aiService.getHistory();
        if (res.success && res.data && res.data.length > 0) {
          const formatted = res.data.map((m: ServiceChatMessage) => ({
            role: (m.role === 'assistant' || m.role === 'ai' ? 'ai' : 'user') as 'ai' | 'user',
            text: m.content,
            isCrisis: m.isCrisisIntercepted
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
    if (!text.trim()) return;
    
    const userText = text.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await aiService.sendMessage(userText);
      if (res.success && res.data) {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'ai', 
            text: res.data!.reply, 
            isCrisis: res.data!.isCrisisIntercepted 
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'ai', 
            text: "I'm available to help support your wellbeing goals. How else can I assist you?" 
          }
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'ai', 
          text: "I am having trouble connecting right now. If you are experiencing a crisis, please reach out to our Tele-MANAS hotline at 14416." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell title="Safe AI Companion" subtitle="Confidential 24/7 wellness dialogue & coping strategies">
      <div className="max-w-4xl mx-auto h-[calc(85vh-120px)] flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden bg-white shadow-sm border-slate-200/80 rounded-3xl">
          
          {/* Safety Notice Banner */}
          <div className="bg-amber-50/80 border-b border-amber-200/70 p-3.5 px-6 flex items-center space-x-2 text-amber-900 text-xs">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <p className="leading-snug">
              <strong>Private & Confidential:</strong> YOUTH AI Assistant provides supportive guidance & techniques. It is not emergency medical care. If you need urgent distress support, use the <strong>24/7 Crisis</strong> button.
            </p>
          </div>

          {/* Messages Scroll Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5">
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      m.role === 'user' ? 'bg-blue-600 text-white ml-3 shadow-sm' : 'bg-slate-900 text-white mr-3 shadow-sm'
                    }`}>
                      {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs sm:text-sm ${
                      m.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-sm font-medium' 
                        : m.isCrisis
                        ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-none font-semibold'
                        : 'bg-slate-100/80 text-slate-800 rounded-tl-none border border-slate-200/60'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex items-center bg-slate-100 rounded-2xl rounded-tl-none p-4 space-x-2 border border-slate-200/60">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggested Prompts & Input Controls */}
          <div className="p-4 bg-white border-t border-slate-100 space-y-3">
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map(prompt => (
                <button 
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors font-semibold"
                >
                  {prompt}
                </button>
              ))}
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isLoading || !input.trim()} 
                className="rounded-2xl px-5 flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

        </Card>
      </div>
    </AppShell>
  );
};

export default AiAssistant;

