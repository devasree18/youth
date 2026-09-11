import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Sparkles } from 'lucide-react';
import { GameShell } from '../../components/GameShell';
import { IntroScreen } from '../../components/IntroScreen';
import { PauseModal } from '../../components/PauseModal';
import { SafeResultView } from '../../components/SafeResultView';
import {
  calculateAverageReaction,
  calculateReactionConsistency,
  formatTimeMMSS,
} from '../../utils/gameMetrics';
import type {
  ActiveGameProps,
  GameDefinition,
  GameScreenState,
  FocusOrbitMetrics,
} from '../../types';

export const FOCUS_ORBIT_DEF: GameDefinition = {
  type: 'FOCUS_ORBIT',
  title: 'Focus Orbit',
  tagline: 'Reaction and present-moment attention game',
  description:
    'A soft glowing orb appears gently around your screen. Tap or click each orb before it fades to centre your attention and steady your focus.',
  durationLabel: '45 seconds',
  defaultDurationSeconds: 45,
  badge: 'Reaction & Attention',
  icon: Target,
  accentColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  category: 'FOCUS',
};

interface OrbState {
  id: number;
  xPercent: number; // 15% to 85%
  yPercent: number; // 15% to 85%
  spawnTime: number;
  lifetimeMs: number;
  colorScheme: string;
}

const COLOR_SCHEMES = [
  'from-indigo-500 to-teal-400 shadow-indigo-500/30',
  'from-teal-400 to-emerald-400 shadow-teal-500/30',
  'from-violet-500 to-indigo-400 shadow-violet-500/30',
  'from-sky-400 to-teal-300 shadow-sky-500/30',
];

export const FocusOrbitGame: React.FC<ActiveGameProps> = ({
  onComplete,
  onExit,
  isSaving = false,
}) => {
  const [screenState, setScreenState] = useState<GameScreenState>('intro');
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [successfulTaps, setSuccessfulTaps] = useState<number>(0);
  const [totalTaps, setTotalTaps] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [pausedCount, setPausedCount] = useState<number>(0);
  const [currentOrb, setCurrentOrb] = useState<OrbState | null>(null);
  const [tapRipples, setTapRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [resultMetrics, setResultMetrics] = useState<FocusOrbitMetrics | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const orbTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const TOTAL_GAME_SECONDS = 45;

  // Clear timers helper
  const clearAllTimers = () => {
    if (orbTimerRef.current) clearTimeout(orbTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  const spawnNextOrbRef = useRef<(score: number) => void>(() => {});

  // Spawn an orb with smooth gentle difficulty progression
  const spawnNextOrb = useCallback((scoreCount: number) => {
    if (orbTimerRef.current) clearTimeout(orbTimerRef.current);

    // Smooth gentle decrease in orb lifetime (never aggressive, from 2400ms down to 1800ms)
    const smoothLifetime = Math.max(1800, 2400 - scoreCount * 25);
    const randomScheme = COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)];

    // Ensure orb stays comfortably inside bounds (15% to 85%)
    const x = Math.floor(Math.random() * 70) + 15;
    const y = Math.floor(Math.random() * 70) + 15;

    const newOrb: OrbState = {
      id: Date.now() + Math.random(),
      xPercent: x,
      yPercent: y,
      spawnTime: performance.now(),
      lifetimeMs: smoothLifetime,
      colorScheme: randomScheme,
    };

    setCurrentOrb(newOrb);

    // If orb is not tapped in time, gently fade and spawn next orb without penalty
    orbTimerRef.current = setTimeout(() => {
      spawnNextOrbRef.current(scoreCount);
    }, smoothLifetime);
  }, []);

  useEffect(() => {
    spawnNextOrbRef.current = spawnNextOrb;
  }, [spawnNextOrb]);

  // Handle Game Completion
  const handleGameFinish = useCallback(
    async (finalTaps: number, finalTotal: number, times: number[], pauses: number) => {
      clearAllTimers();
      setScreenState('completed');

      const avgReaction = calculateAverageReaction(times);
      const consistency = calculateReactionConsistency(times);

      const metrics: FocusOrbitMetrics = {
        totalTaps: finalTotal,
        successfulTaps: finalTaps,
        averageReactionMs: avgReaction,
        reactionTimeConsistency: consistency,
        reactionTimes: times,
        sessionDuration: TOTAL_GAME_SECONDS,
        pausedCount: pauses,
      };

      setResultMetrics(metrics);

      const accuracy = finalTotal > 0 ? Math.round((finalTaps / finalTotal) * 100) : 100;
      await onComplete({
        status: 'COMPLETED',
        durationSeconds: TOTAL_GAME_SECONDS,
        resultSummary: `Focus Orbit completed: ${finalTaps} present-moment focus touches with ${avgReaction > 0 ? avgReaction + 'ms average reaction' : 'steady rhythm'}.`,
        accuracy,
        metrics,
      });
    },
    [onComplete]
  );

  // Start the game
  const startGame = () => {
    clearAllTimers();
    setTimeLeft(TOTAL_GAME_SECONDS);
    setSuccessfulTaps(0);
    setTotalTaps(0);
    setReactionTimes([]);
    setPausedCount(0);
    setTapRipples([]);
    setScreenState('playing');

    spawnNextOrb(0);
  };

  // Main countdown timer effect
  useEffect(() => {
    if (screenState === 'playing') {
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleGameFinish(successfulTaps, totalTaps, reactionTimes, pausedCount);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [screenState, successfulTaps, totalTaps, reactionTimes, pausedCount, handleGameFinish]);

  // Handle tap / click on orb
  const handleOrbTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (screenState !== 'playing' || !currentOrb) return;

    const reactionTime = Math.round(performance.now() - currentOrb.spawnTime);
    const updatedTimes = [...reactionTimes, reactionTime];
    const newSuccess = successfulTaps + 1;
    const newTotal = totalTaps + 1;

    setSuccessfulTaps(newSuccess);
    setTotalTaps(newTotal);
    setReactionTimes(updatedTimes);

    // Create subtle ripple feedback at tap coordinates
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0]?.clientX || rect.width / 2 : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY || rect.height / 2 : (e as React.MouseEvent).clientY;
      const rippleX = clientX - rect.left;
      const rippleY = clientY - rect.top;

      setTapRipples((prev) => [...prev.slice(-4), { id: Date.now(), x: rippleX, y: rippleY }]);
    }

    spawnNextOrb(newSuccess);
  };

  // Handle tap on background
  const handleBackgroundTap = () => {
    if (screenState === 'playing') {
      setTotalTaps((prev) => prev + 1);
    }
  };

  const handlePause = () => {
    if (screenState === 'playing') {
      clearAllTimers();
      setPausedCount((prev) => prev + 1);
      setScreenState('paused');
    }
  };

  const handleResume = () => {
    if (screenState === 'paused') {
      setScreenState('playing');
      spawnNextOrb(successfulTaps);
    }
  };

  const handleRestart = () => {
    startGame();
  };

  // Render Intro
  if (screenState === 'intro') {
    return (
      <IntroScreen
        game={FOCUS_ORBIT_DEF}
        instructions={[
          'A soft glowing orb will gently appear at random positions on the canvas.',
          'Tap or click each orb with mindful, present attention before it fades.',
          'Each tap seamlessly creates the next orb over a calm 45-second session.',
          'Breathe naturally. Focus on smooth, steady rhythm without rushing.',
        ]}
        tips={[
          'There are no penalties or sudden game-overs.',
          'Simply bring your awareness back if you miss an orb.',
        ]}
        onStart={startGame}
        onBack={onExit}
      />
    );
  }

  // Render Results
  if (screenState === 'completed') {
    return (
      <SafeResultView
        game={FOCUS_ORBIT_DEF}
        heading="Focus reset complete."
        subheading="You spent a few minutes practising present-moment attention."
        insightText={
          resultMetrics && resultMetrics.successfulTaps > 15
            ? 'Your present-moment focus was steady and sustained throughout the session.'
            : undefined
        }
        stats={[
          { label: 'Successful Taps', value: successfulTaps },
          {
            label: 'Avg Reaction',
            value: resultMetrics?.averageReactionMs ? `${resultMetrics.averageReactionMs}ms` : 'Steady',
          },
          {
            label: 'Tempo Consistency',
            value: resultMetrics?.reactionTimeConsistency ? resultMetrics.reactionTimeConsistency.toUpperCase() : 'STEADY',
          },
          { label: 'Time Spent', value: '45s' },
        ]}
        onPlayAgain={startGame}
        onExit={onExit}
        isSaving={isSaving}
      />
    );
  }

  // Render Active Gameplay
  const progressPercent = ((TOTAL_GAME_SECONDS - timeLeft) / TOTAL_GAME_SECONDS) * 100;

  return (
    <GameShell
      game={FOCUS_ORBIT_DEF}
      timerFormatted={formatTimeMMSS(timeLeft)}
      progressPercent={progressPercent}
      onPause={handlePause}
      onRestart={handleRestart}
      onExit={onExit}
      isPaused={screenState === 'paused'}
      extraHeaderInfo={
        <div className="flex items-center gap-2 bg-indigo-50/80 text-indigo-700 font-semibold px-3 py-1 rounded-xl text-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>{successfulTaps} orbs connected</span>
        </div>
      }
    >
      {/* Interactive Play Area */}
      <div
        ref={containerRef}
        onClick={handleBackgroundTap}
        className="relative w-full h-[440px] sm:h-[540px] bg-slate-900 overflow-hidden select-none flex items-center justify-center touch-none"
        style={{ touchAction: 'none' }}
      >
        {/* Ambient Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-slate-950/80 pointer-events-none" />

        {/* Central Calm Guide Ring */}
        <div className="absolute w-60 sm:w-72 h-60 sm:h-72 rounded-full border border-indigo-500/10 pointer-events-none" />
        <div className="absolute w-80 sm:w-96 h-80 sm:h-96 rounded-full border border-teal-500/10 pointer-events-none" />

        {/* Tap Ripple Particle Effects */}
        {tapRipples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ left: ripple.x, top: ripple.y }}
            className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 border-teal-300 pointer-events-none"
          />
        ))}

        {/* The Soft Glowing Orb */}
        <AnimatePresence mode="wait">
          {currentOrb && (
            <motion.div
              key={currentOrb.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                left: `${currentOrb.xPercent}%`,
                top: `${currentOrb.yPercent}%`,
              }}
              onClick={handleOrbTap}
              onTouchStart={handleOrbTap}
              className="absolute -ml-9 -mt-9 w-20 h-20 sm:w-22 sm:h-22 cursor-pointer flex items-center justify-center group focus:outline-none touch-manipulation min-w-[56px] min-h-[56px]"
            >
              {/* Soft Pulsing Ambient Halo */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.35, 0.65, 0.35],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: 'easeInOut',
                }}
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentOrb.colorScheme} blur-xl`}
              />

              {/* Glowing Interactive Core */}
              <div
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${currentOrb.colorScheme} shadow-lg flex items-center justify-center text-white border-2 border-white/60 transition-transform active:scale-90 group-hover:scale-105`}
              >
                <div className="w-4 h-4 rounded-full bg-white/90 shadow-sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle Bottom Instruction */}
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none px-4">
          <p className="text-xs text-slate-400/90 font-medium">
            Tap the glowing orb softly as it appears
          </p>
        </div>
      </div>

      <PauseModal
        isOpen={screenState === 'paused'}
        onResume={handleResume}
        onRestart={handleRestart}
        onExit={onExit}
      />
    </GameShell>
  );
};
