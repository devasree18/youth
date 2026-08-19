import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Shield, Users } from 'lucide-react';

import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-primary-900 tracking-tight">LifeLens</div>
        <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
          <Link to="/assessment" className="hover:text-primary-600 transition-colors">How It Works</Link>
          <Link to="/solutions" className="hover:text-primary-600 transition-colors">Features</Link>
          <Link to="/community" className="hover:text-primary-600 transition-colors">Community</Link>
        </div>
        <div className="flex space-x-4">
          <Link to="/dashboard" className="btn-secondary inline-block">Login</Link>
          <Link to="/assessment" className="btn-primary inline-block">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Understand What’s <span className="text-primary-600">Holding You Back.</span><br />
              Discover What Comes Next.
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
              LifeLens helps students understand the patterns behind their struggles and turn them into personalized action plans for growth.
            </p>
            <div className="flex space-x-4">
              <Link to="/assessment" className="btn-primary flex items-center text-lg px-8 py-4">
                Start Your Life Assessment <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/dashboard" className="btn-secondary flex items-center text-lg px-8 py-4">
                Explore How It Works
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative z-10">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-primary-50 rounded-xl p-4">
                  <div className="text-primary-600 text-sm font-semibold mb-1">Clarity Score</div>
                  <div className="text-3xl font-bold text-gray-900">68<span className="text-lg text-gray-500">/100</span></div>
                </div>
                <div className="bg-success-50 rounded-xl p-4">
                  <div className="text-success-600 text-sm font-semibold mb-1">Wellness Score</div>
                  <div className="text-3xl font-bold text-gray-900">74<span className="text-lg text-gray-500">/100</span></div>
                </div>
              </div>
              <div className="bg-secondary-50 rounded-xl p-6 mb-6">
                <div className="flex items-center mb-4">
                  <Compass className="text-secondary-600 w-6 h-6 mr-3" />
                  <h3 className="font-semibold text-gray-900">Today's Micro Action</h3>
                </div>
                <p className="text-gray-700 font-medium">Explore one career role for 15 minutes.</p>
                <button className="mt-4 bg-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-700 transition-colors w-full">Mark as Complete</button>
              </div>
            </div>
            
            {/* Decorative background elements */}
            <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary-100 to-secondary-100 rounded-full blur-3xl opacity-50 z-0"></div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
