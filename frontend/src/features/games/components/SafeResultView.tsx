import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, RotateCcw, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { GameDefinition } from '../types';

interface SafeResultViewProps {
  game: GameDefinition;
  heading: string;
  subheading: string;
  insightText?: string;
  stats?: Array<{ label: string; value: string | number }>;
  onPlayAgain: () => void;
  onExit: () => void;
  isSaving?: boolean;
}

export const SafeResultView: React.FC<SafeResultViewProps> = ({
  game,
  heading,
  subheading,
  insightText,
  stats = [],
  onPlayAgain,
  onExit,
  isSaving = false,
}) => {
  const [postFeeling, setPostFeeling] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          {game.title} Completed
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
          {heading}
        </h2>

        <p className="text-slate-600 text-base max-w-md mx-auto mb-6 leading-relaxed">
          {subheading}
        </p>

        {/* Highlighted Insight Banner */}
        {insightText && (
          <div className="bg-indigo-50/70 border border-indigo-100/90 rounded-2xl p-4 mb-6 text-left flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">
                Mindful Insight
              </div>
              <p className="text-sm text-indigo-800 leading-relaxed">
                {insightText}
              </p>
            </div>
          </div>
        )}

        {/* Lightweight Stats Grid */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 text-center"
              >
                <div className="text-xs text-slate-500 font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gentle Self Check-In */}
        <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100 mb-6 text-left">
          <div className="text-xs font-semibold text-slate-700 mb-2.5 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            How do you feel after this pause? (Optional)
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'more_settled', label: '🌿 More settled' },
              { id: 'grounded', label: '🎯 Grounded' },
              { id: 'lighter', label: '✨ A little lighter' },
              { id: 'same', label: 'Neutral' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPostFeeling(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  postFeeling === opt.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Non-clinical Privacy Safe Notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-8">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>
            {isSaving
              ? 'Saving mindful reset session to your private profile...'
              : 'Session saved privately. Non-clinical activity data only.'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onPlayAgain}
            className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </Button>

          <Button
            type="button"
            onClick={onExit}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-sm"
          >
            Done & Return
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
