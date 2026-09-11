import React from 'react';
import { ArrowRight, CheckCircle2, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

interface TodayFocusActionProps {
  isCheckedInToday: boolean;
  userMood?: string;
  onDismiss?: () => void;
}

export const TodayFocusAction: React.FC<TodayFocusActionProps> = ({
  isCheckedInToday,
  userMood,
  onDismiss,
}) => {
  // If user has not checked in today, make the 2-minute check-in visually focal
  if (!isCheckedInToday) {
    return (
      <div className="relative p-6 sm:p-7 rounded-3xl bg-stone-900 text-white shadow-xs overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              Today's Next Step
            </span>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
              Take your 2-minute wellbeing check-in
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-normal leading-relaxed">
              A quick reflection helps track your cognitive stamina, sleep patterns, and daily emotional balance.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-xs text-stone-400 hover:text-stone-200 px-3 py-2 transition-colors cursor-pointer"
              >
                Not now
              </button>
            )}
            <Link to="/assessment">
              <Button
                variant="primary"
                size="default"
                className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold px-5 rounded-xl shadow-xs"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Start check-in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If already checked in and mood is low, suggest a somatic reset
  if (userMood === 'very_low' || userMood === 'low') {
    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
            <Wind className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
              Restorative Pause
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-emerald-950">
              60-Second 4-7-8 Breathing Reset
            </h3>
            <p className="text-xs text-emerald-800/80 font-normal">
              Slow down your breathing rate to signal safety to your nervous system.
            </p>
          </div>
        </div>

        <Link to="/games">
          <Button
            variant="primary"
            size="sm"
            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shrink-0"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Start reset
          </Button>
        </Link>
      </div>
    );
  }

  // Default checked-in completed state
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-stone-100/70 border border-stone-200/60 text-stone-800 flex items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-stone-900">
            You're checked in for today
          </h4>
          <p className="text-[11px] text-stone-500 font-normal">
            Your daily log is active. Take breaks when needed and stay hydrated.
          </p>
        </div>
      </div>

      <Link
        to="/wellbeing-insights"
        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 shrink-0"
      >
        <span>View Insights</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
