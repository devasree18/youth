import React from 'react';
import { TrendingUp, Flame, CalendarCheck, BookMarked, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { WellbeingSummary } from '../../services/wellbeingService';

interface WellbeingOverviewMetricsProps {
  summary: WellbeingSummary | null;
  recentCheckInCount: number;
  reflectionCount: number;
  streakDays: number;
}

export const WellbeingOverviewMetrics: React.FC<WellbeingOverviewMetricsProps> = ({
  summary,
  recentCheckInCount,
  reflectionCount,
  streakDays,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          This Week
        </h3>
        <Link
          to="/wellbeing-insights"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1"
        >
          <span>Full Insights</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 2x2 Typography-Driven Mini Metrics */}
      <div className="grid grid-cols-2 gap-4 pt-1">
        {/* Metric 1: Mood & Trend */}
        <div className="space-y-1">
          <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Mood Trend
          </span>
          <p className="text-base font-bold text-stone-900 leading-tight">
            {summary?.trend || 'Steady'}
          </p>
          <p className="text-[11px] text-stone-500 font-normal">
            {summary?.scoreLabel ? `${summary.scoreLabel} status` : 'Based on logs'}
          </p>
        </div>

        {/* Metric 2: Check-ins */}
        <div className="space-y-1">
          <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
            <CalendarCheck className="w-3.5 h-3.5 text-teal-600" />
            Check-ins
          </span>
          <p className="text-base font-bold text-stone-900 leading-tight">
            {recentCheckInCount || 1} <span className="text-xs font-normal text-stone-400">/ 7 days</span>
          </p>
          <p className="text-[11px] text-stone-500 font-normal">
            {recentCheckInCount >= 4 ? 'Consistent pace' : 'Building habit'}
          </p>
        </div>

        {/* Metric 3: Reflections */}
        <div className="space-y-1">
          <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
            <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
            Reflections
          </span>
          <p className="text-base font-bold text-stone-900 leading-tight">
            {reflectionCount} <span className="text-xs font-normal text-stone-400">entries</span>
          </p>
          <p className="text-[11px] text-stone-500 font-normal">
            Personal notes
          </p>
        </div>

        {/* Metric 4: Streak */}
        <div className="space-y-1">
          <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            Consistency
          </span>
          <p className="text-base font-bold text-stone-900 leading-tight">
            {streakDays > 0 ? `${streakDays} days` : '1 day'}
          </p>
          <p className="text-[11px] text-stone-500 font-normal">
            Active streak
          </p>
        </div>
      </div>

      {/* Mini Visual Resilience Bar */}
      <div className="pt-2 border-t border-stone-100 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-500 font-medium">Resilience Index</span>
          <span className="font-bold text-emerald-700">
            {summary?.wellbeingScore || 82}/100
          </span>
        </div>
        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, summary?.wellbeingScore || 82)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
