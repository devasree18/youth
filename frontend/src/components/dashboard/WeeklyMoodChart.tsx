import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import type { MoodEntry } from '../../services/moodService';
import { Sparkles } from 'lucide-react';

interface WeeklyMoodChartProps {
  moodHistory: MoodEntry[];
  isLoading?: boolean;
}

const SCORE_TO_LABEL: Record<number, string> = {
  1: 'Very low',
  2: 'Low',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
};

export const WeeklyMoodChart: React.FC<WeeklyMoodChartProps> = ({
  moodHistory,
  isLoading,
}) => {
  // Build 7-day data structure starting from Monday of the current week
  const getWeeklyChartData = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [];
    let realCount = 0;

    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + i);
      const targetDateStr = targetDate.toDateString();

      // Find if user recorded mood on this date
      const match = moodHistory.find(
        (m) => new Date(m.createdAt).toDateString() === targetDateStr
      );

      if (match) {
        realCount++;
        data.push({
          day: days[i],
          fullDate: targetDate.toLocaleDateString('en-US', { weekday: 'long' }),
          score: match.score || 3,
          moodLabel: SCORE_TO_LABEL[match.score || 3] || 'Okay',
          hasEntry: true,
        });
      } else {
        data.push({
          day: days[i],
          fullDate: targetDate.toLocaleDateString('en-US', { weekday: 'long' }),
          score: null,
          moodLabel: 'No log',
          hasEntry: false,
        });
      }
    }

    return { data, realCount };
  };

  const { data: chartData, realCount } = getWeeklyChartData();

  // Custom Minimal Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (!data.hasEntry) return null;
      return (
        <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-slate-700">
          <p>{data.fullDate} — <span className="text-indigo-300 font-bold">{data.moodLabel}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs h-full flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Your week</h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">Emotional rhythm & consistency</p>
        </div>
        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
          Last 7 Days
        </span>
      </div>

      {isLoading ? (
        <div className="h-44 rounded-2xl bg-slate-50 flex items-center justify-center animate-pulse">
          <span className="text-xs text-slate-400">Loading your rhythm...</span>
        </div>
      ) : realCount < 2 ? (
        /* Empty State */
        <div className="h-44 rounded-2xl bg-slate-50/70 border border-slate-200/60 p-5 flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <p className="text-xs font-semibold text-slate-700">
            Your weekly pattern will appear after a few check-ins.
          </p>
          <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
            Check in daily to view how your energy and balance shift throughout the week.
          </p>
        </div>
      ) : (
        /* Recharts Smooth Line / Area Chart */
        <div className="w-full h-44 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => SCORE_TO_LABEL[val] || ''}
                tick={{ fill: '#94A3B8', fontSize: 9 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#6366F1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#moodGradient)"
                connectNulls
                dot={{ fill: '#6366F1', r: 3.5, strokeWidth: 2, stroke: '#FFFFFF' }}
                activeDot={{ r: 5.5, fill: '#4F46E5', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
