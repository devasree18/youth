import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AppShell } from '../components/layout/AppShell';
import { Wind, Clock, Brain, Play, Pause, RotateCcw } from 'lucide-react';
import { staggerContainerVariants, fadeUpVariants } from '../lib/motion';

export const SolutionHub = () => {
  // Box Breathing State
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathCount, setBreathCount] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Focus Timer State
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Box Breathing cycle runner
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathCount((prev) => {
          if (prev > 1) return prev - 1;
          // Phase transition
          setBreathingPhase((curr) => {
            if (curr === 'Inhale') return 'Hold';
            if (curr === 'Hold') return 'Exhale';
            if (curr === 'Exhale') return 'Rest';
            return 'Inhale';
          });
          return 4;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingActive]);

  // Pomodoro focus timer runner
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && focusSeconds > 0) {
      timer = setInterval(() => {
        setFocusSeconds((sec) => sec - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, focusSeconds]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingScale = () => {
    if (!isBreathingActive) return 1;
    if (breathingPhase === 'Inhale') return 1.1;
    if (breathingPhase === 'Hold') return 1.1;
    if (breathingPhase === 'Exhale') return 0.92;
    return 0.95;
  };

  return (
    <AppShell
      title="Solution & Toolkit Hub"
      subtitle="Interactive self-regulation exercises, breathing cycles, and study focus tools"
    >
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-5xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tool 1: Box Breathing Machine */}
          <motion.div variants={fadeUpVariants}>
            <Card className="p-6 sm:p-7 h-full flex flex-col justify-between space-y-6 rounded-2xl border-slate-200/90 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                      <Wind className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#172033]">Box Breathing (4-4-4-4)</h3>
                      <p className="text-[11px] text-slate-500 font-normal">Regulate autonomic nervous system</p>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm">Somatic</Badge>
                </div>

                {/* Breathing visualizer box with smooth motion */}
                <div className="my-8 flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ scale: getBreathingScale() }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="w-36 h-36 rounded-3xl bg-indigo-50/70 border-2 border-indigo-200/80 flex flex-col items-center justify-center text-center p-4 shadow-xs ring-4 ring-indigo-500/10"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      {breathingPhase}
                    </span>
                    <span className="text-4xl font-extrabold text-[#172033] mt-1 font-mono">
                      {breathCount}s
                    </span>
                  </motion.div>
                  <p className="text-xs text-slate-500 mt-4 text-center max-w-xs leading-relaxed font-normal">
                    {breathingPhase === 'Inhale' && 'Breathe in slowly through your nose...'}
                    {breathingPhase === 'Hold' && 'Gently hold your breath with relaxed shoulders...'}
                    {breathingPhase === 'Exhale' && 'Exhale steadily through your mouth...'}
                    {breathingPhase === 'Rest' && 'Pause and rest before the next breath cycle...'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant={isBreathingActive ? 'secondary' : 'primary'}
                  size="default"
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  leftIcon={isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                >
                  {isBreathingActive ? 'Pause Exercise' : 'Start 4-4-4-4 Cycle'}
                </Button>
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => {
                    setIsBreathingActive(false);
                    setBreathingPhase('Inhale');
                    setBreathCount(4);
                  }}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Reset
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Tool 2: Pomodoro Focus Timer */}
          <motion.div variants={fadeUpVariants}>
            <Card className="p-6 sm:p-7 h-full flex flex-col justify-between space-y-6 rounded-2xl border-slate-200/90 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#172033]">Academic Focus Block</h3>
                      <p className="text-[11px] text-slate-500 font-normal">25m deep study + 5m recovery break</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">Productivity</Badge>
                </div>

                {/* Timer clock visualizer */}
                <div className="my-8 flex flex-col items-center justify-center">
                  <div className="w-36 h-36 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200/80 flex flex-col items-center justify-center text-center p-4 shadow-xs ring-4 ring-emerald-500/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      {focusSeconds > 0 ? 'Work Block' : 'Break Time'}
                    </span>
                    <span className="text-3xl font-extrabold text-[#172033] mt-1 font-mono">
                      {formatTimer(focusSeconds)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 text-center max-w-xs leading-relaxed font-normal">
                    Eliminate external notifications and focus on a single priority task.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant={isTimerRunning ? 'secondary' : 'primary'}
                  size="default"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  leftIcon={isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                >
                  {isTimerRunning ? 'Pause Timer' : 'Start Focus (25m)'}
                </Button>
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setFocusSeconds(25 * 60);
                  }}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Reset
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Tool 3: Cognitive Reframing Worksheet */}
        <motion.div variants={fadeUpVariants}>
          <Card className="p-6 sm:p-7 space-y-4 rounded-2xl border-slate-200/90 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Cognitive Reframing Template</h3>
                <p className="text-xs text-slate-500 font-normal">Transform catastrophic assumptions into objective, balanced perspectives.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">1. Automatic Thought</span>
                <p className="text-xs text-slate-700 italic leading-relaxed">"If I do poorly on this exam, my entire degree is ruined."</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">2. Evidence Reality-Check</span>
                <p className="text-xs text-slate-700 italic leading-relaxed">"One exam is 15% of the grade. I can adjust my study habits and attend office hours."</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">3. Adaptive Reframe</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">"I will prepare methodically for each topic and focus on what I can control today."</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AppShell>
  );
};

export default SolutionHub;
