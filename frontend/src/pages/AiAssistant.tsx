import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Send,
  Bot,
  User,
  ShieldAlert,
  Key,
  Copy,
  Check,
  PlusCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  aiService,
  getSavedAIConfig,
  saveAIConfig,
  type ChatMessage as ServiceChatMessage,
} from '../services/aiService';
import { AppShell } from '../components/layout/AppShell';
import { fadeUpVariants } from '../lib/motion';
import { ApiKeyModal, type AIConfig } from '../components/ai/ApiKeyModal';
import { MarkdownRenderer } from '../components/ai/MarkdownRenderer';

const SUGGESTED_PROMPTS = [
  'I am feeling overwhelmed with impending exams.',
  'Can you suggest techniques to improve sleep quality?',
  'How do I handle academic burnout and stay motivated?',
  'Give me a 3-minute calming breathing exercise.',
];

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  isCrisis?: boolean;
  provider?: string;
  timestamp: string;
}

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      text: "Hello! 👋 I'm your confidential **YOUTH AI Wellness Companion**.\n\nI can help you talk through academic stress, practice breathing protocols, or build healthier study and sleep routines. What's on your mind today?",
      provider: 'YOUTH Smart Companion',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState<AIConfig>(getSavedAIConfig());

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
          const formatted: ChatMessage[] = res.data.map((m: ServiceChatMessage, idx: number) => ({
            id: `hist-${idx}`,
            role: (m.role === 'assistant' || m.role === 'ai' ? 'ai' : 'user') as 'ai' | 'user',
            text: m.content,
            isCrisis: m.isCrisisIntercepted,
            timestamp: m.createdAt
              ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '',
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    fetchHistory();
  }, []);

  const handleSaveConfig = (newConfig: AIConfig) => {
    setAiConfig(newConfig);
    saveAIConfig(newConfig);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'ai',
        text: "New conversation started! ✨ I'm here to listen, support, and help guide your wellbeing. What would you like to explore?",
        provider: aiConfig.apiKey ? `${aiConfig.provider.toUpperCase()} (${aiConfig.model})` : 'YOUTH Smart Companion',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userText = text.trim();
    const userMsgId = Date.now().toString();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        role: 'user',
        text: userText,
        timestamp: timeStr,
      },
    ];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const historyContext = updatedMessages.map((m) => ({ role: m.role, text: m.text }));
      const res = await aiService.sendMessage(userText, historyContext);

      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: res.data!.reply,
            isCrisis: res.data!.isCrisisIntercepted,
            provider: res.data!.provider || (aiConfig.apiKey ? aiConfig.provider : 'YOUTH AI'),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: "I'm here to support your wellbeing goals. How else can I assist you today?",
            provider: 'YOUTH Smart Companion',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: 'I am currently unable to reach the knowledge network. If you are experiencing urgent distress, please dial Tele-MANAS at **14416** or KIRAN at **1800-599-0019** immediately.',
          isCrisis: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

  const isCustomKeyActive = Boolean(aiConfig.apiKey);

  return (
    <AppShell
      title="AI Wellness Companion"
      subtitle="Confidential real-time empathetic support & stress reflection"
    >
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100dvh-12.5rem)] min-h-[500px]">
        {/* Main Card Container */}
        <Card className="flex-1 flex flex-col overflow-hidden p-0 bg-white shadow-sm border-slate-200/90 rounded-3xl min-h-0">
          {/* Top Assistant Control Bar */}
          <div className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/80 backdrop-blur-xs flex items-center justify-between gap-2">
            {/* Model & Status Indicator */}
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    YOUTH AI Assistant
                  </h3>
                  <span
                    className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isCustomKeyActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        isCustomKeyActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    {isCustomKeyActive
                      ? `${aiConfig.provider.toUpperCase()}: ${aiConfig.model}`
                      : 'Smart Clinical Mode'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: API Key Config & New Chat */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setConfigModalOpen(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCustomKeyActive
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100/70'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="Configure custom ChatGPT / Gemini API Key"
              >
                <Key className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">
                  {isCustomKeyActive ? 'API Key Connected' : 'Use API Key'}
                </span>
                <span className="sm:hidden">Key</span>
              </button>

              <button
                onClick={handleNewChat}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 bg-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                title="Start a new chat session"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
            {messages.map((msg) => {
              const isAi = msg.role === 'ai';
              return (
                <motion.div
                  key={msg.id}
                  variants={fadeUpVariants}
                  initial="initial"
                  animate="animate"
                  className={`flex items-start space-x-3 ${
                    isAi ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/80 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                      isAi
                        ? 'bg-slate-50/95 border border-slate-200/80 text-slate-800'
                        : 'bg-[#111827] text-white font-normal'
                    }`}
                  >
                    {/* Header info / Provider tag for AI */}
                    {isAi && msg.provider && (
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <Zap className="w-3 h-3 text-emerald-600" />
                          {msg.provider}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                    )}

                    {/* Message text formatted with Markdown */}
                    {isAi ? (
                      <MarkdownRenderer content={msg.text} />
                    ) : (
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    )}

                    {/* Crisis Interception Alert */}
                    {msg.isCrisis && (
                      <div className="mt-3 pt-3 border-t border-rose-200 bg-rose-50 -mx-4 -mb-4 p-3.5 rounded-b-2xl text-xs text-rose-950 flex flex-col gap-2">
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
                            className="bg-white border border-rose-300 text-rose-700 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-rose-100 transition-colors min-h-[36px] flex items-center shadow-2xs"
                          >
                            Tele-MANAS (14416)
                          </a>
                          <a
                            href="tel:18005990019"
                            className="bg-white border border-rose-300 text-rose-700 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-rose-100 transition-colors min-h-[36px] flex items-center shadow-2xs"
                          >
                            KIRAN (1800-599-0019)
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Copy message button */}
                    {isAi && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-end">
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded-xl bg-[#111827] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-2xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-3"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center space-x-2 text-xs text-slate-500 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse [animation-delay:0.4s]" />
                  <span className="text-[11px] font-medium ml-1.5 text-slate-600">
                    {isCustomKeyActive ? `${aiConfig.provider.toUpperCase()} is thinking...` : 'Formulating reflection...'}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Starter Prompts */}
          <div className="px-4 sm:px-6 py-2 border-t border-slate-100 bg-slate-50/60 flex items-center space-x-2 overflow-x-auto">
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
                className="text-[11px] font-medium bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 px-3 py-1.5 rounded-full shrink-0 transition-colors cursor-pointer min-h-[32px] shadow-2xs"
              >
                {prompt}
              </motion.button>
            ))}
          </div>

          {/* Input Box Footer */}
          <div className="p-3.5 sm:p-5 border-t border-slate-200/80 bg-white">
            <div className="flex items-end space-x-2.5">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isCustomKeyActive
                    ? `Message ${aiConfig.provider.toUpperCase()} (${aiConfig.model})...`
                    : 'Share what is on your mind...'
                }
                rows={1}
                className="flex-1 max-h-28 min-h-[44px] bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm text-[#111827] placeholder:text-slate-400 p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none transition-all shadow-2xs"
              />
              <Button
                variant="primary"
                size="default"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="min-h-[44px] h-11 px-4.5 rounded-2xl shrink-0 font-bold"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Conversations are private & confidential.</span>
              <button
                onClick={() => setConfigModalOpen(true)}
                className="hover:underline text-emerald-700 font-semibold"
              >
                {isCustomKeyActive ? '⚙️ AI Settings' : '🔑 Connect Custom API Key'}
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Custom API Key Modal */}
      <ApiKeyModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        onSave={handleSaveConfig}
        currentConfig={aiConfig}
      />
    </AppShell>
  );
};

export default AiAssistant;
