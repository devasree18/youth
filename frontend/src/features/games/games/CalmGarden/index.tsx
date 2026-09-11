import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Flower2,
  Droplet,
  Sprout,
  Sparkles,
  CheckCircle2,
  Leaf,
} from 'lucide-react';
import { GameShell } from '../../components/GameShell';
import { IntroScreen } from '../../components/IntroScreen';
import { PauseModal } from '../../components/PauseModal';
import { SafeResultView } from '../../components/SafeResultView';
import { formatTimeMMSS } from '../../utils/gameMetrics';
import { Button } from '../../../../components/ui/button';
import type {
  ActiveGameProps,
  GameDefinition,
  GameScreenState,
  CalmGardenMetrics,
} from '../../types';

export const CALM_GARDEN_DEF: GameDefinition = {
  type: 'CALM_GARDEN',
  title: 'Calm Garden',
  tagline: 'Stress-relief digital garden interaction',
  description:
    'Nurture a peaceful sanctuary at your own rhythm. Plant seeds, nurture them with gentle water droplets, and clear falling leaves in a soothing, unhurried space.',
  durationLabel: '2–3 minutes',
  defaultDurationSeconds: 120,
  badge: 'Stress Relief & Grounding',
  icon: Flower2,
  accentColor: 'bg-teal-50 text-teal-600 border-teal-100',
  category: 'CALM',
};

type ToolType = 'seed' | 'water' | 'tidy';

interface PlantPlot {
  id: number;
  name: string;
  flowerType: 'lavender' | 'sunflower' | 'fern' | 'chamomile' | 'lotus';
  stage: 'empty' | 'seed' | 'sprout' | 'bloom';
  waterLevel: number; // 0 to 100
  color: string;
}

interface FallingLeaf {
  id: number;
  xPercent: number;
  yPercent: number;
  rotation: number;
}

const INITIAL_PLOTS: PlantPlot[] = [
  { id: 1, name: 'Lavender', flowerType: 'lavender', stage: 'empty', waterLevel: 0, color: '#8B5CF6' },
  { id: 2, name: 'Sunflower', flowerType: 'sunflower', stage: 'empty', waterLevel: 0, color: '#F59E0B' },
  { id: 3, name: 'Lotus', flowerType: 'lotus', stage: 'empty', waterLevel: 0, color: '#EC4899' },
  { id: 4, name: 'Fern', flowerType: 'fern', stage: 'empty', waterLevel: 0, color: '#10B981' },
  { id: 5, name: 'Chamomile', flowerType: 'chamomile', stage: 'empty', waterLevel: 0, color: '#06B6D4' },
];

export const CalmGardenGame: React.FC<ActiveGameProps> = ({
  onComplete,
  onExit,
  isSaving = false,
}) => {
  const [screenState, setScreenState] = useState<GameScreenState>('intro');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [activeTool, setActiveTool] = useState<ToolType>('seed');
  const [plots, setPlots] = useState<PlantPlot[]>(INITIAL_PLOTS);
  const [fallingLeaves, setFallingLeaves] = useState<FallingLeaf[]>([
    { id: 1, xPercent: 20, yPercent: 75, rotation: 15 },
    { id: 2, xPercent: 55, yPercent: 82, rotation: -25 },
    { id: 3, xPercent: 78, yPercent: 70, rotation: 40 },
  ]);
  const [interactionsCount, setInteractionsCount] = useState<number>(0);
  const [pausedCount, setPausedCount] = useState<number>(0);
  const [dropletPos, setDropletPos] = useState<{ x: number; y: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>('Select seeds and tap a plot to plant');

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Growth Progress Calculation
  const totalBlooms = plots.filter((p) => p.stage === 'bloom').length;
  const growthPercent = Math.round((totalBlooms / plots.length) * 100);

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

  const startGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsedSeconds(0);
    setPlots(INITIAL_PLOTS);
    setFallingLeaves([
      { id: 1, xPercent: 22, yPercent: 75, rotation: 15 },
      { id: 2, xPercent: 50, yPercent: 82, rotation: -25 },
      { id: 3, xPercent: 76, yPercent: 70, rotation: 40 },
    ]);
    setInteractionsCount(0);
    setPausedCount(0);
    setActiveTool('seed');
    setToastMessage('Tap an empty plot to plant a seed');
    setScreenState('playing');
  };

  const handleFinishGarden = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScreenState('completed');

    const seedsPlanted = plots.filter((p) => p.stage !== 'empty').length;
    const plantsWatered = plots.filter((p) => p.waterLevel > 0).length;
    const leavesCleared = 3 - fallingLeaves.length;

    const metrics: CalmGardenMetrics = {
      seedsPlanted,
      plantsWatered,
      leavesCleared,
      interactionsCount,
      growthProgress: growthPercent,
      sessionDuration: elapsedSeconds || 90,
      pausedCount,
    };

    await onComplete({
      status: 'COMPLETED',
      durationSeconds: elapsedSeconds || 90,
      resultSummary: `Calm Garden session completed: ${totalBlooms} flowers bloomed, ${interactionsCount} mindful interactions over ${Math.round((elapsedSeconds || 90) / 60)} minutes.`,
      accuracy: 100,
      metrics,
    });
  };

  // Plot Interaction
  const handlePlotClick = (plot: PlantPlot) => {
    if (screenState !== 'playing') return;
    setInteractionsCount((prev) => prev + 1);

    if (activeTool === 'seed') {
      if (plot.stage === 'empty') {
        setPlots((prev) =>
          prev.map((p) => (p.id === plot.id ? { ...p, stage: 'seed', waterLevel: 20 } : p))
        );
        setToastMessage('Seed planted! Switch to the Water Droplet to help it grow.');
      } else {
        setToastMessage('This plot already has a plant. Try the Water Droplet.');
      }
    } else if (activeTool === 'water') {
      if (plot.stage === 'empty') {
        setToastMessage('Plant a seed here first using the Seed tool.');
      } else {
        setPlots((prev) =>
          prev.map((p) => {
            if (p.id !== plot.id) return p;
            const newWater = Math.min(p.waterLevel + 40, 100);
            let nextStage = p.stage;
            if (newWater >= 70) nextStage = 'bloom';
            else if (newWater >= 30) nextStage = 'sprout';
            return { ...p, waterLevel: newWater, stage: nextStage };
          })
        );
        setToastMessage('Gently watered! Watch the calm petals flourish.');
      }
    }
  };

  // Water Dragging Support
  const handleContainerPointerMove = (e: React.PointerEvent) => {
    if (activeTool !== 'water' || screenState !== 'playing') return;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropletPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Leaf clearing
  const handleClearLeaf = (id: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setInteractionsCount((prev) => prev + 1);
    setFallingLeaves((prev) => prev.filter((leaf) => leaf.id !== id));
    setToastMessage('Gently brushed away a fallen leaf.');
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
        game={CALM_GARDEN_DEF}
        instructions={[
          'Select the Seed Tool and tap empty garden plots to plant soothing flora.',
          'Switch to the Water Droplet to gently shower your plants and help them bloom.',
          'Swipe or tap away falling leaves to keep your sanctuary tidy and peaceful.',
          'Take your time. There is no score, no time pressure, and no way to fail.',
        ]}
        tips={[
          'Enjoy the natural growth animation.',
          'You can complete your garden whenever you feel refreshed.',
        ]}
        onStart={startGame}
        onBack={onExit}
      />
    );
  }

  if (screenState === 'completed') {
    return (
      <SafeResultView
        game={CALM_GARDEN_DEF}
        heading="Your garden is growing."
        subheading="Taking a quiet pause can be a helpful part of a busy day."
        insightText="You often choose calming activities. Keep taking small moments for yourself."
        stats={[
          { label: 'Flowers Bloomed', value: `${totalBlooms} of ${plots.length}` },
          { label: 'Mindful Touches', value: interactionsCount },
          { label: 'Leaves Tidied', value: 3 - fallingLeaves.length },
          { label: 'Time Spent', value: `${Math.round(elapsedSeconds)}s` },
        ]}
        onPlayAgain={startGame}
        onExit={onExit}
        isSaving={isSaving}
      />
    );
  }

  return (
    <GameShell
      game={CALM_GARDEN_DEF}
      timerFormatted={formatTimeMMSS(elapsedSeconds)}
      progressPercent={growthPercent}
      onPause={handlePause}
      onRestart={startGame}
      onExit={onExit}
      isPaused={screenState === 'paused'}
      extraHeaderInfo={
        <div className="flex items-center gap-2 bg-teal-50 text-teal-700 font-semibold px-3 py-1 rounded-xl text-xs">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          <span>{totalBlooms}/{plots.length} Bloomed</span>
        </div>
      }
    >
      {/* Garden Canvas Container */}
      <div
        ref={containerRef}
        onPointerMove={handleContainerPointerMove}
        className="relative w-full h-[480px] sm:h-[540px] bg-gradient-to-b from-sky-100 via-teal-50/40 to-emerald-100/60 overflow-hidden select-none p-4 sm:p-6 flex flex-col justify-between"
      >
        {/* Soft Sunbeams & Ambient Glow */}
        <div className="absolute top-0 right-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-8 left-12 w-48 h-48 bg-teal-200/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top Floating Tools Bar */}
        <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setActiveTool('seed');
                setToastMessage('Plant mode active: tap any empty plot.');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTool === 'seed'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>1. Plant Seed</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool('water');
                setToastMessage('Water mode active: tap or drag droplet over plots.');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTool === 'water'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Droplet className="w-4 h-4" />
              <span>2. Water Droplet</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool('tidy');
                setToastMessage('Tidy mode active: tap fallen leaves to brush them away.');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTool === 'tidy'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Leaf className="w-4 h-4" />
              <span>3. Tidy Leaves</span>
            </button>
          </div>

          {/* Complete Sanctuary Button */}
          <Button
            type="button"
            size="sm"
            onClick={handleFinishGarden}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Sanctuary
          </Button>
        </div>

        {/* Gentle Toast Guidance */}
        {toastMessage && (
          <div className="relative z-10 text-center my-1">
            <span className="inline-block bg-white/80 backdrop-blur-sm text-slate-700 text-xs px-3.5 py-1.5 rounded-full border border-slate-200/60 font-medium shadow-2xs">
              {toastMessage}
            </span>
          </div>
        )}

        {/* 5 Plant Plots Garden Bed */}
        <div className="relative z-10 grid grid-cols-5 gap-2 sm:gap-4 max-w-2xl mx-auto w-full mb-4">
          {plots.map((plot) => (
            <div
              key={plot.id}
              onClick={() => handlePlotClick(plot)}
              className="group cursor-pointer flex flex-col items-center justify-end h-52 sm:h-60 rounded-2xl p-2 transition-all transform hover:-translate-y-1"
            >
              {/* Plant Visual Animation */}
              <div className="relative w-full flex-1 flex items-end justify-center mb-1">
                {plot.stage === 'empty' && (
                  <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-emerald-400 group-hover:text-emerald-500 transition-colors">
                    <Sprout className="w-4 h-4" />
                  </div>
                )}

                {plot.stage === 'seed' && (
                  <motion.div
                    initial={{ scale: 0.5, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-4 h-5 rounded-full bg-amber-800 shadow-sm" />
                    <span className="text-[10px] text-amber-700 font-semibold mt-1">Seed</span>
                  </motion.div>
                )}

                {plot.stage === 'sprout' && (
                  <motion.div
                    initial={{ scale: 0.6, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      animate={{ rotate: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      className="w-10 h-14 text-emerald-500 flex items-center justify-center"
                    >
                      <Sprout className="w-8 h-8" />
                    </motion.div>
                    <span className="text-[10px] text-emerald-700 font-semibold">Sprouting</span>
                  </motion.div>
                )}

                {plot.stage === 'bloom' && (
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      animate={{
                        rotate: [-3, 3, -3],
                        y: [0, -4, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      className="relative flex items-center justify-center"
                      style={{ color: plot.color }}
                    >
                      <Flower2 className="w-12 h-12 sm:w-16 sm:h-16 filter drop-shadow-md" />
                      <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 animate-pulse" />
                    </motion.div>
                    <span
                      className="text-[11px] font-bold mt-1 px-2 py-0.5 rounded-md bg-white/90 shadow-2xs"
                      style={{ color: plot.color }}
                    >
                      {plot.name}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Garden Soil Pot / Mound */}
              <div className="w-full h-12 sm:h-14 rounded-2xl bg-gradient-to-b from-amber-900/80 to-amber-950 border-2 border-amber-800 shadow-md flex flex-col items-center justify-center px-1">
                <div className="w-10/12 h-1 rounded-full bg-amber-700/60 mb-1" />
                <span className="text-[10px] text-amber-200/90 font-medium truncate">
                  {plot.name}
                </span>
                {plot.stage !== 'empty' && (
                  <div className="w-8/12 bg-amber-950 rounded-full h-1 mt-0.5 overflow-hidden">
                    <div
                      className="bg-sky-400 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${plot.waterLevel}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Fallen Leaves (Swipeable / Clickable) */}
        {fallingLeaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              left: `${leaf.xPercent}%`,
              top: `${leaf.yPercent}%`,
              transform: `rotate(${leaf.rotation}deg)`,
            }}
            onClick={(e) => handleClearLeaf(leaf.id, e)}
            onTouchStart={(e) => handleClearLeaf(leaf.id, e)}
            className="absolute z-20 cursor-pointer p-2 text-amber-600/80 hover:text-amber-800 transition-colors"
            title="Tap to tidy leaf"
          >
            <Leaf className="w-7 h-7 filter drop-shadow" />
          </motion.div>
        ))}

        {/* Floating Water Droplet Cursor Follower (in water mode) */}
        {activeTool === 'water' && dropletPos && (
          <motion.div
            style={{ left: dropletPos.x, top: dropletPos.y }}
            className="absolute z-30 pointer-events-none -ml-4 -mt-4 text-sky-500 filter drop-shadow-lg"
          >
            <Droplet className="w-8 h-8 fill-sky-400" />
          </motion.div>
        )}
      </div>

      <PauseModal
        isOpen={screenState === 'paused'}
        onResume={handleResume}
        onRestart={startGame}
        onExit={onExit}
      />
    </GameShell>
  );
};
