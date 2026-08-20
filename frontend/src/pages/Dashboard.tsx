import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Assessment {
  date: string;
  result: string;
}

interface UserProfile {
  name: string;
  email: string;
  assessments: Assessment[];
}

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/user/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const displayName = profile?.name || user?.name || user?.email?.split('@')[0] || 'Guest';

  // Dynamic score generation based on assessment text length for mockup realism
  const generateScore = (base: number, resultText?: string) => {
    if (!resultText) return base;
    const variance = (resultText.length % 20) - 10; 
    return Math.min(100, Math.max(0, base + variance));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gray-500 font-medium">Loading your dashboard...</div>
      </div>
    );
  }

  const hasAssessments = profile && profile.assessments && profile.assessments.length > 0;
  const latestAssessment = hasAssessments ? profile.assessments[profile.assessments.length - 1] : null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Good morning, {displayName}</h1>
          <p className="text-gray-600 mt-2">
            {hasAssessments ? "Let's take one small step today." : "Welcome to your new journey!"}
          </p>
        </header>

        {!hasAssessments ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-3xl shadow-soft text-center border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Journey</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              You haven't taken any career assessments yet. Take your first AI-guided assessment to unlock your personalized insights, clarity scores, and actionable steps.
            </p>
            <button 
              onClick={() => navigate('/assessment')}
              className="bg-primary-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-primary-700 transition-colors"
            >
              Take Assessment Now
            </button>
          </motion.div>
        ) : (
          <>
            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <ScoreCard title="Clarity Score" score={generateScore(70, latestAssessment?.result)} color="primary" />
              <ScoreCard title="Confidence Score" score={generateScore(65, latestAssessment?.result)} color="secondary" />
              <ScoreCard title="Wellness Score" score={generateScore(80, latestAssessment?.result)} color="success" />
              <ScoreCard title="Growth Score" score={generateScore(60, latestAssessment?.result)} color="primary" />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Today's Action */}
                <motion.div className="card border-l-4 border-l-secondary-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Today's Action</h2>
                  <p className="text-gray-800 font-medium text-lg mb-4">Review your latest assessment insights.</p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <span className="font-semibold text-gray-700 block mb-1">Latest AI Feedback:</span>
                    <span className="text-gray-600 text-sm line-clamp-3">"{latestAssessment?.result || 'No specific feedback recorded.'}"</span>
                  </div>
                  <button onClick={() => navigate('/assessment')} className="btn-primary w-full md:w-auto">Take Another Assessment</button>
                </motion.div>

                {/* Current Journey */}
                <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Your Assessment History</h2>
                  <div className="space-y-4">
                    {profile.assessments.slice().reverse().slice(0, 3).map((assessment, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-800">
                          {new Date(assessment.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-xs text-primary-600 font-semibold bg-primary-50 px-2 py-1 rounded">Completed</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="space-y-8">
                {/* Insights */}
                <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Key Patterns</h2>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Career Clarity</span>
                      <span className="font-semibold text-gray-900">{generateScore(60, latestAssessment?.result)}%</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Exploration Focus</span>
                      <span className="font-semibold text-gray-900">{generateScore(80, latestAssessment?.result)}%</span>
                    </li>
                  </ul>
                  <button className="btn-secondary w-full mt-6 text-sm">View Full Analysis</button>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ScoreCard = ({ title, score, color }: { title: string, score: number, color: string }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-white rounded-2xl shadow-soft p-5 border border-gray-100 border-t-4 border-t-${color}-500`}
    >
      <div className="text-gray-500 text-sm font-semibold mb-2">{title}</div>
      <div className="text-4xl font-bold text-gray-900">{score}<span className="text-lg text-gray-400 font-medium">/100</span></div>
    </motion.div>
  );
};

export default Dashboard;
