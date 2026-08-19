import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Assessment = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/assessment/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: "Sample answers" })
      });
      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Personal AI Assessment</h2>
        
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What are your primary goals for the next 6 months?</label>
              <textarea 
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3 min-h-[100px]" 
                placeholder="E.g., Learn to code, improve mental health, find a job..."
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {loading ? 'Generating Insights...' : 'Get AI Insights'}
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Your Personalized Path</h3>
              <p className="text-green-700">{result}</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
