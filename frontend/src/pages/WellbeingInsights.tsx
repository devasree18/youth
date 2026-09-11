import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Heart,
  Target,
  Flower2,
  Compass,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Activity,
  CheckCircle2,
  Lock,
  Trash2,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { wellbeingService } from '../services/wellbeingService';
import type { WellbeingDashboardInsights } from '../services/wellbeingService';
import { fadeUpVariants, staggerContainerVariants } from '../lib/motion';

export const WellbeingInsights: React.FC = () => {
  const [insights, setInsights] = useState<WellbeingDashboardInsights | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      const res = await wellbeingService.getInsights();
      if (res.data) {
        setInsights(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load wellbeing insights:', err);
      setError('Unable to load personal insights right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleDeleteInsight = async (id: string) => {
    try {
      setDeletingId(id);
      await wellbeingService.deleteInsight(id);
      await fetchInsights();
    } catch (err) {
      console.error('Failed to delete insight:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const getGameIcon = (gameType: string) => {
    if (gameType === 'FOCUS_ORBIT' || gameType === 'FOCUS_TAP') return Target;
    if (gameType === 'CALM_GARDEN' || gameType === 'BREATHING_FLOW') return Flower2;
    if (gameType === 'PATH_OF_BALANCE') return Compass;
    return Activity;
  };

  return (
    <AppShell
      title="My Wellbeing Insights"
      subtitle="Private, non-diagnostic reflections from your daily check-ins and reset activities."
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Top Summary Banner */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeUpVariants}
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-white to-slate-50/60 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2">
              <Badge variant="primary" dot size="sm">
                Personal Wellbeing Patterns
              </Badge>
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" />
                Confidential to you
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
              Your wellbeing, at a glance
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Based on your recent check-ins and activities, here are a few patterns you may find useful.
              <span className="block font-semibold text-slate-700 mt-1">
                This is not a medical diagnosis.
              </span>
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-7 h-7" />
          </div>
        </motion.div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <Sparkles className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
            Loading your private wellbeing patterns...
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 text-center text-rose-800 text-sm">
            {error}
            <div className="mt-3">
              <Button size="sm" variant="outline" onClick={fetchInsights}>
                Retry
              </Button>
            </div>
          </div>
        ) : insights ? (
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainerVariants}
            className="space-y-6"
          >
            {/* Grid for Area 1 (Today's Check-In) & Area 4 (Suggested Next Step) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* AREA 1: Today's Check-in */}
              <motion.div variants={fadeUpVariants}>
                <Card className="p-6 h-full flex flex-col justify-between border-slate-200/90 rounded-3xl shadow-xs bg-white">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                          <Heart className="w-5 h-5 fill-rose-500" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            1. Today's Check-in
                          </span>
                          <h4 className="text-sm font-bold text-[#111827]">
                            {insights.todayCheckIn.checkedInToday
                              ? 'Check-in Recorded'
                              : 'Check-in Needed'}
                          </h4>
                        </div>
                      </div>
                      <Badge
                        variant={insights.todayCheckIn.checkedInToday ? 'success' : 'neutral'}
                        size="sm"
                      >
                        {insights.todayCheckIn.checkedInToday ? 'Recorded' : 'Pending'}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                      {insights.todayCheckIn.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {insights.todayCheckIn.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Self-reported daily weather
                    </span>
                    <Link to={insights.todayCheckIn.recommendedAction.route}>
                      <Button variant="primary" size="sm" className="text-xs font-bold shadow-xs">
                        <span>{insights.todayCheckIn.recommendedAction.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>

              {/* AREA 4: Suggested Next Step */}
              <motion.div variants={fadeUpVariants}>
                <Card
                  className={`p-6 h-full flex flex-col justify-between rounded-3xl shadow-xs ${
                    insights.suggestedStep.isCrisisSupport
                      ? 'bg-rose-50/70 border-rose-200'
                      : 'bg-white border-slate-200/90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            insights.suggestedStep.isCrisisSupport
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                          }`}
                        >
                          {insights.suggestedStep.isCrisisSupport ? (
                            <PhoneCall className="w-5 h-5" />
                          ) : (
                            <Sparkles className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            4. Suggested Next Step
                          </span>
                          <h4 className="text-sm font-bold text-[#111827]">
                            {insights.suggestedStep.isCrisisSupport
                              ? 'Immediate Support'
                              : 'What May Help Today'}
                          </h4>
                        </div>
                      </div>
                      <Badge
                        variant={insights.suggestedStep.isCrisisSupport ? 'destructive' : 'primary'}
                        size="sm"
                      >
                        {insights.suggestedStep.category}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                      {insights.suggestedStep.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {insights.suggestedStep.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Tailored to your recent patterns
                    </span>
                    <Link to={insights.suggestedStep.actionRoute}>
                      <Button
                        variant={insights.suggestedStep.isCrisisSupport ? 'destructive' : 'primary'}
                        size="sm"
                        className="text-xs font-bold shadow-xs"
                      >
                        <span>{insights.suggestedStep.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* AREA 2: Focus and Reset Activity */}
            <motion.div variants={fadeUpVariants}>
              <Card className="p-6 sm:p-7 rounded-3xl border-slate-200/90 bg-white shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        2. Focus and Reset Activity
                      </span>
                      <h3 className="text-base font-bold text-[#111827]">
                        {insights.focusReset.title}
                      </h3>
                    </div>
                  </div>
                  <Link to="/games">
                    <Button variant="outline" size="sm" className="text-xs font-semibold">
                      Open Reset Games
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {insights.focusReset.description}
                </p>

                {/* Soft Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-lg font-extrabold text-[#111827] block">
                      {insights.focusReset.weeklyResetCount}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Resets This Week
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-lg font-extrabold text-[#111827] block">
                      {insights.focusReset.totalMinutes}m
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Mindful Minutes
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-xs font-bold text-emerald-800 block truncate">
                      {insights.focusReset.favoriteGame.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Most-Used Activity
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-xs font-bold text-teal-700 uppercase block">
                      {insights.focusReset.consistencyTrend}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Session Rhythm
                    </span>
                  </div>
                </div>

                {/* Recent Reset Activity Timeline */}
                {insights.focusReset.recentSessions.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Recent Reset Sessions
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {insights.focusReset.recentSessions.map((s, idx) => {
                        const Icon = getGameIcon(s.gameType);
                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center space-x-2.5 overflow-hidden">
                              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-700 shrink-0">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-bold text-slate-800 capitalize truncate">
                                {s.gameType.replace('_', ' ').toLowerCase()}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                              {new Date(s.createdAt).toLocaleDateString()} · {s.durationSeconds}s
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* AREA 3: Emotional Wellbeing Trend */}
            <motion.div variants={fadeUpVariants}>
              <Card className="p-6 sm:p-7 rounded-3xl border-slate-200/90 bg-white shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        3. Emotional Wellbeing Trend
                      </span>
                      <h3 className="text-base font-bold text-[#111827]">
                        {insights.emotionalTrend.title}
                      </h3>
                    </div>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {insights.emotionalTrend.confidenceLabel}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {insights.emotionalTrend.description}
                </p>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Based on {insights.emotionalTrend.dataPointsCount} self-reported check-ins</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Past 14 days</span>
                </div>
              </Card>
            </motion.div>

            {/* Privacy Protection Notice */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/70 flex items-start space-x-3 text-xs text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-emerald-900">Privacy & Data Protection Principles</p>
                <p className="text-[11px] text-emerald-800 leading-relaxed font-normal">
                  YOUTH calculates personal insights securely on the server without clinical labeling or scoring. Your private gameplay and reflections are never shared with campus administrators, advertisers, or peers.
                </p>
              </div>
            </div>

            {/* Student Data Management & Deletion */}
            {insights.allInsights.length > 0 && (
              <motion.div
                initial="initial"
                animate="animate"
                variants={fadeUpVariants}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-[#172033]">Manage Saved Insight Cards</h4>
                  <span className="text-[11px] text-slate-400">Student data control</span>
                </div>

                <div className="space-y-2">
                  {insights.allInsights.map((item) => (
                    <div
                      key={item._id}
                      className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <p className="font-bold text-slate-800 truncate">{item.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{item.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteInsight(item._id)}
                        disabled={deletingId === item._id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Delete insight"
                        aria-label="Delete insight"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </div>
    </AppShell>
  );
};

export default WellbeingInsights;
