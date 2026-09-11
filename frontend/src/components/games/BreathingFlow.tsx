import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Pause, RotateCcw, X, CheckCircle2, Wind, MessageSquare, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { gameService } from '../../services/gameService';
import type { CrisisAlert } from '../../services/gameService';

interface BreathingFlowProps {
  onExit: () => void;
  onCompleted?: () => void;
  onCrisisAlert?: (alert: CrisisAlert) => void;
}

type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';
type GameStep = 'pre_checkin' | 'duration_select' | 'breathing' | 'post_checkin' | 'optional_reflection' | 'completed';

const PHASE_DURATIONS: Record<BreathPhase, number> = {
  inhale: 4,
  holdIn: 4,
  exhale: 4,
  holdOut: 2,
};

const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: 'Breathe in',
  holdIn: 'Hold gently',
  exhale: 'Breathe out slowly',
  holdOut: 'Rest',
};

const PRE_FEELINGS = [
  { id: 'low_energy', label: 'Low energy', desc: 'Feeling fatigued or depleted' },
  { id: 'tense', label: 'Tense', desc: 'Tightness in neck, chest, or mind' },
  { id: 'okay', label: 'Okay', desc: 'Neutral, getting through the day' },
  { id: 'calm', label: 'Calm', desc: 'Relatively settled and steady' },
];

const POST_FEELINGS = [
  { id: 'better', label: 'A little better', desc: 'Slightly lighter or more relaxed' },
  { id: 'same', label: 'About the same', desc: 'Similar baseline as before' },
  { id: 'overwhelmed', label: 'Still overwhelmed', desc: 'Tension remains high' },
];

export const BreathingFlow: React.FC<BreathingFlowProps> = ({ onExit, onCompleted, onCrisisAlert }) => {
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState<GameStep>('pre_checkin');
  const [preFeeling, setPreFeeling] = useState<string | null>(null);
  const [postFeeling, setPostFeeling] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [insightMessage, setInsightMessage] = useState<string>('');

  const [selectedDuration, setSelectedDuration] = useState<number>(120); // 2 minutes
  const [totalTimeLeft, setTotalTimeLeft] = useState<number>(120);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalElapsed = selectedDuration - totalTimeLeft;

  // Start backend session
  const startSession = async (preVal?: string) => {
    try {
      const res = await gameService.startSession('BREATHING_FLOW', preVal || preFeeling || undefined, {
        targetDurationMinutes: selectedDuration / 60,
      });
      if (res.data?._id) setSessionId(res.data._id);
    } catch (e) {
      console.error('Failed to initialize breathing session:', e);
    }
  };

  const handlePreCheckinSelect = (id: string) => {
    setPreFeeling(id);
    setStep('duration_select');
  };

  const handleSkipPreCheckin = () => {
    setStep('duration_select');
  };

  const handleBeginBreathing = (duration: number) => {
    setSelectedDuration(duration);
    setTotalTimeLeft(duration);
    setIsActive(true);
    setPhase('inhale');
    setPhaseSecondsLeft(PHASE_DURATIONS.inhale);
    setStep('breathing');
    startSession();
  };

  const handleBreathingFinished = useCallback(() => {
    setIsActive(false);
    setStep('post_checkin');
  }, []);

  // Main breathing & timer tick loop
  useEffect(() => {
    if (step !== 'breathing' || !isActive) return;

    timerRef.current = setInterval(() => {
      setTotalTimeLeft((prevTotal) => {
        if (prevTotal <= 1) {
          clearInterval(timerRef.current!);
          handleBreathingFinished();
          return 0;
        }
        return prevTotal - 1;
      });

      setPhaseSecondsLeft((prevPhaseSec) => {
        if (prevPhaseSec <= 1) {
          setPhase((currentPhase) => {
            if (currentPhase === 'inhale') return 'holdIn';
            if (currentPhase === 'holdIn') return 'exhale';
            if (currentPhase === 'exhale') return 'holdOut';
            return 'inhale';
          });
          return PHASE_DURATIONS[
            phase === 'inhale' ? 'holdIn' : phase === 'holdIn' ? 'exhale' : phase === 'exhale' ? 'holdOut' : 'inhale'
          ];
        }
        return prevPhaseSec - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, isActive, phase, handleBreathingFinished]);

  const handlePostCheckinSelect = (id: string) => {
    setPostFeeling(id);
    setStep('optional_reflection');
  };

  const handleSaveReflection = async (skip: boolean = false) => {
    if (sessionId) {
      try {
        const payload: any = {
          status: 'COMPLETED',
          durationSeconds: selectedDuration,
          postCheckin: postFeeling || undefined,
          resultSummary: `Completed ${selectedDuration / 60}m breathing reset`,
        };

        if (!skip && reflectionText.trim().length > 0) {
          payload.reflection = {
            question: 'What helped you feel a little better during this pause?',
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
        console.error('Failed to complete breathing session:', e);
      }
    } else {
      setInsightMessage(
        postFeeling === 'overwhelmed'
          ? 'It is okay if a short activity did not change everything. You can try another gentle reset, talk with AI Support, or explore counselor support.'
          : 'You gave yourself intentional time to slow down. Small pauses support your everyday resilience.'
      );
    }

    if (onCompleted) onCompleted();
    setStep('completed');
  };

  const handlePauseResume = () => {
    setIsActive(!isActive);
  };

  const handleRestart = () => {
    setStep('duration_select');
    setIsActive(false);
    setTotalTimeLeft(selectedDuration);
    setPreFeeling(null);
    setPostFeeling(null);
    setReflectionText('');
  };

  const handleExitSession = async () => {
    if (sessionId && step === 'breathing' && totalElapsed > 5) {
      try {
        await gameService.completeSession(sessionId, {
          status: 'ABANDONED',
          durationSeconds: totalElapsed,
          resultSummary: `Partial breathing session (${totalElapsed}s)`,
        });
      } catch (e) {
        console.error('Failed to record partial session:', e);
      }
    }
    onExit();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const progressPercent = ((selectedDuration - totalTimeLeft) / selectedDuration) * 100;

  const getScale = () => {
    if (shouldReduceMotion) return 1;
    if (phase === 'inhale' || phase === 'holdIn') return 1.35;
    if (phase === 'exhale') return 0.85;
    return 0.9;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 max-w-xl mx-auto flex flex-col items-center justify-between min-h-[520px] transition-all">
      {/* Top Bar Controls */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Breathing Flow</h3>
            <p className="text-[11px] text-slate-500 font-medium">Calm & somatic regulation</p>
          </div>
        </div>

        <button
          onClick={handleExitSession}
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Step 1 of 3 · Self-Reflection
            </span>
            <h4 className="text-base font-bold text-[#172033]">How do you feel right now?</h4>
            <p className="text-xs text-slate-500">
              Noticing your baseline before an activity helps build self-awareness.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {PRE_FEELINGS.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePreCheckinSelect(item.id)}
                className="p-3.5 rounded-2xl border border-slate-200 text-left hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group"
              >
                <p className="text-xs font-bold text-[#172033] group-hover:text-indigo-600">
                  {item.label}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
              </button>
            ))}
          </div>

          <button
            onClick={handleSkipPreCheckin}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer underline"
          >
            Skip check-in & start breathing directly
          </button>
        </div>
      )}

      {/* STEP 2: DURATION SELECTION */}
      {step === 'duration_select' && (
        <div className="my-auto py-6 text-center space-y-6 w-full max-w-sm">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Step 2 of 3 · Pacing
            </span>
            <h4 className="text-base font-bold text-[#172033]">Select your reset duration</h4>
            <p className="text-xs text-slate-500">
              Choose how long you want to pause. Even one minute supports nervous system calm.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '1 min', seconds: 60, desc: 'Quick pause' },
              { label: '2 min', seconds: 120, desc: 'Balanced reset' },
              { label: '3 min', seconds: 180, desc: 'Deep calm' },
            ].map((d) => (
              <button
                key={d.seconds}
                onClick={() => setSelectedDuration(d.seconds)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedDuration === d.seconds
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
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
            className="w-full shadow-md font-bold text-xs"
            onClick={() => handleBeginBreathing(selectedDuration)}
          >
            <Play className="w-4 h-4 mr-1.5 fill-current" />
            <span>Begin Guided Breathing</span>
          </Button>
        </div>
      )}

      {/* STEP 3: BREATHING ANIMATION */}
      {step === 'breathing' && (
        <div className="my-auto flex flex-col items-center justify-center py-4 w-full space-y-6">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <motion.div
              animate={{
                scale: getScale(),
                opacity: phase === 'inhale' || phase === 'holdIn' ? 0.7 : 0.3,
              }}
              transition={{
                duration: PHASE_DURATIONS[phase],
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-100 via-teal-50 to-indigo-50 border border-indigo-200/60"
            />

            <motion.div
              animate={{ scale: getScale() }}
              transition={{
                duration: PHASE_DURATIONS[phase],
                ease: 'easeInOut',
              }}
              className="relative w-40 h-40 rounded-full bg-white border border-indigo-100 shadow-lg flex flex-col items-center justify-center p-4 text-center select-none"
            >
              <span className="text-sm font-extrabold text-[#172033] tracking-tight">
                {PHASE_LABELS[phase]}
              </span>
              <span className="text-xs font-bold text-indigo-600 mt-1">
                {phaseSecondsLeft}s
              </span>
            </motion.div>
          </div>

          <div className="w-full max-w-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Time Remaining</span>
              <span className="font-mono text-slate-700">{formatTime(totalTimeLeft)}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
              <motion.div
                className="h-full bg-indigo-600 rounded-full"
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Post-Reset Check-in
            </span>
            <h4 className="text-base font-bold text-[#172033]">How do you feel after this pause?</h4>
            <p className="text-xs text-slate-500">
              There is no required response. Notice your honest state.
            </p>
          </div>

          <div className="space-y-2.5">
            {POST_FEELINGS.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePostCheckinSelect(item.id)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 text-left hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-[#172033] group-hover:text-indigo-600">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: OPTIONAL REFLECTION */}
      {step === 'optional_reflection' && (
        <div className="my-auto py-4 space-y-4 w-full max-w-md">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Optional Self-Reflection
            </span>
            <h4 className="text-sm font-bold text-[#172033]">
              Would you like to save a short reflection?
            </h4>
            <p className="text-xs text-slate-500">
              Optional and confidential. You can skip anytime without losing your reset log.
            </p>
          </div>

          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="What is on your mind today? What helped you feel a little better?"
            rows={3}
            className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => handleSaveReflection(true)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Skip reflection
            </button>
            <Button size="sm" onClick={() => handleSaveReflection(false)}>
              Save & Complete
            </Button>
          </div>
        </div>
      )}

      {/* STEP 6: COMPLETION & NON-DIAGNOSTIC INSIGHT */}
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
            <h4 className="text-lg font-bold text-[#172033]">Reset Complete</h4>
            <p className="text-xs text-slate-500 font-normal">
              You showed up for yourself.
            </p>
          </div>

          {/* Non-Diagnostic Pattern Insight */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 text-left space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-indigo-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Self-Reflection Insight</span>
            </div>
            <p className="text-[11px] text-indigo-950 leading-relaxed font-normal">
              {insightMessage ||
                'You gave yourself intentional time to slow down. Small pauses support your everyday resilience.'}
            </p>
          </div>

          {/* Supportive Overwhelmed Recovery Prompt if student marked still overwhelmed */}
          {postFeeling === 'overwhelmed' && (
            <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-left space-y-2">
              <p className="text-xs font-bold text-rose-900">Feeling persistent pressure?</p>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                It is okay if a short activity did not change everything. Talking with someone can help lighten the load.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <Link to="/ai-assistant">
                  <Button variant="secondary" size="sm" className="text-[11px] h-8 bg-white">
                    <MessageSquare className="w-3 h-3 mr-1 text-indigo-600" />
                    <span>AI Support</span>
                  </Button>
                </Link>
                <Link to="/counselors">
                  <Button variant="secondary" size="sm" className="text-[11px] h-8 bg-white">
                    <UserCheck className="w-3 h-3 mr-1 text-emerald-600" />
                    <span>Counselors</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleRestart} className="w-full sm:w-auto">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>Practice Again</span>
            </Button>
            <Button variant="primary" size="sm" onClick={onExit} className="w-full sm:w-auto shadow-xs">
              Return to Menu
            </Button>
          </div>
        </motion.div>
      )}

      {/* Bottom Session Controls (While breathing) */}
      {step === 'breathing' && (
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

export default BreathingFlow;
