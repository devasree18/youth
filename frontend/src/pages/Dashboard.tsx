import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { moodService, type MoodEntry } from '../services/moodService';
import { gameService } from '../services/gameService';
import { TodayMoodSection } from '../components/dashboard/TodayMoodSection';
import { WeeklyMoodChart } from '../components/dashboard/WeeklyMoodChart';
import { ResetActivityInfographic } from '../components/dashboard/ResetActivityInfographic';
import { SupportActionCard } from '../components/dashboard/SupportActionCard';
import { fadeUpVariants, staggerContainerVariants } from '../lib/motion';

export const Dashboard: React.FC = () => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [breathingCount, setBreathingCount] = useState<number>(0);
  const [journalCount, setJournalCount] = useState<number>(0);
  const [focusCount, setFocusCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [moodRes, gameRes] = await Promise.all([
        moodService.getHistory(30).catch(() => null),
        gameService.getSessions(50).catch(() => null),
      ]);

      // 1. Process Mood History & Today's Mood
      if (moodRes?.data) {
        setMoodHistory(moodRes.data);
        const todayStr = new Date().toDateString();
        const foundToday = moodRes.data.find(
          (m) => new Date(m.createdAt).toDateString() === todayStr
        );
        setTodayMood(foundToday || null);
      }

      // 2. Process Reset Activities (Last 7 Days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const oneWeekAgoMs = oneWeekAgo.getTime();

      let breathing = 0;
      let focus = 0;
      if (gameRes?.data && Array.isArray(gameRes.data)) {
        gameRes.data.forEach((s) => {
          const sessionTime = new Date(s.createdAt || s.startedAt).getTime();
          if (sessionTime >= oneWeekAgoMs) {
            if (s.gameType === 'BREATHING_FLOW') {
              breathing++;
            } else {
              focus++;
            }
          }
        });
      }
      setBreathingCount(breathing);
      setFocusCount(focus);

      // 3. Process Journal Moments (Last 7 Days from Local Storage)
      try {
        const savedJournal = localStorage.getItem('youth_journal_entries');
        if (savedJournal) {
          const parsed = JSON.parse(savedJournal);
          if (Array.isArray(parsed)) {
            const recentJournalCount = parsed.filter((item) => {
              const itemTime = new Date(item.date || item.createdAt || Date.now()).getTime();
              return itemTime >= oneWeekAgoMs;
            }).length;
            setJournalCount(recentJournalCount);
          }
        }
      } catch (err) {
        console.warn('Error reading journal entries:', err);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSelectMood = async (moodValue: 'very_low' | 'low' | 'okay' | 'good' | 'great') => {
    try {
      const res = await moodService.recordMood(moodValue);
      if (res.data) {
        setTodayMood(res.data);
        // Refresh mood history to reflect on the chart
        const updated = await moodService.getHistory(30).catch(() => null);
        if (updated?.data) {
          setMoodHistory(updated.data);
        }
      }
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
        className="max-w-4xl mx-auto space-y-5 sm:space-y-6 pb-6"
      >
        {/* SECTION 1: TODAY — LARGE MOOD CHECK-IN */}
        <motion.div variants={fadeUpVariants}>
          <TodayMoodSection
            todayMood={todayMood}
            onSelectMood={handleSelectMood}
          />
        </motion.div>

        {/* 2-COLUMN SECTION ON DESKTOP / STACKED ON MOBILE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* SECTION 2: MY WEEK — SIMPLE MOOD TREND CHART */}
          <motion.div variants={fadeUpVariants} className="h-full">
            <WeeklyMoodChart
              moodHistory={moodHistory}
              isLoading={isLoading}
            />
          </motion.div>

          {/* SECTION 3: MY RESET TOOLS — VISUAL ACTIVITY INFOGRAPHIC */}
          <motion.div variants={fadeUpVariants} className="h-full">
            <ResetActivityInfographic
              breathingCount={breathingCount}
              journalCount={journalCount}
              focusCount={focusCount}
              isLoading={isLoading}
            />
          </motion.div>
        </div>

        {/* SECTION 4: SUPPORT — CLEAR VISUAL ACTION AREA */}
        <motion.div variants={fadeUpVariants}>
          <SupportActionCard />
        </motion.div>
      </motion.div>
    </AppShell>
  );
};

export default Dashboard;
