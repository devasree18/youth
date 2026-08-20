import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  MessageSquare, 
  BookOpen, 
  Stethoscope, 
  Phone, 
  BarChart2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moodOptions = [
    { label: 'Very Low', emoji: '😢', value: 'very_low', color: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' },
    { label: 'Low', emoji: '😕', value: 'low', color: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100' },
    { label: 'Okay', emoji: '😐', value: 'okay', color: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100' },
    { label: 'Good', emoji: '🙂', value: 'good', color: 'bg-primary-50 text-primary-600 border-primary-200 hover:bg-primary-100' },
    { label: 'Great', emoji: '😄', value: 'great', color: 'bg-success-50 text-success-600 border-success-200 hover:bg-success-100' },
  ];

  const handleMoodSelect = (value: string) => {
    setSelectedMood(value);
    // In a real app, call API to save mood here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xl font-bold text-primary-900">
            <HeartPulse className="w-6 h-6 text-accent-500" />
            <span>Student Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/crisis" className="flex items-center text-sm font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">
              <ShieldAlert className="w-4 h-4 mr-1.5" />
              Need urgent help?
            </Link>
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              {user?.name?.[0] || 'S'}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Good morning 👋</h1>
          <p className="text-slate-600 mt-1">Welcome back, {user?.name || 'Student'}. Here is your daily overview.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Mood Check-in */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">How are you feeling today?</h2>
              <div className="flex flex-wrap gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => handleMoodSelect(mood.value)}
                    className={`flex items-center px-4 py-3 rounded-xl border transition-all ${mood.color} ${selectedMood === mood.value ? 'ring-2 ring-offset-1 ring-current scale-105' : 'opacity-80'}`}
                  >
                    <span className="text-2xl mr-2">{mood.emoji}</span>
                    <span className="font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
              {selectedMood && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-600 mb-2">Want to add a note? (Optional)</p>
                  <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="I'm feeling this way because..." rows={2}></textarea>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm">Save Check-in</Button>
                  </div>
                </motion.div>
              )}
            </Card>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/assessment" className="group">
                  <Card hoverable className="p-5 flex items-center justify-between h-full bg-primary-50/50 border-primary-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <HeartPulse className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">Take Assessment</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Check your well-being score</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 transition-colors" />
                  </Card>
                </Link>
                
                <Link to="/ai-assistant" className="group">
                  <Card hoverable className="p-5 flex items-center justify-between h-full bg-accent-50/50 border-accent-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-5 h-5 text-accent-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">Talk to AI Assistant</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Get immediate guidance</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-accent-600 transition-colors" />
                  </Card>
                </Link>

                <Link to="/resources" className="group">
                  <Card hoverable className="p-5 flex items-center justify-between h-full">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5 text-secondary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">Browse Resources</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Self-help & articles</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-secondary-600 transition-colors" />
                  </Card>
                </Link>

                <Link to="/counselors" className="group">
                  <Card hoverable className="p-5 flex items-center justify-between h-full">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <Stethoscope className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">Find a Counselor</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Professional support</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </Card>
                </Link>
              </div>
            </div>

            {/* Recommended For You */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Recommended For You</h2>
                <Link to="/resources" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card hoverable className="p-5">
                  <div className="text-xs font-semibold text-accent-600 mb-2 uppercase tracking-wider">Anxiety & Stress</div>
                  <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">5 Grounding Techniques for When You Feel Overwhelmed</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-500">4 min read</span>
                    <button className="text-primary-600 text-sm font-medium hover:underline">Read Now</button>
                  </div>
                </Card>
                <Card hoverable className="p-5">
                  <div className="text-xs font-semibold text-secondary-600 mb-2 uppercase tracking-wider">Sleep</div>
                  <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">How to Build a Better Sleep Routine in College</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-500">6 min read</span>
                    <button className="text-primary-600 text-sm font-medium hover:underline">Read Now</button>
                  </div>
                </Card>
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Well-being Score */}
            <Card className="p-6 text-center">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Current Well-being Score</h2>
              <div className="relative inline-flex items-center justify-center mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                  <circle cx="64" cy="64" r="56" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="351.8" strokeDashoffset={351.8 - (351.8 * 72) / 100} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-slate-900">72</span>
                  <span className="text-xs text-slate-500">/ 100</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4">Your score is <span className="font-medium text-primary-600">Moderate</span>. You've been doing well, but might benefit from some relaxation techniques.</p>
              <div className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg text-left">
                <strong>Disclaimer:</strong> This score is for self-reflection and is not a medical diagnosis.
              </div>
            </Card>

            {/* Progress Summary */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
                <Link to="/progress" className="text-primary-600 p-1 hover:bg-primary-50 rounded"><BarChart2 className="w-4 h-4" /></Link>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5 mr-3 flex-shrink-0">
                    <span className="text-sm">🙂</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Checked in: Good</p>
                    <p className="text-xs text-slate-500">Yesterday, 9:41 AM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mt-0.5 mr-3 flex-shrink-0">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Completed Assessment</p>
                    <p className="text-xs text-slate-500">Oct 12, 2:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 mt-0.5 mr-3 flex-shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Chatted with AI Support</p>
                    <p className="text-xs text-slate-500">Oct 10, 8:15 PM</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
