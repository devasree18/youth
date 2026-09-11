import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  X,
  Check,
  ExternalLink,
  Sparkles,
  Trash2,
  Lock,
  Cpu
} from 'lucide-react';
import { Button } from '../ui/button';

export interface AIConfig {
  apiKey: string;
  provider: 'openai' | 'gemini' | 'groq' | 'openrouter';
  model: string;
}

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AIConfig) => void;
  currentConfig: AIConfig;
}

export const PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    placeholder: 'sk-proj-...',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
    docsUrl: 'https://platform.openai.com/api-keys',
    badge: 'Popular for ChatGPT',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    placeholder: 'AIzaSy...',
    defaultModel: 'gemini-1.5-flash',
    models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'],
    docsUrl: 'https://aistudio.google.com/app/apikey',
    badge: 'Free Tier Available',
  },
  {
    id: 'groq',
    name: 'Groq (Ultra-Fast)',
    placeholder: 'gsk_...',
    defaultModel: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'],
    docsUrl: 'https://console.groq.com/keys',
    badge: 'Blazing Fast & Free',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter / DeepSeek',
    placeholder: 'sk-or-...',
    defaultModel: 'deepseek/deepseek-chat',
    models: ['deepseek/deepseek-chat', 'meta-llama/llama-3.3-70b-instruct'],
    docsUrl: 'https://openrouter.ai/keys',
    badge: 'Multi-Model Hub',
  },
];

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentConfig,
}) => {
  const [provider, setProvider] = useState<AIConfig['provider']>(currentConfig.provider || 'openai');
  const [apiKey, setApiKey] = useState(currentConfig.apiKey || '');
  const [model, setModel] = useState(currentConfig.model || 'gpt-4o-mini');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setProvider(currentConfig.provider || 'openai');
    setApiKey(currentConfig.apiKey || '');
    setModel(currentConfig.model || 'gpt-4o-mini');
  }, [currentConfig, isOpen]);

  const selectedProviderInfo = PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0];

  const handleProviderChange = (newProvider: AIConfig['provider']) => {
    setProvider(newProvider);
    const pInfo = PROVIDERS.find((p) => p.id === newProvider);
    if (pInfo) {
      setModel(pInfo.defaultModel);
    }
  };

  const handleSave = () => {
    const config: AIConfig = {
      apiKey: apiKey.trim(),
      provider,
      model,
    };
    onSave(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setApiKey('');
    const config: AIConfig = {
      apiKey: '',
      provider: 'openai',
      model: 'gpt-4o-mini',
    };
    onSave(config);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-2xs">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Custom AI API Key Settings
                  </h3>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Power real ChatGPT & Gemini directly in YOUTH
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Provider Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Choose AI Provider</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {selectedProviderInfo.badge}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProviderChange(p.id as AIConfig['provider'])}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        provider === p.id
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{p.name}</span>
                        {provider === p.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                    <span>{selectedProviderInfo.name} API Key</span>
                  </label>
                  <a
                    href={selectedProviderInfo.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <span>Get Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={selectedProviderInfo.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Stored securely in your browser session. Never shared with third parties.</span>
                </p>
              </div>

              {/* Model Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Cpu className="w-3.5 h-3.5 text-slate-500" />
                  <span>Model Selection</span>
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all cursor-pointer"
                >
                  {selectedProviderInfo.models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feature info banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900 flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  With your API key connected, YOUTH delivers full real-time conversational intelligence with empathetic counseling guidance and memory.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              {currentConfig.apiKey ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disconnect Key</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">Default clinical mode active</span>
              )}

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  className="text-xs font-bold"
                >
                  {savedSuccess ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Saved!
                    </span>
                  ) : (
                    'Save & Connect'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
