import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Pause, RotateCcw, X, CheckCircle2, Target, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { gameService } from '../../services/gameService';
import type { CrisisAlert } from '../../services/gameService';

interface FocusTapProps {
  onExit: () => void;
  onCompleted?: () => void;
  onCrisisAlert?: (alert: CrisisAlert) => void;
}

interface CircleTarget {
  id: number;
  x: number;
  y: number;
  size: number;
  colorIndex: number;
}

type Step = 'pre_checkin' | 'duration_select' | 'tapping' | 'post_checkin' | 'optional_reflection' | 'completed';

const PASTEL_COLORS = [
  'bg-indigo-500/20 border-indigo-300 text-indigo-700',
  'bg-teal-500/20 border-teal-300 text-teal-700',
  'bg-sky-500/20 border-sky-300 text-sky-700',
  'bg-violet-500/20 border-violet-300 text-violet-700',
];

const PRE_FOCUS_OPTIONS = [
  { id: 'scattered', label: 'Scattered', desc: 'Thoughts racing or distracted' },
  { id: 'moderate', label: 'Moderate', desc: 'Somewhat focused, but drifting' },
  { id: 'clear', label: 'Clear', desc: 'Attentive and steady' },
];

const POST_PRESENCE_OPTIONS = [
  { id: 'yes', label: 'Yes, a little', desc: 'Felt pulled into the present moment' },
  { id: 'no', label: 'Not really', desc: 'Mind remained preoccupied' },
  { id: 'unsure', label: 'I am not sure', desc: 'Hard to tell right now' },
];

export const FocusTap: React.FC<FocusTapProps> = ({ onExit, onCompleted, onCrisisAlert }) => {
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState<Step>('pre_checkin');
  const [preFocus, setPreFocus] = useState<string | null>(null);
  const [postPresence, setPostPresence] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [insightMessage, setInsightMessage] = useState<string>('');

  const [totalSeconds, setTotalSeconds] = useState<number>(30); // 30s or 60s
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentCircle, setCurrentCircle] = useState<CircleTarget | null>(null);
  const [tappedCount, setTappedCount] = useState<number>(0);
  const [totalSpawned, setTotalSpawned] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const circleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spawnRef = useRef<() => void>(() => {});

  const spawnCircle = useCallback(() => {
    const x = Math.floor(Math.random() * 65) + 15;
    const y = Math.floor(Math.random() * 65) + 15;
    const size = Math.floor(Math.random() * 16) + 52;
    const colorIndex = Math.floor(Math.random() * PASTEL_COLORS.length);

    setTotalSpawned((prev) => prev + 1);
    setCurrentCircle({
      id: Date.now(),
      x,
      y,
      size,
      colorIndex,
    });

    if (circleTimerRef.current) clearTimeout(circleTimerRef.current);
    circleTimerRef.current = setTimeout(() => {
      spawnRef.current();
    }, 2400);
  }, []);

  useEffect(() => {
    spawnRef.current = spawnCircle;
  }, [spawnCircle]);

  const handlePreFocusSelect = (id: string) => {
    setPreFocus(id);
    setStep('duration_select');
  };

  const handleStartGame = async (duration: number) => {
    setTotalSeconds(duration);
    setSecondsLeft(duration);
    setIsActive(true);
    setTappedCount(0);
    setTotalSpawned(0);
    setStep('tapping');

    try {
      const res = await gameService.startSession('FOCUS_TAP', preFocus || undefined, {
        durationSeconds: duration,
      });
      if (res.data?._id) setSessionId(res.data._id);
    } catch (e) {
      console.error('Failed to start focus tap session:', e);
    }

    spawnCircle();
  };

  const handleTapFinished = useCallback(() => {
    setIsActive(false);
    setCurrentCircle(null);
    if (circleTimerRef.current) clearTimeout(circleTimerRef.current);
    setStep('post_checkin');
  }, []);

  // 30s / 60s Countdown
  useEffect(() => {
    if (step !== 'tapping' || !isActive) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTapFinished();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (circleTimerRef.current) clearTimeout(circleTimerRef.current);
    };
  }, [step, isActive, handleTapFinished]);

  const handleCircleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTappedCount((prev) => prev + 1);
    if (circleTimerRef.current) clearTimeout(circleTimerRef.current);
    spawnCircle();
  };

  const handlePostPresenceSelect = (id: string) => {
    setPostPresence(id);
    setStep('optional_reflection');
  };

  const handleSaveReflection = async (skip: boolean = false) => {
    const accuracy = totalSpawned > 0 ? Math.min(100, Math.round((tappedCount / totalSpawned) * 100)) : 100;

    if (sessionId) {
      try {
        const payload: any = {
          status: 'COMPLETED',
          durationSeconds: totalSeconds,
          accuracy,
          postCheckin: postPresence || undefined,
          resultSummary: `Tapped ${tappedCount} / ${totalSpawned} focus targets`,
        };

        if (!skip && reflectionText.trim().length > 0) {
          payload.reflection = {
            question: 'What is one thing on your study schedule you can do one step at a time?',
            response: reflectionText.trim(),
          };
        }

        const res = await gameService.completeSession(sessionId, payload);

        if (res.data?.crisisAlert?.isCrisis && onCrisisAlert) {
          onCrisisAlert(res.data.crisisAlert);
          return;
        }

        if (res.data?.session?.insight) {
          setInsightMessage(res.data.session.insight);
        }
      } catch (e) {
        console.error('Failed to complete focus session:', e);
      }
    } else {
      setInsightMessage(
        'You completed a short focus reset. Small breaks can help when studying or preparing for exams.'
      );
    }

    if (onCompleted) onCompleted();
    setStep('completed');
  };

  const handlePauseResume = () => {
    if (isActive) {
      setIsActive(false);
      if (circleTimerRef.current) clearTimeout(circleTimerRef.current);
    } else {
      setIsActive(true);
      spawnCircle();
    }
  };

  const handleRestart = () => {
    setStep('duration_select');
    setIsActive(false);
    setSecondsLeft(totalSeconds);
    setTappedCount(0);
    setTotalSpawned(0);
    setPreFocus(null);
    setPostPresence(null);
    setReflectionText('');
  };

  const handleExit = async () => {
    if (sessionId && step === 'tapping' && secondsLeft < totalSeconds) {
      const elapsed = totalSeconds - secondsLeft;
      try {
        await gameService.completeSession(sessionId, {
          status: 'ABANDONED',
          durationSeconds: elapsed,
          resultSummary: `Partial session (${elapsed}s)`,
        });
      } catch (e) {
        console.error('Failed to exit focus session:', e);
      }
    }
    onExit();
  };

  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const accuracyScore = totalSpawned > 0 ? Math.min(100, Math.round((tappedCount / totalSpawned) * 100)) : 100;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 max-w-xl mx-auto flex flex-col items-center justify-between min-h-[520px] transition-all">
      {/* Top Header Controls */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Focus Tap</h3>
            <p className="text-[11px] text-slate-500 font-medium">Attention reset & present grounding</p>
          </div>
        </div>

        <button
          onClick={handleExit}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Exit to menu"
          aria-label="Exit to menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* STEP 1: PRE-CHECKIN */}
      {step === 'pre_checkin' && (
        <div className="my-auto py-6 text-center space-y-6 w-full max-w-sm">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
              Step 1 of 3 · Self-Observation
            </span>
            <h4 className="text-base font-bold text-[#172033]">How is your focus right now?</h4>
            <p className="text-xs text-slate-500">
              Notice your concentration level without judging your productivity.
            </p>
          </div>

          <div className="space-y-2.5">
            {PRE_FOCUS_OPTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePreFocusSelect(item.id)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 text-left hover:border-teal-400 hover:bg-teal-50/50 transition-all cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-[#172033] group-hover:text-teal-700">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600" />
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep('duration_select')}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer underline"
          >
            Skip check-in & start directly
          </button>
        </div>
      )}

      {/* STEP 2: DURATION SELECTION */}
      {step === 'duration_select' && (
        <div className="my-auto py-6 text-center space-y-6 w-full max-w-sm">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
              Step 2 of 3 · Activity Duration
            </span>
            <h4 className="text-base font-bold text-[#172033]">Select focus duration</h4>
            <p className="text-xs text-slate-500">
              Soft circles appear one at a time. Tap each gently before it fades away.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '30 seconds', seconds: 30, desc: 'Quick sensory break' },
              { label: '60 seconds', seconds: 60, desc: 'Deep focus reset' },
            ].map((d) => (
              <button
                key={d.seconds}
                onClick={() => setTotalSeconds(d.seconds)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  totalSeconds === d.seconds
                    ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-xs'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-sm font-bold">{d.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{d.desc}</div>
              </button>
            ))}
          </div>

          <Button
            size="lg"
            className="w-full shadow-md font-bold text-xs bg-teal-600 hover:bg-teal-700"
            onClick={() => handleStartGame(totalSeconds)}
          >
            <Play className="w-4 h-4 mr-1.5 fill-current" />
            <span>Begin Focus Tap</span>
          </Button>
        </div>
      )}

      {/* STEP 3: TAPPING CANVAS */}
      {step === 'tapping' && (
        <div className="my-auto w-full flex flex-col items-center justify-center space-y-4">
          <div className="relative w-full h-72 sm:h-80 bg-slate-50/70 rounded-2xl border border-slate-200/80 overflow-hidden select-none">
            {currentCircle && isActive && (
              <motion.button
                key={currentCircle.id}
                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
                transition={{ duration: 0.25 }}
                onClick={handleCircleTap}
                style={{
                  position: 'absolute',
                  left: `${currentCircle.x}%`,
                  top: `${currentCircle.y}%`,
                  width: `${currentCircle.size}px`,
                  height: `${currentCircle.size}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`rounded-full border-2 flex items-center justify-center shadow-sm cursor-pointer active:scale-95 transition-transform ${PASTEL_COLORS[currentCircle.colorIndex]}`}
                aria-label="Tap target circle"
              >
                <div className="w-3 h-3 rounded-full bg-current opacity-80" />
              </motion.button>
            )}

            {!isActive && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                <p className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                  Session Paused
                </p>
              </div>
            )}
          </div>

          <div className="w-full max-w-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Time Remaining: {secondsLeft}s</span>
              <span>Moments: {tappedCount}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
              <motion.div
                className="h-full bg-teal-600 rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: POST-CHECKIN */}
      {step === 'post_checkin' && (
        <div className="my-auto py-6 text-center space-y-6 w-full max-w-sm">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
              Post-Activity Reflection
            </span>
            <h4 className="text-base font-bold text-[#172033]">Did this help you feel more present?</h4>
            <p className="text-xs text-slate-500">
              Notice whether anchoring your attention helped quiet racing thoughts.
            </p>
          </div>

          <div className="space-y-2.5">
            {POST_PRESENCE_OPTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePostPresenceSelect(item.id)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 text-left hover:border-teal-400 hover:bg-teal-50/50 transition-all cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-[#172033] group-hover:text-teal-700">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: OPTIONAL REFLECTION */}
      {step === 'optional_reflection' && (
        <div className="my-auto py-4 space-y-4 w-full max-w-md">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
              Optional Self-Reflection
            </span>
            <h4 className="text-sm font-bold text-[#172033]">
              Would you like to save a short focus note?
            </h4>
            <p className="text-xs text-slate-500">
              Confidential and non-diagnostic. You can skip anytime.
            </p>
          </div>

          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="What is one task on your mind that you can break into tiny single steps?"
            rows={3}
            className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden resize-none"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => handleSaveReflection(true)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Skip reflection
            </button>
            <Button size="sm" onClick={() => handleSaveReflection(false)} className="bg-teal-600 hover:bg-teal-700">
              Save & Complete
            </Button>
          </div>
        </div>
      )}

      {/* STEP 6: COMPLETION */}
      {step === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto py-6 text-center space-y-5 max-w-sm"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-bold text-[#172033]">Focus Reset Complete</h4>
            <p className="text-xs text-slate-500 font-normal">
              You spent a moment focusing on the present.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100/80 text-left space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-teal-800 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Self-Reflection Insight</span>
            </div>
            <p className="text-[11px] text-teal-950 leading-relaxed font-normal">
              {insightMessage ||
                'You completed a short focus reset. Small breaks can help when studying or preparing for exams.'}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-around text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">Present Moments</span>
              <span className="font-bold text-slate-700">{tappedCount}</span>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">Focus Rate</span>
              <span className="font-bold text-teal-700">{accuracyScore}%</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleRestart} className="w-full sm:w-auto">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>Try Again</span>
            </Button>
            <Button variant="primary" size="sm" onClick={onExit} className="w-full sm:w-auto shadow-xs">
              Return to Menu
            </Button>
          </div>
        </motion.div>
      )}

      {/* Bottom Session Controls (While tapping) */}
      {step === 'tapping' && (
        <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePauseResume}
            className="min-h-[40px] px-4 font-semibold text-xs"
          >
            {isActive ? (
              <>
                <Pause className="w-3.5 h-3.5 mr-1.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                <span>Resume</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestart}
            className="min-h-[40px] px-4 text-slate-600 hover:text-slate-900 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Restart</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FocusTap;
