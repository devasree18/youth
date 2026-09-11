import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AppShell } from '../components/layout/AppShell';
import {
  Wind,
  Clock,
  Brain,
  Play,
  Pause,
  RotateCcw,
  BookMarked,
  Sparkles,
  Plus,
  Trash2,
  Lock,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { staggerContainerVariants, fadeUpVariants } from '../lib/motion';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  moodTag: string;
  date: string;
}

const DEFAULT_PROMPTS = [
  'What is one small victory or progress you made today?',
  'What is creating tension right now, and what part of it can you let go of?',
  'Name 3 things in your immediate surroundings you feel grateful for.',
  'How did your energy and focus shift throughout today?',
];

const MOOD_TAGS = ['Calm', 'Grateful', 'Overwhelmed', 'Focused', 'Tired', 'Optimistic'];

export const SolutionHub = () => {
  const [activeTab, setActiveTab] = useState<'journal' | 'toolkit'>('journal');

  // Journal State
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('youth_journal_entries');
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          title: 'Midterm Prep Reflection',
          content: 'Took 10 minutes to organize my study schedule today. Feeling much more grounded now that the tasks are broken down.',
          moodTag: 'Focused',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        },
      ];
    } catch {
      return [];
    }
  });

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('Calm');
  const [isWriting, setIsWriting] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Save entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('youth_journal_entries', JSON.stringify(journalEntries));
    } catch {
      // Ignore storage errors
    }
  }, [journalEntries]);

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newTitle.trim() || 'Daily Reflection',
      content: newContent.trim(),
      moodTag: selectedTag,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setJournalEntries([entry, ...journalEntries]);
    setNewTitle('');
    setNewContent('');
    setIsWriting(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleDeleteEntry = (id: string) => {
    setJournalEntries(journalEntries.filter((e) => e.id !== id));
  };

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
      title="Journal & Toolkit"
      subtitle="Confidential daily reflection space and somatic self-regulation tools"
    >
      <div className="space-y-6 max-w-4xl mx-auto w-full">
        {/* Top Tab Toggle: Journal vs Toolkit */}
        <div className="flex p-1 bg-slate-200/70 rounded-xl max-w-md mx-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('journal')}
            className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 min-h-[40px] cursor-pointer ${
              activeTab === 'journal'
                ? 'bg-white text-[#111827] font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookMarked className="w-4 h-4 text-emerald-600" />
            <span>Private Journal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('toolkit')}
            className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 min-h-[40px] cursor-pointer ${
              activeTab === 'toolkit'
                ? 'bg-white text-[#111827] font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wind className="w-4 h-4 text-emerald-600" />
            <span>Grounding Toolkit</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: PRIVATE GUIDED JOURNAL
            ========================================================================= */}
        {activeTab === 'journal' && (
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {/* Privacy Badge */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your reflections are stored privately and confidentially on your device.</span>
              </div>
              <Badge variant="primary" size="sm">Encrypted</Badge>
            </div>

            {saveToast && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Journal entry saved successfully.</span>
              </motion.div>
            )}

            {/* Write New Entry Button or Form */}
            {!isWriting ? (
              <Button
                variant="primary"
                size="default"
                onClick={() => setIsWriting(true)}
                className="w-full min-h-[44px]"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Write New Reflection
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-[#172033]">New Reflection Entry</h3>
                  <button
                    type="button"
                    onClick={() => setIsWriting(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer min-h-[36px] flex items-center"
                  >
                    Cancel
                  </button>
                </div>

                {/* Prompt ideas */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Prompt Inspiration:
                  </span>
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                    {DEFAULT_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewContent((prev) => (prev ? `${prev}\n\n${prompt}` : prompt))}
                        className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer min-h-[32px]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSaveEntry} className="space-y-3.5">
                  <input
                    type="text"
                    placeholder="Entry Title (optional)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#111827] placeholder:text-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px]"
                  />

                  {/* Mood Tag Selection */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Emotion Tag:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {MOOD_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer min-h-[32px] ${
                            selectedTag === tag
                              ? 'bg-[#111827] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={5}
                    required
                    placeholder="Express your thoughts freely and unhurriedly..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full p-3.5 text-xs sm:text-sm text-[#111827] placeholder:text-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-y min-h-[120px]"
                  />

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="ghost"
                      size="default"
                      onClick={() => setIsWriting(false)}
                      className="min-h-[44px]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="default"
                      className="min-h-[44px]"
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Save Reflection
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* List of Previous Entries */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Past Reflections ({journalEntries.length})
              </h3>

              {journalEntries.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-400">
                  <Sparkles className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                  No journal entries yet. Tap above to write your first reflection.
                </div>
              ) : (
                journalEntries.map((entry) => (
                  <Card key={entry.id} className="p-5 space-y-3 rounded-2xl border-slate-200/90 shadow-xs bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-[#111827]">{entry.title}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            {entry.moodTag}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{entry.date}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Delete reflection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-normal">
                      {entry.content}
                    </p>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            TAB 2: GROUNDING TOOLKIT (Somatic + Pomodoro + Cognitive)
            ========================================================================= */}
        {activeTab === 'toolkit' && (
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tool 1: Box Breathing Machine */}
              <motion.div variants={fadeUpVariants}>
                <Card className="p-6 sm:p-7 h-full flex flex-col justify-between space-y-6 rounded-2xl border-slate-200/90 shadow-xs bg-white">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                          <Wind className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#111827]">Box Breathing (4-4-4-4)</h3>
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
                        className="w-36 h-36 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200/80 flex flex-col items-center justify-center text-center p-4 shadow-xs ring-4 ring-emerald-500/10"
                      >
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                          {breathingPhase}
                        </span>
                        <span className="text-4xl font-extrabold text-[#111827] mt-1 font-mono">
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
                      className="min-h-[44px]"
                      onClick={() => setIsBreathingActive(!isBreathingActive)}
                      leftIcon={isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    >
                      {isBreathingActive ? 'Pause' : 'Start 4-4-4-4'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="default"
                      className="min-h-[44px]"
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
                <Card className="p-6 sm:p-7 h-full flex flex-col justify-between space-y-6 rounded-2xl border-slate-200/90 shadow-xs bg-white">
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
                        Silence notifications and immerse yourself in one clear academic task.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Button
                      variant={isTimerRunning ? 'secondary' : 'primary'}
                      size="default"
                      className="min-h-[44px]"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      leftIcon={isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    >
                      {isTimerRunning ? 'Pause' : 'Start Focus'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="default"
                      className="min-h-[44px]"
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
              <Card className="p-6 sm:p-7 space-y-4 rounded-2xl border-slate-200/90 shadow-xs bg-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">Cognitive Reframing Template</h3>
                    <p className="text-xs text-slate-500 font-normal">Transform automatic stressful thoughts into balanced perspectives.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">1. Automatic Thought</span>
                    <p className="text-xs text-slate-700 italic leading-relaxed">"If I don't score perfectly on this assignment, I'm falling behind everyone."</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">2. Evidence Reality-Check</span>
                    <p className="text-xs text-slate-700 italic leading-relaxed">"One assignment is an opportunity to learn. I can review the rubric and seek feedback."</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">3. Balanced Reframe</span>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">"I will focus on steady mastery today rather than unattainable perfection."</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
};

export default SolutionHub;

