import React from 'react';
import { motion } from 'framer-motion';
import { Wind, BookOpen, Brain, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResetActivityInfographicProps {
  breathingCount: number;
  journalCount: number;
  focusCount: number;
  isLoading?: boolean;
}

interface ActivityRingProps {
  count: number;
  maxTarget: number;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  color: string;
  strokeColor: string;
  bgStrokeColor: string;
  onClick: () => void;
}

const ActivityRing: React.FC<ActivityRingProps> = ({
  count,
  maxTarget,
  label,
  sublabel,
  icon,
  color,
  strokeColor,
  bgStrokeColor,
  onClick,
}) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(Math.max(count / Math.max(maxTarget, 1), 0), 1);
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex-1 bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all cursor-pointer group"
    >
      <div className="relative flex items-center justify-center mb-2">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
          {/* Background circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={bgStrokeColor}
            strokeWidth="5"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={strokeColor}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={count > 0 ? strokeDashoffset : circumference}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className={`absolute inset-0 flex flex-col items-center justify-center ${color}`}>
          <div className="text-sm font-bold leading-none">{count}</div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-slate-700 font-bold text-xs">
        <span className={color}>{icon}</span>
        <span>{label}</span>
      </div>
      <span className="text-[10px] text-slate-400 font-medium">{sublabel}</span>
    </motion.button>
  );
};

export const ResetActivityInfographic: React.FC<ResetActivityInfographicProps> = ({
  breathingCount,
  journalCount,
  focusCount,
  isLoading,
}) => {
  const navigate = useNavigate();
  const totalWeeklyActivity = breathingCount + journalCount + focusCount;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs h-full flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">My reset tools</h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">Weekly practice summary</p>
        </div>
        <button
          onClick={() => navigate('/games')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-0.5 transition-colors cursor-pointer"
        >
          <span>Explore tools</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {isLoading ? (
        <div className="h-44 rounded-2xl bg-slate-50 flex items-center justify-center animate-pulse">
          <span className="text-xs text-slate-400">Loading your activity...</span>
        </div>
      ) : totalWeeklyActivity === 0 ? (
        /* Empty State */
        <div className="h-44 rounded-2xl bg-slate-50/70 border border-slate-200/60 p-5 flex flex-col items-center justify-center text-center space-y-3">
          <p className="text-xs font-semibold text-slate-700">No reset tools practiced yet this week</p>
          <button
            type="button"
            onClick={() => navigate('/games')}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Wind className="w-4 h-4" />
            <span>Try a 2-minute reset</span>
          </button>
        </div>
      ) : (
        /* 3 Visual Progress Rings */
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
          <ActivityRing
            count={breathingCount}
            maxTarget={5}
            label="Breathing"
            sublabel="Resets"
            icon={<Wind className="w-3.5 h-3.5" />}
            color="text-teal-600"
            strokeColor="#0D9488"
            bgStrokeColor="#CCFBF1"
            onClick={() => navigate('/games')}
          />
          <ActivityRing
            count={journalCount}
            maxTarget={5}
            label="Journal"
            sublabel="Moments"
            icon={<BookOpen className="w-3.5 h-3.5" />}
            color="text-purple-600"
            strokeColor="#8B5CF6"
            bgStrokeColor="#EDE9FE"
            onClick={() => navigate('/solutions')}
          />
          <ActivityRing
            count={focusCount}
            maxTarget={5}
            label="Focus"
            sublabel="Games"
            icon={<Brain className="w-3.5 h-3.5" />}
            color="text-amber-600"
            strokeColor="#F59E0B"
            bgStrokeColor="#FEF3C7"
            onClick={() => navigate('/games')}
          />
        </div>
      )}
    </div>
  );
};
