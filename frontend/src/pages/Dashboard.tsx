import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { wellbeingService, type WellbeingSummary } from '../services/wellbeingService';
import { moodService } from '../services/moodService';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { fadeUpVariants, staggerContainerVariants } from '../lib/motion';
import {
  Sparkles,
  MessageSquare,
  UserCheck,
  ArrowRight,
  Wind,
  CheckCircle2,
  BookOpen,
  Calendar,
} from 'lucide-react';

const MOODS = [
  { label: 'Very low', emoji: '😔', value: 'very_low', color: 'hover:border-rose-300 hover:bg-rose-50/50' },
  { label: 'Low', emoji: '😟', value: 'low', color: 'hover:border-amber-300 hover:bg-amber-50/50' },
  { label: 'Okay', emoji: '😐', value: 'okay', color: 'hover:border-slate-300 hover:bg-slate-50' },
  { label: 'Good', emoji: '🙂', value: 'good', color: 'hover:border-teal-300 hover:bg-teal-50/50' },
  { label: 'Great', emoji: '😄', value: 'great', color: 'hover:border-indigo-300 hover:bg-indigo-50/50' },
];

export const Dashboard = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [summary, setSummary] = useState<WellbeingSummary | null>(null);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

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
      setSavedFeedback("Thanks for logging how you feel. Remember to take small breaks throughout your day.");
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

  // Determine the ONE primary action for the student based on dynamic mood/data
  const getTodayAction = () => {
    if (selectedMood === 'very_low' || selectedMood === 'low') {
      return {
        icon: Wind,
        title: 'Need a quick reset?',
        description: 'Try a 2-minute breathing activity to help ease tension and settle your nervous system.',
        buttonLabel: 'Start breathing reset',
        link: '/games?game=BREATHING_FLOW',
      };
    }
    if (selectedMood === 'good' || selectedMood === 'great') {
      return {
        icon: BookOpen,
        title: 'Explore study & focus routines',
        description: 'Quick evidence-based tips to sustain your energy, avoid burnout, and stay sharp.',
        buttonLabel: 'Read focus guide',
        link: '/resources',
      };
    }
    return {
      icon: Sparkles,
      title: 'Complete today’s wellbeing check-in',
      description: 'A brief 5-question check-in to track your emotional balance and study workload.',
      buttonLabel: 'Start check-in',
      link: '/assessment',
    };
  };

  const todayAction = getTodayAction();
  const ActionIcon = todayAction.icon;

  return (
    <AppShell title="Home">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainerVariants}
        className="space-y-8 max-w-2xl mx-auto py-2"
      >
        {/* ==================== 1. MAIN WELCOME & GREETING ==================== */}
        <motion.div variants={fadeUpVariants} className="space-y-1 text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            Hi, {firstName}.
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-normal">
            How are you feeling today?
          </p>
        </motion.div>

        {/* ==================== 2. PRIMARY ACTION: MOOD CHECK-IN ==================== */}
        <motion.div variants={fadeUpVariants} className="space-y-3">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {MOODS.map((mood) => {
              const isSelected = selectedMood === mood.value;
              return (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-150 cursor-pointer text-center active:scale-[0.98] ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-500 text-indigo-900 shadow-xs ring-2 ring-indigo-500/20'
                      : `bg-white border-slate-200/80 text-slate-700 ${mood.color}`
                  }`}
                >
                  <span className="text-2xl sm:text-3xl mb-1.5 transform transition-transform group-hover:scale-110">
                    {mood.emoji}
                  </span>
                  <span className="text-xs font-semibold">{mood.label}</span>
                </button>
              );
            })}
          </div>

          {/* Supportive Confirmation Feedback */}
          <AnimatePresence>
            {savedFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 flex items-center space-x-2.5 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{savedFeedback}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ==================== 3. ONE "TODAY" RECOMMENDED ACTION ==================== */}
        <motion.div variants={fadeUpVariants} className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recommended for you today
          </h2>
          <Card className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-slate-200/90 hover:border-slate-300">
            <div className="flex items-start space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/80 flex items-center justify-center shrink-0 mt-0.5">
                <ActionIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#172033] leading-tight">
                  {todayAction.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md font-normal">
                  {todayAction.description}
                </p>
              </div>
            </div>

            <Link to={todayAction.link} className="shrink-0 w-full sm:w-auto">
              <Button size="default" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {todayAction.buttonLabel}
              </Button>
            </Link>
          </Card>
        </motion.div>

        {/* ==================== 4. MY WELLBEING INSIGHTS COMPACT PREVIEW ==================== */}
        <motion.div variants={fadeUpVariants} className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your wellbeing patterns
            </h2>
            <Link
              to="/wellbeing-insights"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
            >
              View full insights <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Link to="/wellbeing-insights" className="block group">
            <Card className="p-5 bg-gradient-to-br from-indigo-50/60 via-white to-teal-50/40 border-slate-200/90 group-hover:border-indigo-300 transition-all rounded-2xl shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#172033] group-hover:text-indigo-600 transition-colors">
                      Your wellbeing, at a glance
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-md font-normal mt-0.5">
                      Check your focus patterns, emotional trends, and daily reset recommendations.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 hidden sm:flex items-center text-xs font-semibold text-indigo-600">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* ==================== 5. SUPPORT ACCESS SECTION ==================== */}
        <motion.div variants={fadeUpVariants} className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Need support?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* AI Support */}
            <Link
              to="/ai-assistant"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-150 flex items-start space-x-3.5 group shadow-xs active:scale-[0.99]"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-100 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#172033] group-hover:text-indigo-600 transition-colors">
                  Talk with AI Support
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Confidential reflection & guided relaxation, available 24/7.
                </p>
              </div>
            </Link>

            {/* Counselors */}
            <Link
              to="/counselors"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-150 flex items-start space-x-3.5 group shadow-xs active:scale-[0.99]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-100 transition-colors">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#172033] group-hover:text-emerald-700 transition-colors">
                  Find a counselor
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Book a private 1-on-1 session with a campus mental health specialist.
                </p>
              </div>
            </Link>
          </div>

          {/* Quiet, non-alarmist crisis footnote */}
          <div className="pt-3 text-center text-xs text-slate-400">
            In crisis or severe emotional distress?{' '}
            <Link to="/crisis" className="text-slate-600 font-semibold hover:text-rose-600 underline underline-offset-2 transition-colors">
              Call 14416 (Tele-MANAS) or access 24/7 urgent support →
            </Link>
          </div>
        </motion.div>

        {/* ==================== 6. RECENT ACTIVITY (ONLY WHEN REAL DATA EXISTS) ==================== */}
        {summary && summary.recentMoodCount > 0 && (
          <motion.div variants={fadeUpVariants} className="pt-4 border-t border-slate-100 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your recent activity
            </h2>
            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-600 shadow-xs">
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>Last check-in logged: <strong className="text-[#172033]">Today</strong></span>
              </div>
              <Link to="/assessment" className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs transition-colors">
                View check-in history →
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AppShell>
  );
};

export default Dashboard;
