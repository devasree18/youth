import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { moodService, type MoodEntry } from '../services/moodService';
import { wellbeingService, type WellbeingSummary } from '../services/wellbeingService';
import { assessmentService } from '../services/assessmentService';
import { fadeUpVariants, staggerContainerVariants } from '../lib/motion';
import {
  Wind,
  Target,
  BookMarked,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Flame,
  PhoneCall,
} from 'lucide-react';
import { HorizontalMoodScale } from '../components/dashboard/HorizontalMoodScale';
import { TodayFocusAction } from '../components/dashboard/TodayFocusAction';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState<WellbeingSummary | null>(null);
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [isCheckedInToday, setIsCheckedInToday] = useState(false);

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  const todayDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const loadData = useCallback(async () => {
    try {
      const [summaryRes, moodRes, assessRes] = await Promise.all([
        wellbeingService.getSummary().catch(() => null),
        moodService.getHistory(7).catch(() => null),
        assessmentService.getHistory().catch(() => null),
      ]);

      if (summaryRes?.data) setSummary(summaryRes.data);

      const todayStr = new Date().toDateString();
      if (moodRes?.data) {
        const found = moodRes.data.find((m) => new Date(m.createdAt).toDateString() === todayStr);
        if (found) setTodayMood(found);
      }

      if (assessRes?.data && assessRes.data.length > 0) {
        const latest = assessRes.data[0];
        if (new Date(latest.createdAt).toDateString() === todayStr) {
          setIsCheckedInToday(true);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMoodSelect = async (moodValue: string) => {
    try {
      const res = await moodService.recordMood(moodValue);
      if (res.data) setTodayMood(res.data);
      await loadData();
    } catch (err) {
      console.error('Failed to record mood:', err);
    }
  };

  return (
    <AppShell title="Home">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainerVariants}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* 1. CLEAN EDITORIAL GREETING */}
        <motion.div variants={fadeUpVariants} className="space-y-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {getTimeGreeting()}, {firstName}.
            </h1>
            <span className="text-xs font-medium text-stone-400 bg-stone-100/80 px-2.5 py-1 rounded-full border border-stone-200/60">
              {todayDateFormatted}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 font-normal">
            Take a moment to check in and pace your day.
          </p>
        </motion.div>

        {/* 2. 1-TAP HORIZONTAL MOOD LOG */}
        <motion.div
          variants={fadeUpVariants}
          className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs"
        >
          <HorizontalMoodScale
            currentMood={todayMood?.mood}
            onSelectMood={handleMoodSelect}
          />
        </motion.div>

        {/* 3. TODAY'S PRIMARY FOCUS ACTION */}
        <motion.div variants={fadeUpVariants}>
          <TodayFocusAction
            isCheckedInToday={isCheckedInToday}
            userMood={todayMood?.mood}
          />
        </motion.div>

        {/* 4. ESSENTIAL TOOLS GRID (4 SIMPLE TILES) */}
        <motion.div variants={fadeUpVariants} className="space-y-2.5">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Daily Wellbeing Tools
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tool 1: Somatic Breathing */}
            <Link
              to="/games"
              className="p-4 sm:p-4.5 rounded-2xl bg-white border border-stone-200/90 hover:border-emerald-300 transition-all flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                    Somatic 4-7-8 Reset
                  </h3>
                  <p className="text-[11px] text-stone-500 font-normal">
                    60-second breathing rhythm to calm tension
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Tool 2: Focus Orbit */}
            <Link
              to="/games"
              className="p-4 sm:p-4.5 rounded-2xl bg-white border border-stone-200/90 hover:border-emerald-300 transition-all flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                    Focus Orbit Timer
                  </h3>
                  <p className="text-[11px] text-stone-500 font-normal">
                    25-minute study intervals with ambient audio
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Tool 3: Journal & Reflection */}
            <Link
              to="/solutions"
              className="p-4 sm:p-4.5 rounded-2xl bg-white border border-stone-200/90 hover:border-emerald-300 transition-all flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BookMarked className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                    Daily Reflection
                  </h3>
                  <p className="text-[11px] text-stone-500 font-normal">
                    Private journal prompts & thought logging
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Tool 4: AI Support */}
            <Link
              to="/ai-assistant"
              className="p-4 sm:p-4.5 rounded-2xl bg-white border border-stone-200/90 hover:border-emerald-300 transition-all flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                    AI Wellness Sanctuary
                  </h3>
                  <p className="text-[11px] text-stone-500 font-normal">
                    24/7 confidential reflection & guidance
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </motion.div>

        {/* 5. SLIM PULSE & SUPPORT FOOTER STRIP */}
        <motion.div
          variants={fadeUpVariants}
          className="p-3.5 sm:p-4 rounded-2xl bg-stone-100/80 border border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center space-x-4">
            <span className="flex items-center font-semibold text-stone-700">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Resilience: {summary?.wellbeingScore || 84}/100 • {summary?.scoreLabel || 'Optimal'}
            </span>
            <span className="hidden sm:inline-flex items-center text-amber-700 font-medium">
              <Flame className="w-3.5 h-3.5 mr-1 fill-amber-500 text-amber-500" />
              Active Streak
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="tel:14416"
              className="text-stone-600 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
              <span>Tele-MANAS (14416)</span>
            </a>
            <span>•</span>
            <Link
              to="/counselors"
              className="text-emerald-700 hover:text-emerald-900 font-semibold"
            >
              Counselors →
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  );
};

export default Dashboard;
