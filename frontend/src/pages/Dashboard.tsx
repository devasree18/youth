import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Guest';

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Good morning, {displayName}</h1>
          <p className="text-gray-600 mt-2">Let's take one small step today.</p>
        </header>

        {/* Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <ScoreCard title="Clarity Score" score={68} color="primary" />
          <ScoreCard title="Confidence Score" score={61} color="secondary" />
          <ScoreCard title="Wellness Score" score={74} color="success" />
          <ScoreCard title="Growth Score" score={57} color="primary" />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Action */}
            <motion.div className="card border-l-4 border-l-secondary-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Today's Action</h2>
              <p className="text-gray-800 font-medium text-lg mb-4">Explore one career role for 15 minutes.</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <span className="font-semibold text-gray-700 block mb-1">Why this matters:</span>
                <span className="text-gray-600 text-sm">Small exploration reduces uncertainty and helps you make decisions based on information rather than fear.</span>
              </div>
              <button className="btn-primary w-full md:w-auto">Mark as Complete</button>
            </motion.div>

            {/* Current Journey */}
            <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Current Journey</h2>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800">Placement Confidence Journey</span>
                <span className="text-sm font-semibold text-primary-600">Week 2</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-sm text-gray-600">You are currently focusing on DSA Practice and mock interviews.</p>
            </motion.div>
          </div>

          <div className="space-y-8">
            {/* Insights */}
            <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Patterns</h2>
              <ul className="space-y-4">
                <li className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Career Uncertainty</span>
                  <span className="font-semibold text-gray-900">42%</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Fear of Failure</span>
                  <span className="font-semibold text-gray-900">28%</span>
                </li>
              </ul>
              <button className="btn-secondary w-full mt-6 text-sm">View Full Analysis</button>
            </motion.div>
          </div>
        </div>
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
