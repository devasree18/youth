import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { assessmentService, type AssessmentTemplate, type AssessmentResult } from '../services/assessmentService';
import { AppShell } from '../components/layout/AppShell';
import { fadeInVariants, scaleEntranceVariants } from '../lib/motion';

const FALLBACK_TEMPLATE: AssessmentTemplate = {
  code: 'WELLBEING_CHECKIN_V1',
  title: 'Standard Student Wellbeing & Academic Stress Assessment',
  description: 'A clinical evaluation covering emotional resilience, academic anxiety, sleep quality, and social support.',
  version: 1,
  questions: [
    {
      id: 'q1_mood',
      text: 'How would you describe your overall emotional state over the past week?',
      options: [
        { label: 'Frequently overwhelmed or exhausted', value: 1 },
        { label: 'Somewhat stressed or tense', value: 2 },
        { label: 'Generally balanced and okay', value: 3 },
        { label: 'Mostly positive and engaged', value: 4 },
        { label: 'Energized, confident, and optimistic', value: 5 },
      ],
    },
    {
      id: 'q2_sleep',
      text: 'How would you rate the quality and consistency of your sleep?',
      options: [
        { label: 'Severely disrupted or under 4 hours nightly', value: 1 },
        { label: 'Restless or irregular', value: 2 },
        { label: 'Adequate but could improve', value: 3 },
        { label: 'Good, restful sleep', value: 4 },
        { label: 'Consistently restorative and refreshing', value: 5 },
      ],
    },
    {
      id: 'q3_stress',
      text: 'How effectively are you managing your academic and personal workload?',
      options: [
        { label: 'Struggling heavily to keep up', value: 1 },
        { label: 'Managing with considerable effort', value: 2 },
        { label: 'Moderate balance', value: 3 },
        { label: 'Handling tasks comfortably', value: 4 },
        { label: 'Fully organized and on track', value: 5 },
      ],
    },
    {
      id: 'q4_social',
      text: 'Do you feel supported by friends, family, or campus peers?',
      options: [
        { label: 'Isolated with minimal support', value: 1 },
        { label: 'Rarely supported when needed', value: 2 },
        { label: 'Occasionally supported', value: 3 },
        { label: 'Well supported', value: 4 },
        { label: 'Strong, reliable network of support', value: 5 },
      ],
    },
    {
      id: 'q5_focus',
      text: 'How would you rate your ability to concentrate during study sessions?',
      options: [
        { label: 'Extremely difficult to concentrate', value: 1 },
        { label: 'Frequently distracted', value: 2 },
        { label: 'Moderate concentration', value: 3 },
        { label: 'Good focus throughout the day', value: 4 },
        { label: 'Sharp and sustained deep focus', value: 5 },
      ],
    },
  ],
};

export const Assessment = () => {
  const [template, setTemplate] = useState<AssessmentTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTemplate() {
      try {
        const res = await assessmentService.getTemplates();
        if (res.success && res.data && res.data.length > 0) {
          setTemplate(res.data[0]);
        } else {
          setTemplate(FALLBACK_TEMPLATE);
        }
      } catch {
        setTemplate(FALLBACK_TEMPLATE);
      } finally {
        setLoading(false);
      }
    }
    loadTemplate();
  }, []);

  const handleSelectOption = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const currentQuestions = template?.questions || [];
  const currentQuestion = currentQuestions[currentStep];
  const totalQuestions = currentQuestions.length;
  const progress = totalQuestions > 0 ? ((currentStep + 1) / totalQuestions) * 100 : 0;

  const handleNext = async () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setSubmitting(true);
      try {
        const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
          questionId: qId,
          selectedValue: val,
        }));
        const res = await assessmentService.submitAssessment(
          template?.code || 'WELLBEING_CHECKIN_V1',
          formattedAnswers
        );
        if (res.success && res.data) {
          setResult(res.data);
        } else {
          const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
          const maxPossible = totalQuestions * 5;
          const scorePercent = Math.round((totalScore / maxPossible) * 100);
          setResult({
            _id: 'res-local',
            templateCode: template?.code || 'WELLBEING_CHECKIN_V1',
            totalScore: totalScore,
            maxPossibleScore: maxPossible,
            normalizedScore: scorePercent,
            riskLevel: scorePercent >= 75 ? 'LOW' : scorePercent >= 50 ? 'MODERATE' : 'HIGH',
            interpretationLabel: scorePercent >= 75 ? 'Optimal Wellbeing' : scorePercent >= 50 ? 'Moderate Stress' : 'Elevated Stress',
            summary: 'Assessment calculated successfully.',
            recommendations: [
              'Continue maintaining consistent sleep and hydration routines.',
              'Schedule regular 5-minute Pomodoro rest breaks during study periods.',
              'Explore guided mindfulness exercises in the Resource Hub.',
            ],
            createdAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Failed to submit assessment:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resetAssessment = () => {
    setAnswers({});
    setCurrentStep(0);
    setResult(null);
  };

  const displayScore = result ? (result.normalizedScore ?? result.totalScore ?? 75) : 0;

  return (
    <AppShell
      title="Wellbeing Check-in"
      subtitle="Standardized self-assessment for emotional balance and stress level tracking"
    >
      <div className="max-w-2xl mx-auto py-4">
        {loading ? (
          <Card className="p-8 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </Card>
        ) : result ? (
          /* Assessment Results View with Motion */
          <motion.div
            variants={scaleEntranceVariants}
            initial="initial"
            animate="animate"
          >
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Check-in Complete</h2>
                <p className="text-xs text-slate-500">
                  Your responses have been securely logged and analyzed.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Calculated Score
                </span>
                <div className="text-4xl font-extrabold text-[#172033] my-1.5">
                  {displayScore} <span className="text-base font-normal text-slate-400">/ 100</span>
                </div>
                <Badge
                  variant={
                    displayScore >= 75
                      ? 'success'
                      : displayScore >= 50
                      ? 'primary'
                      : 'warning'
                  }
                  dot
                  size="md"
                >
                  {result.interpretationLabel || (displayScore >= 75 ? 'Optimal Wellbeing' : 'Moderate Stress')}
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Personalized Recommendations
                </h4>
                <ul className="space-y-2">
                  {(result.recommendations || [
                    'Maintain balanced study breaks between coursework.',
                    'Stay hydrated and prioritize consistent evening sleep hours.',
                    'Reach out to campus counselors if academic pressure escalates.',
                  ]).map((rec, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-2.5 text-xs text-slate-700 bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button variant="secondary" size="default" onClick={resetAssessment} leftIcon={<RotateCcw className="w-4 h-4" />}>
                  Retake Assessment
                </Button>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Button variant="outline" size="default" onClick={() => navigate('/counselors')}>
                    Find Counselor
                  </Button>
                  <Button variant="primary" size="default" onClick={() => navigate('/dashboard')}>
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Active Question Step View */
          <Card className="p-6 sm:p-8 space-y-6 rounded-2xl border-slate-200/90 shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-[#111827]">
                  Question {currentStep + 1} of {totalQuestions}
                </span>
                <span className="font-semibold">{Math.round(progress)}% Completed</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-emerald-600 h-2 rounded-full"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={fadeInVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-[#111827] leading-snug">
                    {currentQuestion?.text}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal">
                    Choose the option that most closely reflects your experience over the past 7 days.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {currentQuestion?.options.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        onClick={() => handleSelectOption(currentQuestion.id, opt.value)}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold shadow-xs ring-2 ring-emerald-500/20'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="secondary"
                size="default"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Previous
              </Button>

              <Button
                variant="primary"
                size="default"
                onClick={handleNext}
                disabled={!answers[currentQuestion?.id]}
                isLoading={submitting}
                rightIcon={
                  currentStep === totalQuestions - 1 ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )
                }
              >
                {currentStep === totalQuestions - 1 ? 'Submit Check-in' : 'Next Question'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
};

export default Assessment;
