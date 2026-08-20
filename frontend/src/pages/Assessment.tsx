import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const questions = [
  { id: 1, text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 2, text: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 3, text: "How often do you feel overwhelmed by your academic workload?", options: ["Rarely", "Sometimes", "Often", "Always"] },
  { id: 4, text: "How would you rate your sleep quality recently?", options: ["Good", "Fair", "Poor", "Very Poor"] },
  { id: 5, text: "Do you have thoughts of hurting yourself?", options: ["Never", "Rarely", "Sometimes", "Often"], riskTrigger: true }
];

const Assessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (answer: string) => {
    setAnswers({ ...answers, [currentStep]: answer });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentQ = questions[currentStep];
  const progress = ((currentStep) / questions.length) * 100;

  if (showResults) {
    const isHighRisk = answers[4] === "Often" || answers[4] === "Sometimes";
    
    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Well-being Overview</h1>
              <p className="text-slate-600">Based on your recent assessment</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 text-center">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-2">Overall Score</p>
              <div className="text-5xl font-bold text-primary-600 mb-2">68<span className="text-2xl text-slate-400 font-normal">/100</span></div>
              <p className="text-slate-700 font-medium">Moderate Stress Level</p>
            </div>

            {isHighRisk && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 flex items-start">
                <ShieldAlert className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-semibold mb-1">Important Safety Notice</h3>
                  <p className="text-red-700 text-sm mb-3">Based on your responses, we strongly recommend speaking with a professional. You don't have to go through this alone.</p>
                  <div className="flex gap-3">
                    <Button variant="danger" size="sm">Emergency Contacts</Button>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-100">Find a Counselor</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Suggested Next Steps</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                  <p className="text-slate-700 text-sm">Review our resources on managing academic pressure.</p>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                  <p className="text-slate-700 text-sm">Try to establish a consistent sleep schedule for the next 3 days.</p>
                </li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate('/dashboard')} variant="primary">Return to Dashboard</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[currentStep] === option
                        ? 'border-primary-500 bg-primary-50 text-primary-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-slate-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100">
                <Button 
                  variant="ghost" 
                  onClick={handleBack} 
                  disabled={currentStep === 0}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                
                <Button 
                  variant="primary" 
                  onClick={handleNext}
                  disabled={!answers[currentStep]}
                  className="flex items-center"
                >
                  {currentStep === questions.length - 1 ? 'See Results' : 'Next Question'}
                  {currentStep !== questions.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
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
