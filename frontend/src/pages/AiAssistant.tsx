import { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Send, Bot, User, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../api/apiClient';

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

interface AIChatApiResponse {
  reply: string;
  isCrisisIntercepted: boolean;
  providerStatus: 'LIVE' | 'BLOCKED';
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
        const res = await apiClient.get<any[]>('/ai/history');
        if (res.data && res.data.length > 0) {
          const formatted = res.data.map(m => ({
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
      const res = await apiClient.post<AIChatApiResponse>('/ai/chat', { message: userText });
      if (res.data) {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'ai', 
            text: res.data!.reply, 
            isCrisis: res.data!.isCrisisIntercepted 
          }
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'ai', 
          text: "Sorry, I'm having trouble connecting to the server. Please try again later." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-full mr-2 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900 flex items-center">
                <Bot className="w-5 h-5 text-indigo-600 mr-2" />
                AI Support Assistant
              </h1>
              <p className="text-xs text-slate-500">24/7 Wellness Companion & Guide</p>
            </div>
          </div>

          <Link to="/crisis" className="flex items-center text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full border border-red-200 transition-colors">
            <ShieldAlert className="w-4 h-4 mr-1" />
            Crisis Help
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden bg-white shadow-sm border-slate-200 h-[calc(100vh-140px)] rounded-3xl">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start text-amber-900 text-xs leading-relaxed">
              <div className="font-bold mr-2 flex-shrink-0">⚠️ Safety Notice:</div>
              <p>YOUTH AI Assistant provides supportive guidance and resources. It is not a clinical therapist or emergency care. If you need immediate distress support, please use the <strong>Crisis Help</strong> button above.</p>
            </div>

            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      m.role === 'user' ? 'bg-indigo-100 text-indigo-700 ml-3' : 'bg-slate-900 text-white mr-3'
                    }`}>
                      {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      m.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : m.isCrisis
                        ? 'bg-red-50 text-red-900 border-2 border-red-200 rounded-tl-none font-medium'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed text-sm">{m.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex items-center bg-slate-100 rounded-2xl rounded-tl-none p-4 space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTED_PROMPTS.map(prompt => (
                <button 
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
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
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button type="submit" variant="primary" disabled={isLoading || !input.trim()} className="rounded-full w-12 h-12 p-0 flex items-center justify-center flex-shrink-0 bg-slate-900 hover:bg-slate-800">
                <Send className="w-5 h-5 ml-1" />
              </Button>
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AiAssistant;
