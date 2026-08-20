import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, UserCheck, Heart, Stethoscope, MessageSquare, Activity, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-slate-100">
        <div className="flex items-center space-x-2 text-xl font-bold text-primary-900 tracking-tight">
          <Heart className="w-6 h-6 text-accent-500" />
          <span>Youth Mental Health Access</span>
        </div>
        <div className="hidden md:flex space-x-6 text-slate-600 font-medium">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <Link to="/how-it-works" className="hover:text-primary-600 transition-colors">How It Works</Link>
          <Link to="/features" className="hover:text-primary-600 transition-colors">Features</Link>
          <Link to="/resources" className="hover:text-primary-600 transition-colors">Resources</Link>
          <Link to="/pricing" className="hover:text-primary-600 transition-colors">Pricing</Link>
          <Link to="/about" className="hover:text-primary-600 transition-colors">About</Link>
        </div>
        <div className="flex space-x-3 items-center">
          <Link to="/login" className="text-slate-700 font-medium hover:text-primary-600">Login</Link>
          <Link to="/assessment">
            <Button variant="primary">Start Check-in</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-6">
              Your Mental Health Matters. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">You Don’t Have to Face It Alone.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              Private, affordable, and student-focused mental-health support designed for college students.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/assessment">
                <Button size="lg" className="w-full sm:w-auto text-base">
                  Start Your Well-being Check-in <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/resources">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base border-slate-200 text-slate-700 hover:bg-slate-50">
                  Explore Resources
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-2 gap-4 text-sm font-medium text-slate-600">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-accent-500" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-primary-500" />
                <span>Anonymous Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span>Personalized Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-secondary-500" />
                <span>Professional Referral</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <Card className="p-6 relative z-10 border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Welcome back 👋</h3>
                  <p className="text-sm text-slate-500">How are you feeling today?</p>
                </div>
                <div className="flex space-x-2">
                  {['😢', '😕', '😐', '🙂', '😄'].map((emoji, i) => (
                    <button key={i} className="text-2xl hover:scale-110 transition-transform bg-slate-50 rounded-full w-10 h-10 flex items-center justify-center border border-slate-100">{emoji}</button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-primary-50 rounded-xl p-4 border border-primary-100/50">
                  <div className="flex items-center space-x-2 mb-2 text-primary-700">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm font-semibold">Well-being Score</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">72<span className="text-base text-slate-500 font-normal">/100</span></div>
                </div>
                <div className="bg-accent-50 rounded-xl p-4 border border-accent-100/50">
                  <div className="flex items-center space-x-2 mb-2 text-accent-700">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-semibold">AI Support</span>
                  </div>
                  <div className="text-sm text-slate-700 font-medium">Ready to listen and help.</div>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center space-x-2 mb-3 text-slate-700">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-semibold">Recommended for you</span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                  <h4 className="font-medium text-slate-900 text-sm mb-1">Managing Exam Stress</h4>
                  <p className="text-xs text-slate-500">5 min read • Academic Pressure</p>
                </div>
              </div>
            </Card>
            
            {/* Decorative background elements */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-primary-100/60 to-accent-100/60 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
