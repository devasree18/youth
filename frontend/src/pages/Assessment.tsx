import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { assessmentService, type AssessmentTemplate, type AssessmentResult } from '../services/assessmentService';
import { AppShell } from '../components/layout/AppShell';

const FALLBACK_TEMPLATE: AssessmentTemplate = {
  code: 'WELLBEING_CHECKIN_V1',
  title: 'Comprehensive Student Wellbeing Check-in',
  description: 'A baseline assessment covering emotional state, stress management, sleep quality, and academic balance.',
  version: 1,
  questions: [
    {
      id: 'q1_mood',
      text: 'How would you describe your general mood over the past week?',
      options: [
        { label: 'Very low / Exhausted', value: 1 },
        { label: 'Somewhat stressed / Anxious', value: 2 },
        { label: 'Balanced / Okay', value: 3 },
        { label: 'Mostly positive', value: 4 },
        { label: 'Optimistic and energized', value: 5 }
      ]
    },
    {
      id: 'q2_sleep',
      text: 'How restful has your sleep been recently?',
      options: [
        { label: 'Severely disrupted (<4 hrs)', value: 1 },
        { label: 'Irregular or restless', value: 2 },
        { label: 'Moderate / Adequate', value: 3 },
        { label: 'Good quality sleep', value: 4 },
        { label: 'Consistently restful & refreshing', value: 5 }
      ]
    },
    {
      id: 'q3_stress',
      text: 'How well do you feel you are coping with current stress levels?',
      options: [
        { label: 'Overwhelmed / Unable to cope', value: 1 },
        { label: 'Struggling to keep up', value: 2 },
        { label: 'Managing with effort', value: 3 },
        { label: 'Coping well', value: 4 },
        { label: 'Thriving under pressure', value: 5 }
      ]
    },
    {
      id: 'q4_social',
      text: 'Do you feel supported by friends, family, or campus community?',
      options: [
        { label: 'Isolated / No support', value: 1 },
        { label: 'Rarely supported', value: 2 },
        { label: 'Sometimes supported', value: 3 },
        { label: 'Well supported', value: 4 },
        { label: 'Strong, supportive network', value: 5 }
      ]
    },
    {
      id: 'q5_focus',
      text: 'How would you rate your ability to concentrate on daily goals?',
      options: [
        { label: 'Extremely difficult', value: 1 },
        { label: 'Frequently distracted', value: 2 },
        { label: 'Moderate concentration', value: 3 },
        { label: 'Good focus', value: 4 },
        { label: 'Sharp and consistent focus', value: 5 }
      ]
    }
  ]
};

const Assessment = () => {
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

  const activeTemplate = template || FALLBACK_TEMPLATE;
  const questions = activeTemplate.questions;
  const currentQ = questions[currentStep];

  const handleSelect = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const formattedAnswers = Object.entries(answers).map(([questionId, selectedValue]) => ({
      questionId,
      selectedValue
    }));

    try {
      const res = await assessmentService.submitAssessment(activeTemplate.code, formattedAnswers);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        const totalScore = formattedAnswers.reduce((sum, a) => sum + a.selectedValue, 0);
        const maxScore = formattedAnswers.length * 5;
        const norm = Math.round((totalScore / maxScore) * 100);
        setResult({
          _id: 'offline-result',
          templateCode: activeTemplate.code,
          totalScore,
          maxPossibleScore: maxScore,
          normalizedScore: norm,
          riskLevel: norm < 40 ? 'HIGH' : norm < 70 ? 'MODERATE' : 'LOW',
          interpretationLabel: norm < 40 ? 'Elevated Stress' : norm < 70 ? 'Moderate Stress' : 'Optimal Wellbeing',
          summary: 'Assessment calculated locally based on your choices.',
          recommendations: ['Review your daily wellness habits.', 'Connect with campus counseling if stress persists.'],
          createdAt: new Date().toISOString()
        });
      }
    } catch {
      const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
      const maxScore = questions.length * 5;
      const norm = Math.round((totalScore / Math.max(maxScore, 1)) * 100);
      setResult({
        _id: 'offline-result',
        templateCode: activeTemplate.code,
        totalScore,
        maxPossibleScore: maxScore,
        normalizedScore: norm,
        riskLevel: norm < 40 ? 'HIGH' : norm < 70 ? 'MODERATE' : 'LOW',
        interpretationLabel: norm < 40 ? 'Elevated Stress' : norm < 70 ? 'Moderate Stress' : 'Optimal Wellbeing',
        summary: 'Assessment score completed.',
        recommendations: ['Maintain your healthy sleep and exercise routines.', 'Reach out for support when needed.'],
        createdAt: new Date().toISOString()
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <AppShell title="Wellbeing Assessment">
        <div className="flex items-center justify-center py-20 text-slate-500 space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-sm font-semibold">Loading Assessment Tool...</span>
        </div>
      </AppShell>
    );
  }

  if (result) {
    const isHighRisk = result.riskLevel === 'HIGH' || result.riskLevel === 'CRISIS';

    return (
      <AppShell title="Assessment Results" subtitle={activeTemplate.title}>
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Your Assessment Summary</h2>
              <p className="text-xs text-slate-500">{activeTemplate.title}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 mb-8 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Calculated Wellbeing Index</p>
              <div className="text-5xl font-black text-blue-600 mb-2">
                {result.normalizedScore}<span className="text-2xl text-slate-400 font-normal">/100</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{result.interpretationLabel}</p>
              <p className="text-xs text-slate-500 mt-1">{result.summary}</p>
            </div>

            {isHighRisk && (
              <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-6 mb-8 flex items-start space-x-4">
                <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-rose-900 font-bold text-sm mb-1">Safety & Clinical Guidance</h4>
                  <p className="text-rose-700 text-xs mb-3">Based on your responses, we strongly recommend reaching out to campus support services. Free 24/7 help is available.</p>
                  <div className="flex gap-2">
                    <Button variant="danger" size="sm" onClick={() => navigate('/crisis')}>24/7 Hotlines</Button>
                    <Button variant="outline" size="sm" className="border-rose-200 text-rose-700 hover:bg-rose-100" onClick={() => navigate('/counselors')}>Book Counselor</Button>
                  </div>
                </div>
              </div>
            )}

            {result.recommendations && result.recommendations.length > 0 && (
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-900 mb-4">Recommended Wellbeing Steps</h4>
                <div className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium">
                      <div className="w-5 h-5 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold mr-3 shrink-0 mt-0.5">{idx + 1}</div>
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate('/dashboard')} variant="primary">Return to Dashboard</Button>
            </div>
          </Card>
        </div>
      </AppShell>
    );
  }

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <AppShell title="Wellbeing Assessment" subtitle={`Question ${currentStep + 1} of ${questions.length}`}>
      <div className="max-w-2xl mx-auto py-4">
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">
                {currentQ.text}
              </h2>
              
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = answers[currentQ.id] === option.value;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(currentQ.id, option.value)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all text-xs font-semibold ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
                <Button 
                  variant="ghost" 
                  onClick={handleBack} 
                  disabled={currentStep === 0 || submitting}
                  className="flex items-center text-xs"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                </Button>
                
                <Button 
                  variant="primary" 
                  onClick={handleNext}
                  disabled={answers[currentQ.id] === undefined || submitting}
                  className="flex items-center text-xs"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : currentStep === questions.length - 1 ? (
                    'Submit Assessment'
                  ) : (
                    'Next Question'
                  )}
                  {!submitting && currentStep !== questions.length - 1 && <ArrowRight className="w-4 h-4 ml-1.5" />}
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
        
        <p className="text-center text-[11px] text-slate-400 mt-6">
          Privacy Disclaimer: Answers are confidential and used only to calculate your personal wellbeing indicators.
        </p>
      </div>
    </AppShell>
  );
};

export default Assessment;


