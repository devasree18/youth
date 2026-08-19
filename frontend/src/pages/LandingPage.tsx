import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Empowering the Youth
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10">
          Discover your path, connect with a supportive community, and get AI-powered insights tailored for your personal growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/assessment" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full font-bold text-lg flex items-center justify-center transition-colors">
            Start Assessment <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link to="/community" className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-full font-bold text-lg flex items-center justify-center transition-colors border border-gray-700">
            Join Community <Compass className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
