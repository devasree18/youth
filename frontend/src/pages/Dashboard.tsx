import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link>
            <Link to="/assessment" className="text-blue-600 hover:underline">Take Assessment</Link>
            <Link to="/solutions" className="text-blue-600 hover:underline">Solutions</Link>
          </nav>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-semibold mb-2">Recent Assessment</h2>
            <p className="text-gray-600 text-sm mb-4">Completed on Aug 19, 2026</p>
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm">
              Focus area: Technical Skills & Soft Skills Integration.
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-semibold mb-2">Action Items</h2>
            <ul className="space-y-3 mt-4">
              <li className="flex items-center text-sm text-gray-700">
                <input type="checkbox" className="mr-3" /> Complete intro to AI module
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <input type="checkbox" className="mr-3" /> Post in the community forum
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
