import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Droplet,
  Coffee,
  Music,
  Sun,
  BookOpen,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { GameShell } from '../../components/GameShell';
import { IntroScreen } from '../../components/IntroScreen';
import { PauseModal } from '../../components/PauseModal';
import { SafeResultView } from '../../components/SafeResultView';
import { formatTimeMMSS } from '../../utils/gameMetrics';
import type {
  ActiveGameProps,
  GameDefinition,
  GameScreenState,
  PathOfBalanceMetrics,
} from '../../types';

export const PATH_OF_BALANCE_DEF: GameDefinition = {
  type: 'PATH_OF_BALANCE',
  title: 'Path of Balance',
  tagline: 'Mindful decision journey along a peaceful path',
  description:
    'Guide a calm traveler through a tranquil landscape. Collect restorative coping items, gently sidestep distractions, and discover your peaceful sanctuary.',
  durationLabel: '60–90 seconds',
  defaultDurationSeconds: 75,
  badge: 'Mindful Journey & Pacing',
  icon: Compass,
  accentColor: 'bg-violet-50 text-violet-600 border-violet-100',
  category: 'BALANCE',
};

interface ItemNode {
  id: string;
  name: string;
  type: 'water' | 'rest' | 'music' | 'sunlight' | 'notebook';
  icon: typeof Droplet;
  color: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  collected: boolean;
}

interface ObstacleNode {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

interface SanctuaryRoute {
  id: string;
  title: string;
  x: number;
  y: number;
  sceneName: string;
}

const COLLECTIBLES_DATA: ItemNode[] = [
  { id: 'water', name: 'Cool Water', type: 'water', icon: Droplet, color: '#0ea5e9', x: 22, y: 35, collected: false },
  { id: 'sunlight', name: 'Warm Sunlight', type: 'sunlight', icon: Sun, color: '#f59e0b', x: 45, y: 22, collected: false },
  { id: 'music', name: 'Soft Music', type: 'music', icon: Music, color: '#8b5cf6', x: 68, y: 38, collected: false },
  { id: 'rest', name: 'Quiet Rest', type: 'rest', icon: Coffee, color: '#10b981', x: 30, y: 65, collected: false },
  { id: 'notebook', name: 'Mindful Notebook', type: 'notebook', icon: BookOpen, color: '#6366f1', x: 70, y: 70, collected: false },
];

const OBSTACLES_DATA: ObstacleNode[] = [
  { id: 'noise', name: 'Rushing Noise', x: 38, y: 48, color: '#cbd5e1' },
  { id: 'overload', name: 'Overload Mist', x: 55, y: 58, color: '#e2e8f0' },
];

const SANCTUARIES: SanctuaryRoute[] = [
  { id: 'meadow', title: 'Sunlit Meadow Sanctuary', x: 88, y: 25, sceneName: 'Sunlit Meadow' },
  { id: 'oasis', title: 'Tranquil Brook Oasis', x: 88, y: 55, sceneName: 'Tranquil Brook' },
  { id: 'grove', title: 'Whispering Pine Grove', x: 88, y: 82, sceneName: 'Pine Grove' },
];

export const PathOfBalanceGame: React.FC<ActiveGameProps> = ({
  onComplete,
  onExit,
  isSaving = false,
}) => {
  const [screenState, setScreenState] = useState<GameScreenState>('intro');
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 8, y: 50 });
  const [items, setItems] = useState<ItemNode[]>(COLLECTIBLES_DATA);
  const [collectedItems, setCollectedItems] = useState<string[]>([]);
  const [obstaclesAvoided, setObstaclesAvoided] = useState<number>(0);
  const [selectedSanctuary, setSelectedSanctuary] = useState<SanctuaryRoute | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [pausedCount, setPausedCount] = useState<number>(0);
  const [restartCount, setRestartCount] = useState<number>(0);
  const [slowedNotice, setSlowedNotice] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (screenState === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screenState]);

  // Finish journey
  const finishJourney = useCallback(
    async (sanctuary: SanctuaryRoute, finalItems: string[]) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setSelectedSanctuary(sanctuary);
      setScreenState('completed');

      const metrics: PathOfBalanceMetrics = {
        itemsCollected: finalItems,
        routeSelected: sanctuary.sceneName,
        obstaclesAvoided,
        timeSpent: elapsedSeconds || 65,
        restartCount,
        pausedCount,
        endingScene: sanctuary.title,
      };

      await onComplete({
        status: 'COMPLETED',
        durationSeconds: elapsedSeconds || 65,
        resultSummary: `Path of Balance journey complete: Reached ${sanctuary.sceneName}, gathered ${finalItems.join(', ') || 'restorative mindfulness'} over ${elapsedSeconds || 65}s.`,
        accuracy: 100,
        metrics,
      });
    },
    [elapsedSeconds, obstaclesAvoided, restartCount, pausedCount, onComplete]
  );

  // Movement & Collision Logic
  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (screenState !== 'playing') return;

      setPlayerPos((prev) => {
        const nextX = Math.min(Math.max(prev.x + dx, 5), 90);
        const nextY = Math.min(Math.max(prev.y + dy, 15), 85);

        // Check Item Collection
        setItems((currentItems) =>
          currentItems.map((item) => {
            if (!item.collected) {
              const dist = Math.hypot(item.x - nextX, item.y - nextY);
              if (dist < 8) {
                if (!collectedItems.includes(item.name)) {
                  setCollectedItems((c) => [...c, item.name]);
                }
                return { ...item, collected: true };
              }
            }
            return item;
          })
        );

        // Check Obstacle Interaction (Gentle Slowdown, never failure)
        OBSTACLES_DATA.forEach((obs) => {
          const dist = Math.hypot(obs.x - nextX, obs.y - nextY);
          if (dist < 6) {
            setSlowedNotice('Stepped gently around distraction.');
            setTimeout(() => setSlowedNotice(null), 1200);
          }
        });

        // Check Sanctuary Arrival
        SANCTUARIES.forEach((sanc) => {
          const dist = Math.hypot(sanc.x - nextX, sanc.y - nextY);
          if (dist < 7) {
            finishJourney(sanc, collectedItems);
          }
        });

        return { x: nextX, y: nextY };
      });
    },
    [screenState, collectedItems, finishJourney]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screenState !== 'playing') return;

      const step = 4;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        movePlayer(0, -step);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        movePlayer(0, step);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        movePlayer(-step, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        movePlayer(step, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screenState, movePlayer]);

  // Click-to-move / Tap-to-move
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (screenState !== 'playing' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const dx = (clickX - playerPos.x) * 0.35;
    const dy = (clickY - playerPos.y) * 0.35;
    movePlayer(dx, dy);
  };

  const startGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsedSeconds(0);
    setPlayerPos({ x: 8, y: 50 });
    setItems(COLLECTIBLES_DATA.map((i) => ({ ...i, collected: false })));
    setCollectedItems([]);
    setObstaclesAvoided(0);
    setSelectedSanctuary(null);
    setScreenState('playing');
  };

  const handleRestart = () => {
    setRestartCount((prev) => prev + 1);
    startGame();
  };

  const handlePause = () => {
    if (screenState === 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      setPausedCount((prev) => prev + 1);
      setScreenState('paused');
    }
  };

  const handleResume = () => {
    if (screenState === 'paused') {
      setScreenState('playing');
    }
  };

  if (screenState === 'intro') {
    return (
      <IntroScreen
        game={PATH_OF_BALANCE_DEF}
        instructions={[
          'Navigate your calm traveler using Arrow Keys, WASD, or on-screen directional buttons.',
          'Collect mindful coping tokens (Water, Sunlight, Music, Rest, Notebook) along the trail.',
          'Gently steer around misty distractions as you choose your path.',
          'Reach any of the 3 peaceful sanctuaries at the right edge to conclude your journey.',
        ]}
        tips={[
          'There are no wrong paths, penalties, or failures.',
          'Touch swipe or tap anywhere on the canvas to guide your traveler.',
        ]}
        onStart={startGame}
        onBack={onExit}
      />
    );
  }

  if (screenState === 'completed') {
    return (
      <SafeResultView
        game={PATH_OF_BALANCE_DEF}
        heading="You completed a small reset journey."
        subheading="Different moments call for different kinds of support. Explore what helps you feel more balanced."
        insightText={
          selectedSanctuary
            ? `You arrived at the ${selectedSanctuary.title} with ${collectedItems.length} restorative items collected.`
            : 'You took mindful time to steer through your day with steady presence.'
        }
        stats={[
          { label: 'Sanctuary Reached', value: selectedSanctuary?.sceneName || 'Quiet Haven' },
          { label: 'Items Gathered', value: collectedItems.length },
          { label: 'Time Spent', value: `${elapsedSeconds || 65}s` },
          { label: 'Journey Pacing', value: 'BALANCED' },
        ]}
        onPlayAgain={startGame}
        onExit={onExit}
        isSaving={isSaving}
      />
    );
  }

  return (
    <GameShell
      game={PATH_OF_BALANCE_DEF}
      timerFormatted={formatTimeMMSS(elapsedSeconds)}
      onPause={handlePause}
      onRestart={handleRestart}
      onExit={onExit}
      isPaused={screenState === 'paused'}
      extraHeaderInfo={
        <div className="flex items-center gap-2 bg-violet-50 text-violet-700 font-semibold px-3 py-1 rounded-xl text-xs">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span>{collectedItems.length}/5 Coping Items</span>
        </div>
      }
    >
      {/* 2D Scenic Map Canvas */}
      <div
        ref={containerRef}
        onClick={handleMapClick}
        className="relative w-full h-[460px] sm:h-[540px] bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 overflow-hidden cursor-pointer select-none p-4"
      >
        {/* Winding Scenic Path SVG Background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <path
            d="M 50 250 Q 200 120 400 250 T 800 150"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="48"
            strokeLinecap="round"
          />
          <path
            d="M 50 250 Q 250 380 500 280 T 800 420"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="44"
            strokeLinecap="round"
          />
        </svg>

        {/* Collectible Items */}
        {items.map((item) => {
          const Icon = item.icon;
          if (item.collected) return null;
          return (
            <motion.div
              key={item.id}
              initial={{ scale: 0.8 }}
              animate={{
                scale: [0.95, 1.1, 0.95],
                y: [0, -3, 0],
              }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              className="absolute -ml-5 -mt-5 flex flex-col items-center group pointer-events-none"
            >
              <div
                className="w-10 h-10 rounded-2xl bg-white shadow-md flex items-center justify-center border-2"
                style={{ borderColor: item.color, color: item.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-2xs mt-1 text-slate-700">
                {item.name}
              </span>
            </motion.div>
          );
        })}

        {/* Obstacles (Misty Clouds) */}
        {OBSTACLES_DATA.map((obs) => (
          <div
            key={obs.id}
            style={{ left: `${obs.x}%`, top: `${obs.y}%` }}
            className="absolute -ml-8 -mt-8 w-16 h-16 rounded-full bg-slate-300/40 backdrop-blur-xs flex items-center justify-center pointer-events-none animate-pulse"
          >
            <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-tighter">
              {obs.name}
            </span>
          </div>
        ))}

        {/* 3 Ending Sanctuary Gateways */}
        {SANCTUARIES.map((sanc) => (
          <motion.div
            key={sanc.id}
            whileHover={{ scale: 1.05 }}
            style={{ left: `${sanc.x}%`, top: `${sanc.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              finishJourney(sanc, collectedItems);
            }}
            className="absolute -ml-7 -mt-7 cursor-pointer flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-indigo-900 bg-white/95 px-2 py-0.5 rounded-full shadow-xs mt-1 whitespace-nowrap">
              {sanc.sceneName}
            </span>
          </motion.div>
        ))}

        {/* Player Character Avatar */}
        <motion.div
          animate={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="absolute -ml-6 -mt-6 w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-400 text-white flex items-center justify-center shadow-xl border-2 border-white z-20 pointer-events-none"
        >
          <Compass className="w-6 h-6 animate-spin-slow" />
        </motion.div>

        {/* On-Screen Slowed Notice */}
        {slowedNotice && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-slate-800/85 text-white text-xs px-3.5 py-1.5 rounded-full backdrop-blur-sm">
            {slowedNotice}
          </div>
        )}

        {/* On-screen Directional Touch Controls */}
        <div className="absolute bottom-4 left-4 z-30 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-md">
          <div className="grid grid-cols-3 gap-1 w-28 h-28">
            <div />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                movePlayer(0, -6);
              }}
              className="bg-indigo-50 active:bg-indigo-200 text-indigo-700 rounded-xl flex items-center justify-center p-1"
              title="Move Up"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                movePlayer(-6, 0);
              }}
              className="bg-indigo-50 active:bg-indigo-200 text-indigo-700 rounded-xl flex items-center justify-center p-1"
              title="Move Left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center text-[10px] text-slate-400 font-bold">
              MOVE
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                movePlayer(6, 0);
              }}
              className="bg-indigo-50 active:bg-indigo-200 text-indigo-700 rounded-xl flex items-center justify-center p-1"
              title="Move Right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <div />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                movePlayer(0, 6);
              }}
              className="bg-indigo-50 active:bg-indigo-200 text-indigo-700 rounded-xl flex items-center justify-center p-1"
              title="Move Down"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <div />
          </div>
        </div>

        {/* Collected Inventory Preview */}
        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200 shadow-sm max-w-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Backpack ({collectedItems.length}/5)
          </div>
          <div className="flex flex-wrap gap-1">
            {collectedItems.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Walk over items to collect</span>
            ) : (
              collectedItems.map((name, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100"
                >
                  {name}
                </span>
              ))
            )}
          </div>
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
