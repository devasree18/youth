import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
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
  { label: 'Very low', emoji: '😔', value: 'very_low' },
  { label: 'Low', emoji: '😟', value: 'low' },
  { label: 'Okay', emoji: '😐', value: 'okay' },
  { label: 'Good', emoji: '🙂', value: 'good' },
  { label: 'Great', emoji: '😄', value: 'great' },
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

  // Determine the ONE primary action for the student
  const getTodayAction = () => {
    if (selectedMood === 'very_low' || selectedMood === 'low') {
      return {
        icon: Wind,
        title: 'Take a 2-minute breathing break',
        description: 'A gentle 4-4-4-4 breathing cycle to help ease tension and calm your thoughts.',
        buttonLabel: 'Start breathing exercise',
        link: '/solutions',
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
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
                  className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border transition-all duration-150 cursor-pointer text-center ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-xs scale-[1.02]'
                      : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl mb-1.5">{mood.emoji}</span>
                  <span className="text-xs font-medium">{mood.label}</span>
                </button>
              );
            })}
          </div>

          {/* Supportive Confirmation Feedback */}
          {savedFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-600 flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{savedFeedback}</span>
            </motion.div>
          )}
        </motion.div>

        {/* ==================== 3. ONE "TODAY" ACTION ==================== */}
        <motion.div variants={fadeUpVariants} className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Recommended for you today
          </h2>
          <Card className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <ActionIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                  {todayAction.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                  {todayAction.description}
                </p>
              </div>
            </div>

            <Link to={todayAction.link} className="shrink-0 w-full sm:w-auto">
              <Button size="sm" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                {todayAction.buttonLabel}
              </Button>
            </Link>
          </Card>
        </motion.div>

        {/* ==================== 4. SUPPORT SECTION ==================== */}
        <motion.div variants={fadeUpVariants} className="space-y-3 pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Need someone to talk to?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* AI Support */}
            <Link
              to="/ai-assistant"
              className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex items-start space-x-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-100 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Chat with AI Support
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Confidential reflection & guided relaxation, available 24/7.
                </p>
              </div>
            </Link>

            {/* Counselors */}
            <Link
              to="/counselors"
              className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex items-start space-x-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-100 transition-colors">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Find a Counselor
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Book a private 1-on-1 session with a campus mental health specialist.
                </p>
              </div>
            </Link>
          </div>

          {/* Quiet, non-alarmist crisis footnote */}
          <div className="pt-2 text-center text-xs text-slate-400">
            In crisis or severe emotional distress?{' '}
            <Link to="/crisis" className="text-slate-600 font-medium hover:text-rose-600 underline underline-offset-2">
              Call 14416 (Tele-MANAS) or access 24/7 emergency support →
            </Link>
          </div>
        </motion.div>

        {/* ==================== 5. RECENT ACTIVITY (ONLY WHEN REAL DATA EXISTS) ==================== */}
        {summary && summary.recentMoodCount > 0 && (
          <motion.div variants={fadeUpVariants} className="pt-4 border-t border-slate-100 space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Your recent activity
            </h2>
            <div className="bg-white border border-slate-200/80 rounded-lg p-3 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Last check-in logged: <strong className="text-slate-800">Today</strong></span>
              </div>
              <Link to="/assessment" className="text-blue-600 hover:underline font-medium text-[11px]">
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
