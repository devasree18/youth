import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import type { GameDefinition } from '../types';

interface IntroScreenProps {
  game: GameDefinition;
  instructions: string[];
  tips?: string[];
  onStart: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  game,
  instructions,
  tips = [],
  onStart,
  onBack,
  isLoading = false,
}) => {
  const Icon = game.icon;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${game.accentColor}`}
            >
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-semibold">
                  {game.badge}
                </Badge>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {game.durationLabel}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {game.title}
              </h2>
            </div>
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {game.description}
        </p>

        {/* Instructions Block */}
        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            How to Play
          </div>
          <ul className="space-y-2.5">
            {instructions.map((inst, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{inst}</span>
              </li>
            ))}
          </ul>
        </div>

        {tips.length > 0 && (
          <div className="bg-teal-50/60 rounded-2xl p-4 border border-teal-100/80 mb-6 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="text-xs text-teal-800 leading-relaxed">
              {tips.join(' ')}
            </div>
          </div>
        )}

        {/* Non-clinical Privacy Safe Notice */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 px-1">
          <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            This is a mindful pause activity. No performance score or psychological diagnosis is ever generated.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900"
          >
            Back to Games
          </Button>
          <Button
            type="button"
            onClick={onStart}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            {isLoading ? 'Starting...' : 'Begin Reset'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
