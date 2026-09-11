import mongoose from 'mongoose';
import { WellbeingInsight, IWellbeingInsight } from '../models/WellbeingInsight';
import { GameSession } from '../models/GameSession';
import { MoodEntry } from '../models/MoodEntry';
import { AssessmentResult } from '../models/AssessmentResult';

export interface TodayCheckInInsight {
  checkedInToday: boolean;
  latestMoodScore?: number;
  latestMoodNote?: string;
  title: string;
  description: string;
  recommendedAction: {
    label: string;
    route: string;
  };
}

export interface FocusResetInsight {
  weeklyResetCount: number;
  totalMinutes: number;
  favoriteGame: string;
  favoriteGameLabel: string;
  consistencyTrend: 'steady' | 'improving' | 'variable' | 'baseline';
  title: string;
  description: string;
  recentSessions: Array<{
    gameType: string;
    durationSeconds: number;
    createdAt: Date;
    accuracy?: number;
  }>;
}

export interface EmotionalTrendInsight {
  trendDirection: 'STEADY' | 'ELEVATED_STRESS' | 'IMPROVING' | 'INSUFFICIENT_DATA';
  title: string;
  description: string;
  confidenceLabel: string;
  dataPointsCount: number;
}

export interface SuggestedNextStep {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionRoute: string;
  category: 'GAME' | 'JOURNAL' | 'ASSESSMENT' | 'RESOURCE' | 'SUPPORT' | 'CRISIS';
  isCrisisSupport: boolean;
}

export interface WellbeingDashboardInsights {
  todayCheckIn: TodayCheckInInsight;
  focusReset: FocusResetInsight;
  emotionalTrend: EmotionalTrendInsight;
  suggestedStep: SuggestedNextStep;
  allInsights: IWellbeingInsight[];
  generatedAt: Date;
  disclaimer: string;
}

export class WellbeingInsightService {
  /**
   * Generates the complete, privacy-safe wellbeing insights dashboard data.
   */
  public static async getDashboardInsights(userId: string): Promise<WellbeingDashboardInsights> {
    const userObjId = new mongoose.Types.ObjectId(userId);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    let todayMood: any = null;
    let recentMoods: any[] = [];
    let completedSessions: any[] = [];
    let latestAssessment: any = null;

    if (mongoose.connection.readyState === 1) {
      try {
        const [todayM, recentM, sessions, assess] = await Promise.all([
          MoodEntry.findOne({ userId: userObjId, createdAt: { $gte: startOfToday } }).sort({
            createdAt: -1,
          }),
          MoodEntry.find({ userId: userObjId, createdAt: { $gte: fourteenDaysAgo } }).sort({
            createdAt: -1,
          }),
          GameSession.find({
            userId: userObjId,
            status: 'COMPLETED',
            createdAt: { $gte: sevenDaysAgo },
          }).sort({ createdAt: -1 }),
          AssessmentResult.findOne({ userId: userObjId }).sort({ createdAt: -1 }),
        ]);

        todayMood = todayM;
        recentMoods = recentM;
        completedSessions = sessions;
        latestAssessment = assess;
      } catch (err) {
        console.error('Error fetching insight source records:', err);
      }
    }

    // 1. Today's Check-in Insight
    let todayCheckIn: TodayCheckInInsight;
    if (todayMood) {
      const score = todayMood.score || 3;
      let feelWord = 'okay';
      if (score >= 4) feelWord = 'good and positive';
      else if (score <= 2) feelWord = 'a bit low or tense';

      todayCheckIn = {
        checkedInToday: true,
        latestMoodScore: score,
        title: `You checked in feeling ${feelWord} today.`,
        description:
          score <= 2
            ? 'Giving yourself permission to take a gentle 2-minute pause can help ease physical tension.'
            : 'A short reset activity or brief reflection can help you sustain this positive momentum.',
        recommendedAction: {
          label: 'Take a Reset Game',
          route: '/games',
        },
      };
    } else {
      todayCheckIn = {
        checkedInToday: false,
        title: 'You have not checked in today.',
        description:
          'Taking 30 seconds to register how you feel helps you stay mindful of your daily balance.',
        recommendedAction: {
          label: 'Complete check-in',
          route: '/assessment',
        },
      };
    }

    // 2. Focus and Reset Activity Insight
    const weeklyResetCount = completedSessions.length;
    const totalDurationSeconds = completedSessions.reduce(
      (acc, s) => acc + (s.durationSeconds || 0),
      0
    );
    const totalMinutes = Math.round(totalDurationSeconds / 60);

    const gameCounts: Record<string, number> = {};
    for (const session of completedSessions) {
      gameCounts[session.gameType] = (gameCounts[session.gameType] || 0) + 1;
    }

    let favoriteGame = 'FOCUS_ORBIT';
    let maxGameCount = 0;
    for (const [gType, count] of Object.entries(gameCounts)) {
      if (count > maxGameCount) {
        maxGameCount = count;
        favoriteGame = gType;
      }
    }

    const gameLabels: Record<string, string> = {
      FOCUS_ORBIT: 'Focus Orbit (Attention)',
      CALM_GARDEN: 'Calm Garden (Stress-Relief)',
      PATH_OF_BALANCE: 'Path of Balance (Mindful Pacing)',
      BREATHING_FLOW: 'Breathing Flow (Regulation)',
      FOCUS_TAP: 'Focus Tap (Grounding)',
      MOOD_MATCH: 'Mood Match (Emotional Awareness)',
    };

    let focusTitle = 'Your focus and reset activity';
    let focusDescription = 'You have not completed any reset sessions yet this week.';
    let consistencyTrend: 'steady' | 'improving' | 'variable' | 'baseline' = 'baseline';

    if (weeklyResetCount > 0) {
      focusTitle = `You completed ${weeklyResetCount} short reset ${
        weeklyResetCount === 1 ? 'activity' : 'activities'
      } this week.`;

      if (favoriteGame === 'CALM_GARDEN' || favoriteGame === 'BREATHING_FLOW') {
        focusDescription =
          'Calming and somatic activities appear to be your preferred type of study break.';
      } else if (favoriteGame === 'FOCUS_ORBIT' || favoriteGame === 'FOCUS_TAP') {
        focusDescription =
          'Present-moment attention games appear to be your preferred type of study reset.';
      } else {
        focusDescription =
          'Mindful pacing and decision journeys are helping you explore balanced daily choices.';
      }

      if (weeklyResetCount >= 3) {
        consistencyTrend = 'improving';
        focusDescription += ' Your recent focus-game sessions have shown a steady, healthy rhythm.';
      } else {
        consistencyTrend = 'steady';
      }
    }

    const focusReset: FocusResetInsight = {
      weeklyResetCount,
      totalMinutes,
      favoriteGame,
      favoriteGameLabel: gameLabels[favoriteGame] || 'Mindful Resets',
      consistencyTrend,
      title: focusTitle,
      description: focusDescription,
      recentSessions: completedSessions.slice(0, 4).map((s) => ({
        gameType: s.gameType,
        durationSeconds: s.durationSeconds || 0,
        createdAt: s.createdAt,
        accuracy: s.accuracy,
      })),
    };

    // 3. Emotional Wellbeing Trend
    let emotionalTrend: EmotionalTrendInsight;
    if (recentMoods.length >= 3) {
      const avgRecent =
        recentMoods.slice(0, 3).reduce((acc, m) => acc + (m.score || 3), 0) / 3;
      const avgOlder =
        recentMoods.length >= 6
          ? recentMoods.slice(3, 6).reduce((acc, m) => acc + (m.score || 3), 0) / 3
          : avgRecent;

      if (avgRecent <= 2.2) {
        emotionalTrend = {
          trendDirection: 'ELEVATED_STRESS',
          title: 'You have reported more stress during recent study periods.',
          description:
            'When academic demands are high, small intentional pauses and hydration help protect your baseline wellbeing.',
          confidenceLabel: 'Self-reported pattern',
          dataPointsCount: recentMoods.length,
        };
      } else if (avgRecent >= 3.8 && avgRecent >= avgOlder) {
        emotionalTrend = {
          trendDirection: 'IMPROVING',
          title: 'Your recent check-ins reflect steady positive balance.',
          description:
            'You have maintained calm, consistent self-awareness across your daily routine.',
          confidenceLabel: 'Self-reported pattern',
          dataPointsCount: recentMoods.length,
        };
      } else {
        emotionalTrend = {
          trendDirection: 'STEADY',
          title: 'Your recent check-ins have been fairly steady.',
          description:
            'Keeping a regular daily check-in routine provides valuable personal perspective over time.',
          confidenceLabel: 'Self-reported trend',
          dataPointsCount: recentMoods.length,
        };
      }
    } else {
      emotionalTrend = {
        trendDirection: 'INSUFFICIENT_DATA',
        title: 'There is not enough recent data to show a pattern yet.',
        description:
          'Complete a few check-ins or mini-games over the week to begin generating personalized, non-diagnostic wellbeing reflections.',
        confidenceLabel: 'Awaiting data',
        dataPointsCount: recentMoods.length,
      };
    }

    // 4. Suggested Next Step (Dynamic Recommendation or Crisis Guidance)
    let suggestedStep: SuggestedNextStep;

    const isHighRiskAssessment = latestAssessment && latestAssessment.riskLevel === 'HIGH';
    if (isHighRiskAssessment) {
      suggestedStep = {
        id: 'step-crisis-support',
        title: 'Confidential Support is Ready',
        description:
          'If you are feeling overwhelmed or in distress, speaking with a supportive professional or reaching a helpline can make an immediate difference.',
        actionLabel: 'Access Crisis Resources',
        actionRoute: '/crisis',
        category: 'CRISIS',
        isCrisisSupport: true,
      };
    } else if (!todayMood) {
      suggestedStep = {
        id: 'step-today-checkin',
        title: 'Take a 30-Second Check-in',
        description:
          'Register your current emotional weather to keep your personal insights up to date.',
        actionLabel: 'Check In Now',
        actionRoute: '/assessment',
        category: 'ASSESSMENT',
        isCrisisSupport: false,
      };
    } else if (weeklyResetCount === 0) {
      suggestedStep = {
        id: 'step-try-game',
        title: 'Try a 45-Second Focus Orbit Reset',
        description:
          'A simple, calming reaction activity to pull your awareness gently into the present moment.',
        actionLabel: 'Play Focus Orbit',
        actionRoute: '/games?game=FOCUS_ORBIT',
        category: 'GAME',
        isCrisisSupport: false,
      };
    } else if (todayMood && todayMood.score <= 2) {
      suggestedStep = {
        id: 'step-calm-garden',
        title: 'Nurture a Calm Garden',
        description:
          'Take a peaceful 2-minute pause to plant soothing flora and release physical tension.',
        actionLabel: 'Open Calm Garden',
        actionRoute: '/games?game=CALM_GARDEN',
        category: 'GAME',
        isCrisisSupport: false,
      };
    } else {
      suggestedStep = {
        id: 'step-journal-note',
        title: 'Write a Short Journal Note',
        description:
          'Capture a private thought or gratitude reflection in your confidential journal.',
        actionLabel: 'Open Journal',
        actionRoute: '/solutions',
        category: 'JOURNAL',
        isCrisisSupport: false,
      };
    }

    // Retrieve or populate persisted insights
    let allInsights: IWellbeingInsight[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        allInsights = await WellbeingInsight.find({ userId: userObjId })
          .sort({ createdAt: -1 })
          .limit(10);
      } catch (err) {
        console.error('Error fetching persisted insights:', err);
      }
    }

    return {
      todayCheckIn,
      focusReset,
      emotionalTrend,
      suggestedStep,
      allInsights,
      generatedAt: new Date(),
      disclaimer:
        'Personal insights, not a medical diagnosis. Non-clinical activity patterns to support your daily student routine.',
    };
  }

  /**
   * Deletes a specific wellbeing insight belonging to the user.
   */
  public static async deleteInsight(insightId: string, userId: string): Promise<boolean> {
    if (mongoose.connection.readyState !== 1) return true;
    const result = await WellbeingInsight.deleteOne({
      _id: new mongoose.Types.ObjectId(insightId),
      userId: new mongoose.Types.ObjectId(userId),
    });
    return result.deletedCount > 0;
  }
}
