import React from 'react';
import { TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import type { MoodEntry } from '../../services/moodService';
import type { WellbeingSummary } from '../../services/wellbeingService';

interface TodayStatusStripProps {
  todayMood: MoodEntry | null;
  summary: WellbeingSummary | null;
  lastCheckInDate?: string;
}

const MOOD_LABELS: Record<string, { label: string; dotColor: string }> = {
  very_low: { label: 'Very Low', dotColor: 'bg-rose-500' },
  low: { label: 'Low', dotColor: 'bg-amber-500' },
  okay: { label: 'Okay', dotColor: 'bg-slate-400' },
  good: { label: 'Good', dotColor: 'bg-teal-500' },
  great: { label: 'Great', dotColor: 'bg-emerald-500' },
};

export const TodayStatusStrip: React.FC<TodayStatusStripProps> = ({
  todayMood,
  summary,
  lastCheckInDate,
}) => {
  const moodInfo = todayMood ? MOOD_LABELS[todayMood.mood] : null;

  return (
    <div className="py-3 px-4 sm:px-5 rounded-2xl bg-white/80 border border-stone-200/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs text-stone-600">
      {/* Current Mood State */}
      <div className="flex items-center space-x-2.5">
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
          Current State
        </span>
        <div className="flex items-center space-x-1.5 font-medium text-stone-800">
          {moodInfo ? (
            <>
              <span className={`w-2 h-2 rounded-full ${moodInfo.dotColor}`} />
              <span className="font-semibold">{moodInfo.label}</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-stone-300" />
              <span className="text-stone-400">Not logged yet today</span>
            </>
          )}
        </div>
      </div>

      {/* Wellbeing Score & Trend */}
      <div className="flex items-center space-x-2.5">
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
          Resilience
        </span>
        <div className="flex items-center space-x-1.5 font-medium text-stone-800">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold">
            {summary?.wellbeingScore ? `${summary.wellbeingScore}/100` : 'Baseline Active'}
          </span>
          {summary?.trend && (
            <span className="text-[11px] text-stone-400 font-normal">
              ({summary.trend})
            </span>
          )}
        </div>
      </div>

      {/* Last Check-in Indicator */}
      <div className="flex items-center space-x-2.5">
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
          Check-in
        </span>
        <div className="flex items-center space-x-1.5 font-medium text-stone-800">
          {lastCheckInDate ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-stone-700">Logged {lastCheckInDate}</span>
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-400">Pending today</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
