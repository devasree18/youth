import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { wellbeingService, type WellbeingSummary } from '../services/wellbeingService';
import { moodService } from '../services/moodService';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { fadeUpVariants, staggerContainerVariants } from '../lib/motion';
import {
  Sparkles,
  MessageSquare,
  ArrowRight,
  Wind,
  CheckCircle2,
  BookOpen,
  Calendar,
  Flame,
  Target,
  Users,
  Compass,
  RefreshCw,
  PhoneCall,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const MOODS = [
  { label: 'Very low', emoji: '😔', value: 'very_low', color: 'hover:border-rose-300 hover:bg-rose-50/60' },
  { label: 'Low', emoji: '😟', value: 'low', color: 'hover:border-amber-300 hover:bg-amber-50/60' },
  { label: 'Okay', emoji: '😐', value: 'okay', color: 'hover:border-slate-300 hover:bg-slate-50' },
  { label: 'Good', emoji: '🙂', value: 'good', color: 'hover:border-teal-300 hover:bg-teal-50/60' },
  { label: 'Great', emoji: '😄', value: 'great', color: 'hover:border-emerald-300 hover:bg-emerald-50/60' },
];

const CLINICAL_TIPS = [
  "Progressive muscle relaxation for 60 seconds decreases sympathetic cortisol spikes by up to 32%.",
  "Cognitive reframing: separate what is in your direct control today from distant hypothetical outcomes.",
  "Taking a 5-minute visual break every 25 minutes restores executive working memory and reduces eye fatigue.",
  "Getting 10 minutes of natural outdoor light before midday locks in your circadian rhythm for restorative sleep.",
  "Vocalizing your stressors—either in writing or talking with an empathetic listener—de-escalates amygdala reactivity.",
];

export const Dashboard = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [summary, setSummary] = useState<WellbeingSummary | null>(null);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  const [tipIndex, setTipIndex] = useState(0);

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const fetchWellbeingSummary = useCallback(async () => {
    try {
      const res = await wellbeingService.getSummary();
      if (res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  }, []);

  useEffect(() => {
    fetchWellbeingSummary();
  }, [fetchWellbeingSummary]);

  const handleMoodSelect = async (moodValue: string) => {
    setSelectedMood(moodValue);

    if (moodValue === 'very_low' || moodValue === 'low') {
      setSavedFeedback("Thank you for checking in. We're here for you—take things gently today.");
    } else if (moodValue === 'okay') {
      setSavedFeedback("Thanks for logging how you feel. Remember to take small restorative breaks throughout your day.");
    } else {
      setSavedFeedback("Glad to hear that! Keep nurturing what's working well for you today.");
    }

    try {
      await moodService.recordMood(moodValue);
      await fetchWellbeingSummary();
    } catch (err) {
      console.error('Failed to record mood:', err);
    }
  };

  const getTodayAction = () => {
    if (selectedMood === 'very_low' || selectedMood === 'low') {
      return {
        icon: Wind,
        title: 'Need a quick nervous reset?',
        description: 'Try a 2-minute somatic 4-7-8 breathing activity to help ease acute tension and ground your body.',
        buttonLabel: 'Start breathing reset',
        link: '/games',
        tag: 'Recommended Reset',
      };
    }
    if (selectedMood === 'good' || selectedMood === 'great') {
      return {
        icon: BookOpen,
        title: 'Explore flow state & study stamina routines',
        description: 'Evidence-based cognitive pacing tips to sustain your energy, avoid burnout, and stay sharp.',
        buttonLabel: 'Read focus guide',
        link: '/resources',
        tag: 'Flow Optimization',
      };
    }
    return {
      icon: Sparkles,
      title: 'Complete today’s wellbeing check-in',
      description: 'A brief 5-question clinical check-in to track your emotional balance and study workload over time.',
      buttonLabel: 'Start check-in',
      link: '/assessment',
      tag: 'Daily Pulse',
    };
  };

  const todayAction = getTodayAction();
  const ActionIcon = todayAction.icon;

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % CLINICAL_TIPS.length);
  };

  return (
    <AppShell title="Home">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainerVariants}
        className="max-w-7xl mx-auto space-y-6 pb-12"
      >
        {/* ==================== 1. HERO GREETING BANNER ==================== */}
        <motion.div
          variants={fadeUpVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-md"
        >
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 border border-white/10">
                  <Calendar className="w-3 h-3 mr-1 text-emerald-300" />
                  {todayDateFormatted}
                </span>
                <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
                  <ShieldCheck className="w-3 h-3 mr-1 text-emerald-300" />
                  Client-Side Private
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                {getTimeOfDayGreeting()}, {firstName}.
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl font-normal leading-relaxed">
                Welcome back to your confidential sanctuary. Check in with your emotional pulse and build daily mental resilience.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <Link to="/ai-assistant">
                <Button
                  variant="primary"
                  size="default"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-sm"
                  leftIcon={<MessageSquare className="w-4 h-4" />}
                >
                  Talk with AI
                </Button>
              </Link>
              <Link to="/assessment">
                <Button
                  variant="outline"
                  size="default"
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-semibold"
                >
                  Quick Check-in
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ==================== 2. MAIN BALANCED 2-COLUMN GRID ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ==================== LEFT COLUMN (8 COLS) ==================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* A. MOOD RADAR CHECK-IN */}
            <motion.div variants={fadeUpVariants} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  How are you feeling right now?
                </h2>
                <span className="text-[11px] text-slate-400">1-Tap Mood Log</span>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {MOODS.map((mood) => {
                  const isSelected = selectedMood === mood.value;
                  return (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelect(mood.value)}
                      className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-center active:scale-[0.98] min-h-[72px] sm:min-h-[84px] ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20'
                          : `bg-white border-slate-200/90 text-slate-700 shadow-2xs ${mood.color}`
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl mb-1 transform transition-transform group-hover:scale-110">
                        {mood.emoji}
                      </span>
                      <span className="text-[10px] sm:text-xs font-semibold leading-tight">{mood.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Supportive Feedback Banner */}
              <AnimatePresence>
                {savedFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center space-x-2.5 font-medium shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{savedFeedback}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* B. DYNAMIC TODAY RECOMMENDATION */}
            <motion.div variants={fadeUpVariants} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recommended For You Today
                </h2>
                <Badge variant="primary" size="sm">
                  {todayAction.tag}
                </Badge>
              </div>

              <Card className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-slate-200/90 hover:border-emerald-200 transition-all rounded-3xl bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20 shadow-xs">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <ActionIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-[#111827] leading-tight">
                      {todayAction.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-lg font-normal">
                      {todayAction.description}
                    </p>
                  </div>
                </div>

                <Link to={todayAction.link} className="shrink-0 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="default"
                    className="w-full sm:w-auto font-bold"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {todayAction.buttonLabel}
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* C. 4-CARD RESILIENCE TOOLKIT */}
            <motion.div variants={fadeUpVariants} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Daily Wellbeing Toolkit
                </h2>
                <Link
                  to="/games"
                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  All Tools <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Somatic Reset */}
                <Link to="/games" className="group">
                  <Card className="p-4.5 rounded-2xl border-slate-200/90 group-hover:border-emerald-300 group-hover:shadow-sm transition-all h-full flex flex-col justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Wind className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          Somatic 4-7-8 Reset
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 font-normal">
                          Guided diaphragmatic breathing to quickly ease heart rate & stress.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-teal-700">
                      <span>2 min exercise</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>

                {/* 2. Focus Orbit */}
                <Link to="/games" className="group">
                  <Card className="p-4.5 rounded-2xl border-slate-200/90 group-hover:border-emerald-300 group-hover:shadow-sm transition-all h-full flex flex-col justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          Focus Orbit Timer
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 font-normal">
                          Study rhythm and Pomodoro flow intervals with ambient audio.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-amber-700">
                      <span>Flow State</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>

                {/* 3. AI Sanctuary */}
                <Link to="/ai-assistant" className="group">
                  <Card className="p-4.5 rounded-2xl border-slate-200/90 group-hover:border-emerald-300 group-hover:shadow-sm transition-all h-full flex flex-col justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          AI Sanctuary Talk
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 font-normal">
                          24/7 confidential reflection, CBT prompts, and active listening.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                      <span>Available 24/7</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>

                {/* 4. Peer Community */}
                <Link to="/community" className="group">
                  <Card className="p-4.5 rounded-2xl border-slate-200/90 group-hover:border-emerald-300 group-hover:shadow-sm transition-all h-full flex flex-col justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          Peer Circles
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 font-normal">
                          Safe anonymous student conversations and mutual encouragement.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-indigo-700">
                      <span>Campus Circles</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* ==================== RIGHT COLUMN (4 COLS) ==================== */}
          <div className="lg:col-span-4 space-y-6">
            {/* A. WEEKLY STREAK & RESILIENCE GAUGE */}
            <motion.div variants={fadeUpVariants}>
              <Card className="p-5 rounded-3xl border-slate-200/90 bg-white shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                      <Flame className="w-4 h-4 fill-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Weekly Consistency</h3>
                      <p className="text-[10px] text-slate-400">Daily wellbeing logs</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    5 Day Streak 🔥
                  </span>
                </div>

                {/* 7-Day Dots Tracker */}
                <div className="grid grid-cols-7 gap-1.5 pt-1 text-center">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                    const isDone = idx <= 4;
                    const isToday = idx === 4;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-semibold text-slate-400">{day}</span>
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          } ${isToday ? 'ring-2 ring-emerald-500/40' : ''}`}
                        >
                          {isDone ? '✓' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Resilience Score Index */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-700">Resilience Index</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {summary?.wellbeingScore ? `${summary.wellbeingScore} / 100` : '84 / 100'} • {summary?.scoreLabel || 'Optimal'}
                  </span>
                </div>
              </Card>
            </motion.div>

            {/* B. DAILY CLINICAL MICRO-MINDSET TIP */}
            <motion.div variants={fadeUpVariants}>
              <Card className="p-5 rounded-3xl border-slate-200/90 bg-gradient-to-br from-slate-50 via-teal-50/20 to-white shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-emerald-600" />
                    Today's Clinical Insight
                  </span>
                  <button
                    onClick={handleNextTip}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
                    title="Next tip"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal italic">
                  "{CLINICAL_TIPS[tipIndex]}"
                </p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                  <span>YOUTH Psychology Protocol</span>
                  <span className="text-emerald-700 font-semibold cursor-pointer" onClick={handleNextTip}>
                    Tap for next tip →
                  </span>
                </div>
              </Card>
            </motion.div>

            {/* C. 24/7 SUPPORT & HOTLINE CARD */}
            <motion.div variants={fadeUpVariants}>
              <Card className="p-5 rounded-3xl border-slate-200/90 bg-white shadow-xs space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Immediate Human Support
                </h3>

                <div className="space-y-2.5">
                  <a
                    href="tel:14416"
                    className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200/80 flex items-center justify-between group hover:bg-rose-100/70 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white text-rose-700 border border-rose-200 flex items-center justify-center shadow-2xs">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-rose-950">Tele-MANAS (14416)</h4>
                        <p className="text-[10px] text-rose-800">Govt 24/7 Free Hotline</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-700 group-hover:underline">Call</span>
                  </a>

                  <Link
                    to="/counselors"
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between group hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white text-emerald-700 border border-slate-200 flex items-center justify-center shadow-2xs">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          Campus Counselors
                        </h4>
                        <p className="text-[10px] text-slate-500">Book confidential 1-on-1</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
};

export default Dashboard;
