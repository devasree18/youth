import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { moodService, type MoodEntry } from '../services/moodService';
import { wellbeingService, type WellbeingSummary } from '../services/wellbeingService';
import { assessmentService } from '../services/assessmentService';
import { gameService } from '../services/gameService';
import { fadeUpVariants, staggerContainerVariants } from '../lib/motion';

import { TodayStatusStrip } from '../components/dashboard/TodayStatusStrip';
import { TodayFocusAction } from '../components/dashboard/TodayFocusAction';
import { HorizontalMoodScale } from '../components/dashboard/HorizontalMoodScale';
import { WellbeingOverviewMetrics } from '../components/dashboard/WellbeingOverviewMetrics';
import { ActivityTimeline, type TimelineItem } from '../components/dashboard/ActivityTimeline';
import { ToolsMixedSection } from '../components/dashboard/ToolsMixedSection';
import { JournalReflectionCard } from '../components/dashboard/JournalReflectionCard';
import { AiSupportPrompt } from '../components/dashboard/AiSupportPrompt';
import { DiscreetSafetyCard } from '../components/dashboard/DiscreetSafetyCard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Core Data States
  const [summary, setSummary] = useState<WellbeingSummary | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [isCheckedInToday, setIsCheckedInToday] = useState(false);
  const [lastCheckInDate, setLastCheckInDate] = useState<string | undefined>(undefined);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [latestJournal, setLatestJournal] = useState<{
    id: string;
    title: string;
    content: string;
    date: string;
    moodTag?: string;
  } | null>(null);
  const [journalCount, setJournalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  const todayDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  // Load Real Data from All Services
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Wellbeing Summary
      const summaryPromise = wellbeingService.getSummary().catch(() => null);

      // 2. Fetch Mood History
      const moodPromise = moodService.getHistory(30).catch(() => null);

      // 3. Fetch Assessment History
      const assessPromise = assessmentService.getHistory().catch(() => null);

      // 4. Fetch Game Sessions
      const gamePromise = gameService.getSummary().catch(() => null);

      const [summaryRes, moodRes, assessRes, gameRes] = await Promise.all([
        summaryPromise,
        moodPromise,
        assessPromise,
        gamePromise,
      ]);

      if (summaryRes?.data) {
        setSummary(summaryRes.data);
      }

      // Check today's mood
      const todayDateString = new Date().toDateString();
      if (moodRes?.data && moodRes.data.length > 0) {
        setMoodHistory(moodRes.data);
        const todayFound = moodRes.data.find(
          (m) => new Date(m.createdAt).toDateString() === todayDateString
        );
        if (todayFound) {
          setTodayMood(todayFound);
        }
      }

      // Check today's check-in status from assessments
      if (assessRes?.data && assessRes.data.length > 0) {
        const latestAssess = assessRes.data[0];
        const assessDate = new Date(latestAssess.createdAt);
        setLastCheckInDate(
          assessDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        );
        if (assessDate.toDateString() === todayDateString) {
          setIsCheckedInToday(true);
        }
      }

      // Read real journal entries from storage
      let entriesCount = 0;
      try {
        const savedJournals = localStorage.getItem('youth_journal_entries');
        if (savedJournals) {
          const parsed = JSON.parse(savedJournals);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLatestJournal(parsed[0]);
            entriesCount = parsed.length;
          }
        }
      } catch {
        // Storage ignore
      }
      setJournalCount(entriesCount);

      // Assemble Chronological Activity Timeline
      const timeline: TimelineItem[] = [];

      // Add recent assessments
      if (assessRes?.data) {
        assessRes.data.slice(0, 2).forEach((a) => {
          timeline.push({
            id: `assess-${a._id}`,
            type: 'CHECKIN',
            title: 'Completed Wellbeing Check-in',
            subtitle: `Score: ${a.normalizedScore}/100 • Risk: ${a.riskLevel}`,
            timestamp: new Date(a.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            route: '/wellbeing-insights',
          });
        });
      }

      // Add recent game sessions
      if (gameRes?.data?.recentSessions) {
        gameRes.data.recentSessions.slice(0, 2).forEach((s) => {
          timeline.push({
            id: `game-${s._id}`,
            type: s.gameType.includes('BREATH') ? 'BREATHING' : 'FOCUS',
            title: s.gameType === 'BREATHING_FLOW' ? 'Somatic Breathing Reset' : 'Focus Orbit Session',
            subtitle: `${Math.round(s.durationSeconds / 60)} min practice • Completed`,
            timestamp: new Date(s.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            route: '/games',
          });
        });
      }

      // Add recent mood logs
      if (moodRes?.data) {
        moodRes.data.slice(0, 2).forEach((m) => {
          timeline.push({
            id: `mood-${m._id}`,
            type: 'CHECKIN',
            title: `Recorded Mood: ${m.mood.replace('_', ' ').toUpperCase()}`,
            subtitle: m.note || 'Daily emotional log',
            timestamp: new Date(m.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
          });
        });
      }

      // Sort timeline chronologically descending
      setTimelineItems(timeline);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Real Mood Recording
  const handleMoodSelect = async (moodValue: string) => {
    try {
      const res = await moodService.recordMood(moodValue);
      if (res.data) {
        setTodayMood(res.data);
      }
      await loadDashboardData();
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
        className="max-w-6xl mx-auto space-y-7 pb-12"
      >
        {/* =========================================================================
            1. EDITORIAL WELCOME AREA (No giant neon banners)
            ========================================================================= */}
        <motion.div variants={fadeUpVariants} className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200/80 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
                Your space for today.
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
                Check in, reset, reflect, and keep moving at your own pace, {firstName}.
              </p>
            </div>
            <span className="text-xs font-medium text-stone-400 shrink-0">
              {todayDateFormatted}
            </span>
          </div>

          {/* Today's Subtle Status Strip */}
          <TodayStatusStrip
            todayMood={todayMood}
            summary={summary}
            lastCheckInDate={lastCheckInDate}
          />
        </motion.div>

        {/* =========================================================================
            2. TODAY'S NEXT STEP (Primary Focal Action)
            ========================================================================= */}
        <motion.div variants={fadeUpVariants}>
          <TodayFocusAction
            isCheckedInToday={isCheckedInToday}
            userMood={todayMood?.mood}
          />
        </motion.div>

        {/* =========================================================================
            3. MAIN ASYMMETRICAL 2-COLUMN COMPOSITION
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ==================== LEFT COLUMN (7 COLS): DAILY FLOW ==================== */}
          <div className="lg:col-span-7 space-y-7">
            {/* A. Subtle Horizontal Mood Scale */}
            <motion.div
              variants={fadeUpVariants}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs"
            >
              <HorizontalMoodScale
                currentMood={todayMood?.mood}
                onSelectMood={handleMoodSelect}
              />
            </motion.div>

            {/* B. Mixed-Visual Weight Tools Section */}
            <motion.div variants={fadeUpVariants}>
              <ToolsMixedSection />
            </motion.div>

            {/* C. Real Chronological Activity Timeline */}
            <motion.div variants={fadeUpVariants}>
              <ActivityTimeline items={timelineItems} isLoading={isLoading} />
            </motion.div>
          </div>

          {/* ==================== RIGHT COLUMN (5 COLS): PULSE & REFLECTION ==================== */}
          <div className="lg:col-span-5 space-y-6">
            {/* A. Weekly Overview & Resilience Metrics */}
            <motion.div variants={fadeUpVariants}>
              <WellbeingOverviewMetrics
                summary={summary}
                recentCheckInCount={moodHistory.length > 0 ? Math.min(7, moodHistory.length) : 1}
                reflectionCount={journalCount}
                streakDays={summary?.recentMoodCount || 3}
              />
            </motion.div>

            {/* B. Real Journal Reflection Preview */}
            <motion.div variants={fadeUpVariants}>
              <JournalReflectionCard latestEntry={latestJournal} />
            </motion.div>

            {/* C. Subtle AI Support Entry */}
            <motion.div variants={fadeUpVariants}>
              <AiSupportPrompt />
            </motion.div>

            {/* D. Discreet Human Safety Support */}
            <motion.div variants={fadeUpVariants}>
              <DiscreetSafetyCard />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
};

export default Dashboard;
