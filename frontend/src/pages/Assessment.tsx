import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Assessment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-soft p-10 border border-gray-100">
        <div className="text-sm font-semibold text-primary-600 mb-8 uppercase tracking-wider">Step {step} of 3</div>
        
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {step === 1 && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How clear do you feel about your career direction?</h2>
              <div className="space-y-4">
                {['Very clear', 'Somewhat clear', 'Uncertain', 'Very confused'].map((option, i) => (
                  <button key={i} onClick={handleNext} className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors font-medium text-gray-700">
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How often do you compare yourself to others?</h2>
              <div className="space-y-4">
                {['Rarely', 'Sometimes', 'Often', 'Almost constantly'].map((option, i) => (
                  <button key={i} onClick={handleNext} className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-secondary-500 hover:bg-secondary-50 transition-colors font-medium text-gray-700">
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What is your primary goal right now?</h2>
              <textarea 
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:outline-none mb-6 h-32 resize-none"
                placeholder="I want to feel more confident in..."
              ></textarea>
              <button onClick={handleNext} className="btn-primary w-full py-4 text-lg">Analyze My Responses</button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Assessment;
