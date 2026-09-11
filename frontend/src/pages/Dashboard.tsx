import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
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
  Activity,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  PhoneCall,
  UserCheck,
  Circle,
  MessageSquare,
} from 'lucide-react';

interface MicroAction {
  id: string;
  label: string;
  category: string;
}

const INITIAL_ACTIONS: MicroAction[] = [
  { id: 'act-1', label: 'Take a 5-minute deep breathing break', category: 'Mindfulness' },
  { id: 'act-2', label: 'Review exam stress reduction guide', category: 'Resource' },
  { id: 'act-3', label: 'Complete today’s wellbeing check-in', category: 'Routine' },
];

export const Dashboard = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [summary, setSummary] = useState<WellbeingSummary | null>(null);
  const [isSavingMood, setIsSavingMood] = useState(false);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const moodOptions = [
    { label: 'Exhausted', emoji: '😔', value: 'very_low', score: 35 },
    { label: 'Stressed', emoji: '😟', value: 'low', score: 52 },
    { label: 'Neutral', emoji: '😐', value: 'okay', score: 70 },
    { label: 'Good', emoji: '🙂', value: 'good', score: 85 },
    { label: 'Great', emoji: '😄', value: 'great', score: 96 },
  ];

  const fetchWellbeingSummary = useCallback(async () => {
    try {
      const res = await wellbeingService.getSummary();
      if (res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch wellbeing summary:', err);
    }
  }, []);

  useEffect(() => {
    fetchWellbeingSummary();
  }, [fetchWellbeingSummary]);

  const handleMoodSelect = async (moodValue: string) => {
    setSelectedMood(moodValue);
    setIsSavingMood(true);
    try {
      await moodService.recordMood(moodValue);
      await fetchWellbeingSummary();
    } catch (err) {
      console.error('Failed to record mood:', err);
    } finally {
      setIsSavingMood(false);
    }
  };

  const toggleAction = (id: string) => {
    setCompletedActions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calculate dynamic Wellbeing Score based on real backend summary + instant mood selection + action bonuses
  const baseScore = summary?.wellbeingScore ?? 70;
  const selectedMoodObj = moodOptions.find((m) => m.value === selectedMood);
  const moodScore = selectedMoodObj ? selectedMoodObj.score : baseScore;
  const actionBonus = Object.values(completedActions).filter(Boolean).length * 5;
  const currentScore = Math.min(100, Math.max(10, moodScore + actionBonus));

  const getScoreMeta = (score: number) => {
    if (score >= 80) return { label: 'Optimal Wellbeing', variant: 'success' as const };
    if (score >= 65) return { label: 'Good Stability', variant: 'primary' as const };
    if (score >= 50) return { label: 'Moderate Load', variant: 'warning' as const };
    return { label: 'Needs Support', variant: 'danger' as const };
  };

  const scoreMeta = getScoreMeta(currentScore);

  const getRecommendation = (score: number) => {
    if (score >= 80)
      return 'You are maintaining solid emotional resilience. Keep prioritizing balanced sleep and regular study breaks.';
    if (score >= 65)
      return 'Your wellbeing index is steady. Consider doing a quick mindfulness session or short walk to recharge.';
    if (score >= 50)
      return 'Elevated stress detected. We recommend exploring our guided breathing tools or chatting with your AI Companion.';
    return 'Your self-reported wellbeing is lower than usual. Please consider connecting with a campus counselor or accessing 24/7 crisis support.';
  };

  return (
    <AppShell
      title={`Hello, ${user?.name?.split(' ')[0] || 'Student'}`}
      subtitle="Overview of your wellbeing metrics and daily routines"
    >
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainerVariants}
        className="space-y-6"
      >
        {/* Top Summary Banner */}
        <motion.div variants={fadeUpVariants}>
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">Personal Wellbeing Overview</h2>
                <Badge variant={scoreMeta.variant} dot>
                  {scoreMeta.label}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                {getRecommendation(currentScore)}
              </p>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <Link to="/assessment">
                <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Complete check-in
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Core Metric Cards Grid */}
        <motion.div
          variants={staggerContainerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {/* Card 1: Score Gauge */}
          <motion.div variants={fadeUpVariants}>
            <Card className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Wellbeing Index</span>
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="my-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-slate-900">{currentScore}</span>
                  <span className="text-xs text-slate-400 font-medium">/ 100</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${currentScore}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Status: <strong className="text-slate-700">{scoreMeta.label}</strong></span>
                <Link to="/assessment" className="text-blue-600 hover:underline font-medium">
                  Detailed test →
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Card 2: Check-in Participation */}
          <motion.div variants={fadeUpVariants}>
            <Card className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Log Activity</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="my-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {summary?.recentMoodCount ?? 1}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">moods logged</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Trend status: <strong className="text-slate-700">{summary?.trend ?? 'Stable'}</strong>
                </p>
              </div>
              <div className="text-[11px] text-slate-500">
                Last check-in: <strong className="text-slate-700">Today</strong>
              </div>
            </Card>
          </motion.div>

          {/* Card 3: Care Team Quick Access */}
          <motion.div variants={fadeUpVariants}>
            <Card className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Support Network</span>
                <UserCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="my-3">
                <div className="text-sm font-semibold text-slate-900">Licensed Campus Care</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Connect with professional counselors for confidential 1-on-1 guidance.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link to="/counselors" className="text-xs font-semibold text-blue-600 hover:underline">
                  Book appointment →
                </Link>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Two-Column Working Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Main (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Daily Mood Logger */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">How are you feeling right now?</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select your current mood to update your daily status.
                  </p>
                </div>
                {isSavingMood && (
                  <span className="text-xs text-slate-400 font-medium">Saving...</span>
                )}
              </div>

              <div className="grid grid-cols-5 gap-2.5">
                {moodOptions.map((mood) => {
                  const isSelected = selectedMood === mood.value;
                  return (
                    <motion.button
                      key={mood.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMoodSelect(mood.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl mb-1">{mood.emoji}</span>
                      <span className="text-xs font-medium">{mood.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </Card>

            {/* Daily Wellbeing Checklist */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Today’s Micro-Actions</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Small habits to strengthen your mental wellbeing.
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {Object.values(completedActions).filter(Boolean).length} / {INITIAL_ACTIONS.length} completed
                </span>
              </div>

              <div className="space-y-2.5">
                {INITIAL_ACTIONS.map((action) => {
                  const isDone = !!completedActions[action.id];
                  return (
                    <div
                      key={action.id}
                      onClick={() => toggleAction(action.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                        isDone
                          ? 'bg-slate-50 border-slate-200 text-slate-500 line-through'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="text-xs font-medium">{action.label}</span>
                      </div>
                      <Badge variant="neutral" size="sm">{action.category}</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Companion Quick Card */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">24/7 AI Companion</h4>
                  <p className="text-[11px] text-slate-500">Confidential reflection & coping</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chat anytime to decompress, discuss exam anxiety, or practice mindfulness exercises.
              </p>
              <Link to="/ai-assistant" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  Open AI Companion
                </Button>
              </Link>
            </Card>

            {/* Emergency Hotline Alert */}
            <Card className="p-5 border-rose-200 bg-rose-50/50 space-y-3">
              <div className="flex items-center space-x-2 text-rose-800">
                <PhoneCall className="w-4 h-4 text-rose-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Urgent Support</h4>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed">
                If you or a peer are experiencing distress, certified counselors are ready to help 24/7.
              </p>
              <div className="space-y-1.5 pt-1">
                <a
                  href="tel:14416"
                  className="flex items-center justify-between p-2 rounded-md bg-white border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                >
                  <span>Tele-MANAS Hotline</span>
                  <span className="font-mono">14416</span>
                </a>
                <a
                  href="tel:18005990019"
                  className="flex items-center justify-between p-2 rounded-md bg-white border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                >
                  <span>KIRAN Mental Health</span>
                  <span className="font-mono">1800-599-0019</span>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
};

export default Dashboard;
