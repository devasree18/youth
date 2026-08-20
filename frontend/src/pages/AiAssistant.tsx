import { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Send, Bot, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED_PROMPTS = [
  "I'm feeling stressed about college.",
  "I'm having trouble sleeping.",
  "I feel lonely.",
  "How can I manage exam stress?"
];

const AiAssistant = () => {
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: "Hi there. I'm your AI Support Assistant. I'm here to listen and help you find useful resources. How are you feeling today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || "I'm sorry, I couldn't process that right now." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting to the server. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-full mr-2 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900 flex items-center">
                <Bot className="w-5 h-5 text-accent-600 mr-2" />
                AI Support Assistant
              </h1>
              <p className="text-xs text-slate-500">I'm here to listen and help</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden bg-white shadow-sm border-slate-200 h-[calc(100vh-140px)]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start text-blue-800 text-sm">
              <div className="font-semibold mr-2 flex-shrink-0">Note:</div>
              <p>I am an AI assistant designed to provide support and resources. I am not a medical professional or therapist. If you are in crisis, please use the <strong>Need urgent help?</strong> button on the dashboard.</p>
            </div>

            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      m.role === 'user' ? 'bg-primary-100 text-primary-700 ml-3' : 'bg-accent-100 text-accent-700 mr-3'
                    }`}>
                      {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      m.role === 'user' 
                        ? 'bg-primary-600 text-white rounded-tr-none' 
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
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
                  className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors"
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
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button type="submit" variant="primary" disabled={isLoading || !input.trim()} className="rounded-full w-12 h-12 p-0 flex items-center justify-center flex-shrink-0">
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
