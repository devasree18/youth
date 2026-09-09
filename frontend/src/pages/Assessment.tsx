import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { assessmentService, type AssessmentTemplate, type AssessmentResult } from '../services/assessmentService';

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
        // Fallback calculation for offline / unauthenticated preview
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-3 text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span>Loading Assessment...</span>
        </div>
      </div>
    );
  }

  if (result) {
    const isHighRisk = result.riskLevel === 'HIGH' || result.riskLevel === 'CRISIS';

    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Assessment Results</h1>
              <p className="text-slate-600">{activeTemplate.title}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 text-center">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-2">Wellbeing Score</p>
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {result.normalizedScore}<span className="text-2xl text-slate-400 font-normal">/100</span>
              </div>
              <p className="text-slate-700 font-medium">{result.interpretationLabel}</p>
              <p className="text-xs text-slate-500 mt-1">{result.summary}</p>
            </div>

            {isHighRisk && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 flex items-start">
                <ShieldAlert className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-semibold mb-1">Important Safety Notice</h3>
                  <p className="text-red-700 text-sm mb-3">Based on your responses, we strongly recommend speaking with a professional. Confidential support is available 24/7.</p>
                  <div className="flex gap-3">
                    <Button variant="danger" size="sm" onClick={() => navigate('/crisis')}>Emergency Hotlines</Button>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-100" onClick={() => navigate('/counselors')}>Find a Counselor</Button>
                  </div>
                </div>
              </div>
            )}

            {result.recommendations && result.recommendations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Suggested Next Steps</h3>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">{idx + 1}</div>
                      <p className="text-slate-700 text-sm">{rec}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate('/dashboard')} variant="primary">Return to Dashboard</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-slate-500">
            Cancel
          </Button>
          <div className="text-sm font-medium text-slate-500">Question {currentStep + 1} of {questions.length}</div>
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full mb-12 overflow-hidden">
          <motion.div 
            className="h-full bg-primary-500"
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
            <Card className="p-8 md:p-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
                {currentQ.text}
              </h2>
              
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = answers[currentQ.id] === option.value;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(currentQ.id, option.value)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 text-primary-900 font-medium'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100">
                <Button 
                  variant="ghost" 
                  onClick={handleBack} 
                  disabled={currentStep === 0 || submitting}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                
                <Button 
                  variant="primary" 
                  onClick={handleNext}
                  disabled={answers[currentQ.id] === undefined || submitting}
                  className="flex items-center"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : currentStep === questions.length - 1 ? (
                    'Submit Assessment'
                  ) : (
                    'Next Question'
                  )}
                  {!submitting && currentStep !== questions.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
        
        <p className="text-center text-xs text-slate-500 mt-8">
          Disclaimer: This assessment is not a medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default Assessment;

