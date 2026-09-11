import React from 'react';
import { Pause, RotateCcw, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import type { GameDefinition } from '../types';

interface GameShellProps {
  game: GameDefinition;
  children: React.ReactNode;
  timerFormatted?: string;
  progressPercent?: number;
  onPause: () => void;
  onRestart: () => void;
  onExit: () => void;
  isPaused?: boolean;
  extraHeaderInfo?: React.ReactNode;
}

export const GameShell: React.FC<GameShellProps> = ({
  game,
  children,
  timerFormatted,
  progressPercent,
  onPause,
  onRestart,
  onExit,
  extraHeaderInfo,
}) => {
  const Icon = game.icon;

  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-4 px-2 sm:px-4">
      {/* Game Top Control Bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/80 p-3 sm:p-4 mb-4 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${game.accentColor}`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                {game.title}
              </span>
              <Badge variant="outline" className="hidden sm:inline-flex text-[11px] font-semibold py-0">
                {game.badge}
              </Badge>
            </div>
            {timerFormatted && (
              <span className="text-xs text-slate-500 font-medium">
                Time remaining: <strong className="text-indigo-600 font-bold">{timerFormatted}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Extra info & Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {extraHeaderInfo}

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onPause}
            className="h-9 px-3 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            title="Pause game"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline text-xs font-semibold">Pause</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onRestart}
            className="h-9 w-9 p-0 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            title="Restart session"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onExit}
            className="h-9 w-9 p-0 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50"
            title="Exit game"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar (if provided) */}
      {progressPercent !== undefined && (
        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
          <div
            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
          />
        </div>
      )}

      {/* Play Area Container */}
      <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden min-h-[420px] sm:min-h-[500px]">
        {children}
      </div>
    </div>
  );
};
