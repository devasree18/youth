import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, HeartHandshake, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { gameService } from '../../services/gameService';
import type { CrisisAlert } from '../../services/gameService';

interface MoodMatchProps {
  onExit: () => void;
  onCompleted?: () => void;
  onCrisisAlert?: (alert: CrisisAlert) => void;
}

interface PromptOption {
  emotion: string;
  description: string;
  reflection: string;
}

interface PromptItem {
  id: number;
  category: string;
  situation: string;
  contextNote: string;
  options: PromptOption[];
}

const PROMPTS: PromptItem[] = [
  {
    id: 1,
    category: 'Exam Pressure & Deadlines',
    situation: 'You have multiple assignments due in 48 hours and notice your jaw clenching.',
    contextNote: 'Physical holding patterns under academic pressure.',
    options: [
      {
        emotion: 'Overwhelmed',
        description: 'Too many competing demands at once',
        reflection: 'Feeling overwhelmed before a deadline is common. Breaking your day into single 25-minute blocks provides immediate relief.',
      },
      {
        emotion: 'Determined & Tense',
        description: 'Laser-focused, but running on high adrenaline',
        reflection: 'High drive is powerful, but adrenaline drains energy rapidly without intentional micro-breaks.',
      },
      {
        emotion: 'Anxious',
        description: 'Worrying about performance and outcome',
        reflection: 'Anxiety is your nervous system trying to protect your future. Acknowledge the care you have for your work, then return to the immediate task.',
      },
      {
        emotion: 'Fatigued',
        description: 'Low cognitive energy and brain fog',
        reflection: 'Brain fatigue is physical. Ten minutes of shut-eye or fresh air will sharpen your comprehension faster than forcing tired eyes.',
      },
    ],
  },
  {
    id: 2,
    category: 'Friendship & Social Dynamics',
    situation: 'A close friend hasn’t replied to your messages all day, and you catch yourself overthinking.',
    contextNote: 'Social perception and relational security.',
    options: [
      {
        emotion: 'Insecure',
        description: 'Wondering if you said or did something wrong',
        reflection: 'Our minds naturally invent worst-case stories when information is absent. Most delays are simply busy schedules, not personal judgment.',
      },
      {
        emotion: 'Understanding',
        description: 'Recognizing they may be busy or drained',
        reflection: 'Holding empathetic space for friends without taking delays personally is a hallmark of healthy emotional boundaries.',
      },
      {
        emotion: 'Disconnected',
        description: 'Feeling distant and wanting reassurance',
        reflection: 'The desire for connection is fundamental. Giving yourself quiet comfort right now reduces reliance on immediate replies.',
      },
      {
        emotion: 'Distracted',
        description: 'Checking notifications repeatedly',
        reflection: 'Phone-checking is an attempt to self-soothe. Setting your device aside for an hour frees mental bandwidth.',
      },
    ],
  },
  {
    id: 3,
    category: 'Sleep & Daily Recovery',
    situation: 'You slept only 4 hours due to late studying and have an 8:30 AM class.',
    contextNote: 'Sleep debt and cognitive restoration.',
    options: [
      {
        emotion: 'Fuzzy / Depleted',
        description: 'Low bandwidth and slow processing',
        reflection: 'Sleep deprivation impairs emotional regulation. Treat yourself with extra gentleness today and avoid major decisions.',
      },
      {
        emotion: 'Irritable',
        description: 'Small inconveniences feel extra annoying',
        reflection: 'Low sleep lowers your patience threshold. Recognizing this prevents taking normal campus friction personally.',
      },
      {
        emotion: 'Resigned',
        description: 'Accepting that today will be low-gear',
        reflection: 'Acceptance prevents wasting energy on frustration. Focus on getting through essentials, then prioritize an early bedtime.',
      },
      {
        emotion: 'Alert on Caffeine',
        description: 'Artificially energized, but body feels heavy',
        reflection: 'Caffeine masks fatigue without restoring cognitive stores. Stay well-hydrated to reduce jitteriness.',
      },
    ],
  },
  {
    id: 4,
    category: 'Family Expectations',
    situation: 'Your family asks about your career plans and upcoming grades over the weekend call.',
    contextNote: 'External standards and personal autonomy.',
    options: [
      {
        emotion: 'Pressured',
        description: 'Feeling the weight of high expectations',
        reflection: 'Family care can feel like heavy scrutiny. Remind yourself that your worth is not measured exclusively by performance.',
      },
      {
        emotion: 'Supported',
        description: 'Appreciating their active interest in your future',
        reflection: 'Receiving constructive family interest provides strong emotional scaffolding when boundaries remain clear.',
      },
      {
        emotion: 'Guilty',
        description: 'Worrying you aren’t doing enough',
        reflection: 'Guilt is often unhelpful self-criticism. Focusing on your daily controllable effort is what truly builds capability.',
      },
      {
        emotion: 'Conflicted',
        description: 'Balancing their desires with your own path',
        reflection: 'Navigating independence alongside familial bonds is a natural transition of university life.',
      },
    ],
  },
  {
    id: 5,
    category: 'Achievement & Decompression',
    situation: 'You submitted a major semester project that you had worked on for weeks.',
    contextNote: 'Post-adrenaline decompression.',
    options: [
      {
        emotion: 'Relieved',
        description: 'A noticeable weight lifted from your mind',
        reflection: 'Let your body absorb the completion. Give yourself permission to step back without immediately searching for the next task.',
      },
      {
        emotion: 'Numb / Anti-climactic',
        description: 'No intense joy, just quiet exhaustion',
        reflection: 'Post-milestone numbness is very common. When adrenaline drops, the nervous system needs quiet recovery before feeling joy.',
      },
      {
        emotion: 'Proud',
        description: 'Deep satisfaction in seeing your effort through',
        reflection: 'Acknowledging your own work builds lasting internal self-efficacy.',
      },
      {
        emotion: 'Restless',
        description: 'Struggling to relax without a deadline',
        reflection: 'When you are used to constant hustle, quiet feels unfamiliar. Practice sitting comfortably in rest.',
      },
    ],
  },
  {
    id: 6,
    category: 'New Environments & Belonging',
    situation: 'You walk into a crowded campus event or lecture hall where you don’t know anyone.',
    contextNote: 'Social courage and belonging.',
    options: [
      {
        emotion: 'Self-Conscious',
        description: 'Wondering if everyone is looking at you',
        reflection: 'The "spotlight effect" leads us to overestimate how much others watch us. Most people are focused on their own social comfort.',
      },
      {
        emotion: 'Curious',
        description: 'Open to discovering someone new',
        reflection: 'Curiosity transforms social tension into gentle exploration.',
      },
      {
        emotion: 'Overstimulated',
        description: 'Too much noise, movement, and chatter',
        reflection: 'Sensory overload is real. Stepping outside for two minutes of fresh air resets auditory processing.',
      },
      {
        emotion: 'Independent',
        description: 'Comfortable attending events solo',
        reflection: 'Comfort in your own company is a tremendous emotional anchor throughout campus life.',
      },
    ],
  },
];

const TODAY_CLOSEST_FEELINGS = [
  'Tense / Overwhelmed',
  'Fatigued / Depleted',
  'Neutral / Steady',
  'Calm / Relieved',
  'Curious / Hopeful',
  'Proud / Content',
];

type Step = 'scenarios' | 'today_checkin' | 'optional_reflection' | 'completed';

export const MoodMatch: React.FC<MoodMatchProps> = ({ onExit, onCompleted, onCrisisAlert }) => {
  const [step, setStep] = useState<Step>('scenarios');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [todayFeeling, setTodayFeeling] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [insightMessage, setInsightMessage] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime] = useState<number>(() => Date.now());

  useEffect(() => {
    const init = async () => {
      try {
        const res = await gameService.startSession('MOOD_MATCH', undefined, {
          totalPrompts: PROMPTS.length,
        });
        if (res.data?._id) setSessionId(res.data._id);
      } catch (e) {
        console.error('Failed to start mood match session:', e);
      }
    };
    init();
  }, []);

  const currentPrompt = PROMPTS[currentIndex];

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
  };

  const handleNextPrompt = () => {
    if (currentIndex < PROMPTS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setStep('today_checkin');
    }
  };

  const handleTodayFeelingSelect = (feeling: string) => {
    setTodayFeeling(feeling);
    setStep('optional_reflection');
  };

  const handleSaveReflection = async (skip: boolean = false) => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);

    if (sessionId) {
      try {
        const payload: any = {
          status: 'COMPLETED',
          durationSeconds: elapsed,
          postCheckin: todayFeeling || undefined,
          resultSummary: `Completed ${PROMPTS.length} emotional awareness reflections`,
        };

        if (!skip && reflectionText.trim().length > 0) {
          payload.reflection = {
            question: 'What is one emotion you noticed in yourself today?',
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
        console.error('Failed to complete mood match session:', e);
      }
    } else {
      setInsightMessage(
        'Naming what you feel makes it easier to understand. Emotional awareness is a muscle you can strengthen anytime.'
      );
    }

    if (onCompleted) onCompleted();
    setStep('completed');
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setTodayFeeling(null);
    setReflectionText('');
    setStep('scenarios');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 max-w-xl mx-auto flex flex-col justify-between min-h-[520px] transition-all">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Mood Match</h3>
            <p className="text-[11px] text-slate-500 font-medium">Emotional awareness & situation reflection</p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Exit to menu"
          aria-label="Exit to menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* STEP 1: SCENARIOS */}
      {step === 'scenarios' && (
        <div className="my-auto py-4 space-y-4 w-full">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>
              Scenario {currentIndex + 1} of {PROMPTS.length} · {currentPrompt.category}
            </span>
            <span className="text-[11px] font-medium text-slate-400">All emotions are valid</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-1">
            <p className="text-sm font-bold text-[#172033] leading-relaxed">
              &ldquo;{currentPrompt.situation}&rdquo;
            </p>
            <p className="text-[11px] text-slate-500 font-normal">{currentPrompt.contextNote}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-600">Which emotion resonates closest?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentPrompt.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={opt.emotion}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-violet-600 bg-violet-50/70 shadow-xs'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <p className="text-xs font-bold text-[#172033]">{opt.emotion}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-normal leading-tight">
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-violet-50/60 border border-violet-100/80 text-xs text-violet-950 space-y-0.5"
            >
              <span className="font-bold text-violet-700 block">Educational Reflection:</span>
              <p className="text-[11px] text-violet-900 leading-relaxed font-normal">
                {currentPrompt.options[selectedOption].reflection}
              </p>
            </motion.div>
          )}

          <div className="pt-2 flex items-center justify-end">
            <Button
              size="default"
              disabled={selectedOption === null}
              onClick={handleNextPrompt}
              className="shadow-xs font-bold text-xs px-5 bg-violet-600 hover:bg-violet-700"
            >
              <span>{currentIndex < PROMPTS.length - 1 ? 'Next Scenario' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: TODAY CHECK-IN */}
      {step === 'today_checkin' && (
        <div className="my-auto py-6 text-center space-y-6 w-full max-w-sm">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
              Personal Reflection
            </span>
            <h4 className="text-base font-bold text-[#172033]">Which feeling is closest to yours today?</h4>
            <p className="text-xs text-slate-500">
              Stored only if you choose to save it. You can skip anytime.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {TODAY_CLOSEST_FEELINGS.map((feeling) => (
              <button
                key={feeling}
                onClick={() => handleTodayFeelingSelect(feeling)}
                className="p-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 hover:border-violet-500 hover:bg-violet-50/50 transition-all cursor-pointer text-center"
              >
                {feeling}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleSaveReflection(true)}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer underline"
          >
            Skip & finish reflection
          </button>
        </div>
      )}

      {/* STEP 3: OPTIONAL REFLECTION */}
      {step === 'optional_reflection' && (
        <div className="my-auto py-4 space-y-4 w-full max-w-md">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
              Optional Note
            </span>
            <h4 className="text-sm font-bold text-[#172033]">
              Would you like to save a short reflection?
            </h4>
            <p className="text-xs text-slate-500">
              Naming what you feel makes it easier to process.
            </p>
          </div>

          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="What is one emotion or thought on your mind today?"
            rows={3}
            className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-hidden resize-none"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => handleSaveReflection(true)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Skip reflection
            </button>
            <Button size="sm" onClick={() => handleSaveReflection(false)} className="bg-violet-600 hover:bg-violet-700">
              Save & Complete
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: COMPLETION */}
      {step === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto py-6 text-center space-y-5 max-w-sm mx-auto"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-bold text-[#172033]">Emotional Reflection Complete</h4>
            <p className="text-xs text-slate-500 font-normal">
              Naming what you feel can make it easier to understand.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-violet-50/60 border border-violet-100/80 text-left space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-violet-800 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Self-Reflection Insight</span>
            </div>
            <p className="text-[11px] text-violet-950 leading-relaxed font-normal">
              {insightMessage ||
                'Naming and differentiating emotional states helps reduce internal tension and build practical emotional awareness.'}
            </p>
          </div>

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
    </div>
  );
};

export default MoodMatch;
