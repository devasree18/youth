import React from 'react';
import { Target, BookMarked, Gamepad2, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export const ToolsMixedSection: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Tools For Your Day
        </h3>
        <Link
          to="/games"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1"
        >
          <span>All Practices</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Mixed Layout: 1 Featured Banner + 3 Compact Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Featured Card (Spans 2 cols on tablet/desktop) */}
        <div className="md:col-span-2 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white border border-emerald-200/80 text-stone-900 flex flex-col justify-between shadow-2xs">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Featured Practice
              </span>
              <span className="text-[11px] text-stone-500 font-normal">
                60-Second Cadence
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
              Somatic 4-7-8 Breathing Reset
            </h4>
            <p className="text-xs text-stone-600 max-w-md font-normal leading-relaxed">
              Inhale 4s, hold 7s, exhale 8s. A clinically validated rhythm to settle heart rate and downregulate nervous arousal.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs text-emerald-700 font-semibold">
              Immediate nervous calming
            </span>
            <Link to="/games">
              <Button
                variant="primary"
                size="sm"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl px-4 shadow-xs"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Begin
              </Button>
            </Link>
          </div>
        </div>

        {/* Focus Orbit (1 Col) */}
        <Link
          to="/games"
          className="p-5 rounded-3xl bg-white border border-stone-200/90 hover:border-stone-300 transition-all flex flex-col justify-between group shadow-2xs"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center shadow-2xs">
              <Target className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
              Focus Orbit
            </h4>
            <p className="text-[11px] text-stone-500 font-normal leading-relaxed">
              25-min study interval with ambient focus rhythms.
            </p>
          </div>
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-amber-700">
            <span>Study Timer</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Row of 3 Secondary Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {/* Tool 1: Daily Journal */}
        <Link
          to="/solutions"
          className="p-3.5 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-300 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center shrink-0">
              <BookMarked className="w-3.5 h-3.5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors">
                Journal & Reflection
              </h5>
              <p className="text-[10px] text-stone-400">Private daily logs</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
        </Link>

        {/* Tool 2: Reset Games */}
        <Link
          to="/games"
          className="p-3.5 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-300 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center shrink-0">
              <Gamepad2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors">
                Reset Games
              </h5>
              <p className="text-[10px] text-stone-400">Path of Balance</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
        </Link>

        {/* Tool 3: Resource Library */}
        <Link
          to="/resources"
          className="p-3.5 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-300 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors">
                Resource Library
              </h5>
              <p className="text-[10px] text-stone-400">Evidence-based guides</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
};
