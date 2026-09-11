import mongoose from 'mongoose';
import { WellbeingSignal, SignalType } from '../models/WellbeingSignal';
import { IGameSession, GameSession } from '../models/GameSession';
import { CrisisService, CrisisEvaluationResult } from './CrisisService';

export interface UserPatternInsight {
  title: string;
  description: string;
  category: 'CALM' | 'FOCUS' | 'AWARENESS' | 'ROUTINE';
  confidenceLabel: 'Observed trend' | 'Self-reported pattern';
}

export interface WellbeingRecommendation {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionRoute: string;
  reason: string;
}

export class SignalEngineService {
  /**
   * Evaluates open-ended reflection text for potential safety or crisis indicators.
   */
  public static evaluateReflectionSafety(text?: string): CrisisEvaluationResult {
    if (!text || text.trim().length === 0) {
      return {
        isCrisis: false,
        riskLevel: 'NONE',
        message: 'No reflection content.',
        resources: CrisisService.EMERGENCY_RESOURCES,
      };
    }
    return CrisisService.evaluateText(text);
  }

  /**
   * Generates a non-diagnostic, supportive insight for a completed game session.
   */
  public static async generateSessionInsight(session: Partial<IGameSession>): Promise<string> {
    const { gameType, preCheckin, postCheckin, userId } = session;

    if (gameType === 'FOCUS_ORBIT') {
      if (userId && mongoose.connection.readyState === 1) {
        try {
          const prevSessions = await GameSession.find({
            userId,
            gameType: 'FOCUS_ORBIT',
            status: 'COMPLETED',
            _id: { $ne: session._id },
          }).sort({ createdAt: -1 }).limit(1);

          if (prevSessions.length > 0) {
            const prevAcc = prevSessions[0].accuracy || 0;
            const curAcc = session.accuracy || 0;
            if (curAcc >= prevAcc && curAcc > 0) {
              return 'Focus reset complete. Your focus was more consistent than in your last session.';
            }
          }
        } catch {
          // ignore lookup errors
        }
      }
      return 'Focus reset complete. You spent a few minutes practising present-moment attention.';
    }

    if (gameType === 'CALM_GARDEN') {
      if (userId && mongoose.connection.readyState === 1) {
        try {
          const calmCount = await GameSession.countDocuments({
            userId,
            gameType: { $in: ['CALM_GARDEN', 'BREATHING_FLOW'] },
            status: 'COMPLETED',
          });
          if (calmCount >= 2) {
            return 'Your garden is growing. You often choose calming activities. Keep taking small moments for yourself.';
          }
        } catch {
          // ignore lookup errors
        }
      }
      return 'Your garden is growing. Taking a quiet pause can be a helpful part of a busy day.';
    }

    if (gameType === 'PATH_OF_BALANCE') {
      return 'You completed a small reset journey. Different moments call for different kinds of support. Explore what helps you feel more balanced.';
    }

    if (gameType === 'BREATHING_FLOW') {
      if (postCheckin === 'overwhelmed' || postCheckin === 'still_overwhelmed') {
        return 'It is okay if a short activity did not change everything. You can try another gentle reset, talk with AI Support, or explore counselor care.';
      }
      if (preCheckin === 'tense' || preCheckin === 'low_energy') {
        return 'You noted feeling tense or low before pausing. Short breathing resets are a reliable, gentle practice when daily demands run high.';
      }
      if (postCheckin === 'better' || postCheckin === 'a_little_better') {
        return 'You reported feeling a little better after this pause. Giving your body a minute to slow down activates natural recovery.';
      }
      return 'You took intentional time to regulate your breathing. Consistent micro-pauses help preserve your daily resilience.';
    }

    if (gameType === 'FOCUS_TAP') {
      if (preCheckin === 'scattered') {
        return 'You completed a short focus reset when your attention felt scattered. Grounding yourself in physical presence helps quiet mental chatter.';
      }
      return 'You completed a 30-second focus reset. Small, present-moment pauses can help reset attention during long study blocks.';
    }

    if (gameType === 'MOOD_MATCH') {
      return 'Naming and differentiating emotional states helps reduce internal tension and build practical emotional awareness.';
    }

    return 'A mindful moment to pause, reflect, and support your everyday wellbeing.';
  }

  /**
   * Creates safe, non-clinical WellbeingSignals from a completed game session.
   */
  public static async processGameSessionSignals(session: IGameSession): Promise<void> {
    try {
      const signalsToCreate: Array<{
        signalType: SignalType;
        value: string | number | boolean;
        confidence: number;
        userReported: boolean;
      }> = [];

      // Game engagement signal (low-confidence baseline)
      signalsToCreate.push({
        signalType: 'GAME_ENGAGEMENT',
        value: session.gameType,
        confidence: 0.6,
        userReported: false,
      });

      // Coping preference
      if (session.status === 'COMPLETED') {
        let pref = 'mindful_reset';
        if (session.gameType === 'FOCUS_ORBIT' || session.gameType === 'FOCUS_TAP') {
          pref = 'grounding';
        } else if (session.gameType === 'CALM_GARDEN' || session.gameType === 'BREATHING_FLOW') {
          pref = 'calm_relaxation';
        } else if (session.gameType === 'PATH_OF_BALANCE') {
          pref = 'mindful_pacing';
        } else if (session.gameType === 'MOOD_MATCH') {
          pref = 'emotional_labeling';
        }

        signalsToCreate.push({
          signalType: 'COPING_PREFERENCE',
          value: pref,
          confidence: 0.7,
          userReported: false,
        });
      }

      // Pre-checkin signals (self-reported, high confidence)
      if (session.preCheckin) {
        if (session.preCheckin === 'tense' || session.preCheckin === 'overwhelmed') {
          signalsToCreate.push({
            signalType: 'SELF_REPORTED_STRESS',
            value: session.preCheckin,
            confidence: 0.85,
            userReported: true,
          });
        } else if (session.preCheckin === 'calm' || session.preCheckin === 'okay') {
          signalsToCreate.push({
            signalType: 'SELF_REPORTED_CALM',
            value: session.preCheckin,
            confidence: 0.85,
            userReported: true,
          });
        } else if (session.preCheckin === 'scattered' || session.preCheckin === 'clear') {
          signalsToCreate.push({
            signalType: 'SELF_REPORTED_FOCUS',
            value: session.preCheckin,
            confidence: 0.85,
            userReported: true,
          });
        }
      }

      // Post-checkin signals
      if (session.postCheckin) {
        if (session.postCheckin === 'better' || session.postCheckin === 'a_little_better') {
          signalsToCreate.push({
            signalType: 'SELF_REPORTED_CALM',
            value: 'improved_after_reset',
            confidence: 0.9,
            userReported: true,
          });
        } else if (session.postCheckin === 'overwhelmed' || session.postCheckin === 'still_overwhelmed') {
          signalsToCreate.push({
            signalType: 'SUPPORT_INTEREST',
            value: 'persistent_overwhelm',
            confidence: 0.9,
            userReported: true,
          });
        }
      }

      // Persist signals to database
      for (const sig of signalsToCreate) {
        const signalDoc = new WellbeingSignal({
          userId: session.userId,
          tenantId: session.tenantId,
          sourceType: 'GAME_SESSION',
          sourceId: session._id.toString(),
          signalType: sig.signalType,
          value: sig.value,
          confidence: sig.confidence,
          userReported: sig.userReported,
          createdAt: new Date(),
        });
        await signalDoc.save();
      }
    } catch (err) {
      console.error('Error processing game session signals:', err);
    }
  }

  /**
   * Retrieves non-diagnostic, privacy-guarded user pattern observations.
   */
  public static async getUserPatterns(userId: string): Promise<UserPatternInsight[]> {
    if (mongoose.connection.readyState !== 1) {
      return [
        {
          title: 'Starting your wellbeing journey',
          description: 'Taking short breaks during study hours helps you understand what pacing works best for you.',
          category: 'ROUTINE',
          confidenceLabel: 'Observed trend',
        },
      ];
    }

    const patterns: UserPatternInsight[] = [];
    const userObjId = new mongoose.Types.ObjectId(userId);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentSessions = await GameSession.find({
      userId: userObjId,
      status: 'COMPLETED',
      createdAt: { $gte: fourteenDaysAgo },
    }).sort({ createdAt: -1 });

    if (recentSessions.length === 0) {
      return [
        {
          title: 'Starting your wellbeing journey',
          description: 'Taking short breaks during study hours helps you understand what pacing works best for you.',
          category: 'ROUTINE',
          confidenceLabel: 'Observed trend',
        },
      ];
    }

    const breathingSessions = recentSessions.filter((s) => s.gameType === 'BREATHING_FLOW');
    const focusSessions = recentSessions.filter((s) => s.gameType === 'FOCUS_TAP');
    const moodSessions = recentSessions.filter((s) => s.gameType === 'MOOD_MATCH');

    const improvedBreathing = breathingSessions.filter(
      (s) => s.postCheckin === 'better' || s.postCheckin === 'a_little_better'
    );

    if (improvedBreathing.length >= 2) {
      patterns.push({
        title: 'Calm breathing resets',
        description: `You reported feeling a little better after ${improvedBreathing.length} recent breathing exercises. A 2-minute breathwork pause appears to be a supportive tool for you.`,
        category: 'CALM',
        confidenceLabel: 'Self-reported pattern',
      });
    } else if (breathingSessions.length >= 2) {
      patterns.push({
        title: 'Calming activity frequency',
        description: `You have completed ${breathingSessions.length} breathing resets over the last two weeks. Consistent pacing supports nervous system regulation.`,
        category: 'CALM',
        confidenceLabel: 'Observed trend',
      });
    }

    if (focusSessions.length >= 2) {
      patterns.push({
        title: 'Focus grounding practice',
        description: `You completed ${focusSessions.length} focus-reset activities recently. Taking a 30-second present-moment pause can aid study recovery.`,
        category: 'FOCUS',
        confidenceLabel: 'Observed trend',
      });
    }

    if (moodSessions.length >= 2) {
      patterns.push({
        title: 'Emotional awareness practice',
        description: 'You regularly engage in mood and situation reflections. Practicing emotional awareness strengthens resilience.',
        category: 'AWARENESS',
        confidenceLabel: 'Observed trend',
      });
    }

    // Default fallback if session counts are low
    if (patterns.length === 0) {
      patterns.push({
        title: 'Mindful pause consistency',
        description: 'You took time for mindful resets recently. Continuing short breaks helps maintain steady energy throughout academic terms.',
        category: 'ROUTINE',
        confidenceLabel: 'Observed trend',
      });
    }

    return patterns;
  }

  /**
   * Generates gentle, non-diagnostic tool recommendations based on real signals.
   */
  public static async getDynamicRecommendations(userId: string): Promise<WellbeingRecommendation[]> {
    if (mongoose.connection.readyState !== 1) {
      return [
        {
          id: 'rec_breathing_default',
          title: 'Need a quick reset?',
          description: 'Try a 2-minute breathing activity to help ease tension and settle your nervous system.',
          actionLabel: 'Take a reset',
          actionRoute: '/games?game=BREATHING_FLOW',
          reason: 'Daily relaxation practice',
        },
      ];
    }
    const userObjId = new mongoose.Types.ObjectId(userId);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSessions = await GameSession.find({
      userId: userObjId,
      createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: -1 });

    const persistentOverwhelm = recentSessions.filter(
      (s) => s.postCheckin === 'overwhelmed' || s.postCheckin === 'still_overwhelmed'
    ).length;

    if (persistentOverwhelm >= 2) {
      return [
        {
          id: 'rec_support',
          title: 'Consider an extra layer of support',
          description: 'You noted feeling overwhelmed in multiple recent check-ins. Talking with a campus counselor or AI Support can provide safe, private clarity.',
          actionLabel: 'Explore counseling options',
          actionRoute: '/counselors',
          reason: 'Self-reported persistent overwhelm',
        },
        {
          id: 'rec_breathing',
          title: 'Gentle 2-minute breathing break',
          description: 'A slow 4-4-4-2 breathing cycle can offer a gentle pause without pressure.',
          actionLabel: 'Start breathing reset',
          actionRoute: '/games?game=BREATHING_FLOW',
          reason: 'Somatic calming',
        },
      ];
    }

    const recentFocusIssues = recentSessions.filter((s) => s.preCheckin === 'scattered').length;
    if (recentFocusIssues >= 2) {
      return [
        {
          id: 'rec_focus',
          title: '30-second focus grounding',
          description: 'When studying feels scattered, a 30-second present-moment tap exercise helps reset your concentration.',
          actionLabel: 'Start focus tap',
          actionRoute: '/games?game=FOCUS_TAP',
          reason: 'Self-reported scattered focus',
        },
        {
          id: 'rec_resources',
          title: 'Study stress & rest protocols',
          description: 'Evidence-based guides on managing exam workload and restorative sleep.',
          actionLabel: 'Read focus guides',
          actionRoute: '/resources',
          reason: 'Study pacing',
        },
      ];
    }

    // Default balanced recommendation
    return [
      {
        id: 'rec_breathing_default',
        title: 'Need a quick reset?',
        description: 'Try a 2-minute breathing activity to help ease tension and settle your nervous system.',
        actionLabel: 'Take a reset',
        actionRoute: '/games?game=BREATHING_FLOW',
        reason: 'Daily relaxation practice',
      },
      {
        id: 'rec_mood_match',
        title: 'Explore emotional awareness',
        description: 'Practice naming feelings in common student scenarios to navigate stress smoothly.',
        actionLabel: 'Try Mood Match',
        actionRoute: '/games?game=MOOD_MATCH',
        reason: 'Emotional clarity',
      },
    ];
  }

  /**
   * Deletes a game session and cleans up associated signals and reflection data.
   */
  public static async deleteGameSessionAndSignals(sessionId: string, userId: string): Promise<boolean> {
    const session = await GameSession.findOneAndDelete({
      _id: sessionId,
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!session) return false;

    // Delete associated signals
    await WellbeingSignal.deleteMany({
      sourceId: sessionId,
      userId: new mongoose.Types.ObjectId(userId),
    });

    return true;
  }
}
