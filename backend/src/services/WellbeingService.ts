import mongoose from 'mongoose';
import { MoodEntry } from '../models/MoodEntry';
import { AssessmentResult } from '../models/AssessmentResult';

export interface WellbeingSummary {
  wellbeingScore: number; // 0 to 100
  scoreLabel: 'Low' | 'Moderate' | 'Good' | 'Optimal';
  trend: 'Improving' | 'Stable' | 'Needs Attention';
  recentMoodCount: number;
  latestAssessmentDate?: Date;
  recommendations: string[];
}

export class WellbeingService {
  public static async calculateWellbeingScore(userId: string): Promise<WellbeingSummary> {
    if (mongoose.connection.readyState !== 1) {
      // Offline/Test baseline when database connection is not active
      return {
        wellbeingScore: 70,
        scoreLabel: 'Good',
        trend: 'Stable',
        recentMoodCount: 0,
        recommendations: [
          'Take 5 minutes today for a breathing exercise.',
          'Maintain regular sleep patterns and stay hydrated.'
        ]
      };
    }

    const userObjId = new mongoose.Types.ObjectId(userId);

    // Fetch mood entries from last 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentMoods = await MoodEntry.find({
      userId: userObjId,
      createdAt: { $gte: fourteenDaysAgo }
    }).sort({ createdAt: -1 });

    // Fetch latest assessment result
    const latestAssessment = await AssessmentResult.findOne({
      userId: userObjId
    }).sort({ createdAt: -1 });

    let moodScoreComponent = 70; // default baseline if no entries
    if (recentMoods.length > 0) {
      // Mood score is 1-5, convert to 0-100 scale (1=20, 5=100)
      const avgMoodScore = recentMoods.reduce((acc, m) => acc + m.score, 0) / recentMoods.length;
      moodScoreComponent = Math.round((avgMoodScore / 5) * 100);
    }

    let assessmentScoreComponent = 70; // default baseline if no assessment
    if (latestAssessment) {
      assessmentScoreComponent = latestAssessment.normalizedScore;
    }

    // Weighting: 40% mood trend, 60% assessment result
    const overallScore = Math.round((moodScoreComponent * 0.4) + (assessmentScoreComponent * 0.6));

    let scoreLabel: 'Low' | 'Moderate' | 'Good' | 'Optimal' = 'Moderate';
    let recommendations: string[] = [
      'Take 5 minutes today for a breathing exercise.',
      'Maintain regular sleep patterns and stay hydrated.'
    ];

    if (overallScore >= 80) {
      scoreLabel = 'Optimal';
      recommendations = [
        'Great job keeping up your wellbeing practices!',
        'Consider sharing positive insights with friends or community.'
      ];
    } else if (overallScore >= 65) {
      scoreLabel = 'Good';
      recommendations = [
        'You are doing well overall. Keep tracking your mood regularly.',
        'Try incorporating short physical walks between work blocks.'
      ];
    } else if (overallScore >= 50) {
      scoreLabel = 'Moderate';
      recommendations = [
        'Your wellbeing score is moderate. Consider exploring guided relaxation tools.',
        'Try taking a deep check-in assessment or speaking with a peer helper.'
      ];
    } else {
      scoreLabel = 'Low';
      recommendations = [
        'Your self-reported wellbeing is lower than usual.',
        'Consider reaching out to a professional counselor or taking time for self-care.'
      ];
    }

    // Determine trend from recent moods
    let trend: 'Improving' | 'Stable' | 'Needs Attention' = 'Stable';
    if (recentMoods.length >= 2) {
      const latestMood = recentMoods[0].score;
      const previousMood = recentMoods[1].score;
      if (latestMood > previousMood) trend = 'Improving';
      else if (latestMood < previousMood) trend = 'Needs Attention';
    }

    return {
      wellbeingScore: overallScore,
      scoreLabel,
      trend,
      recentMoodCount: recentMoods.length,
      latestAssessmentDate: latestAssessment?.createdAt,
      recommendations
    };
  }
}
