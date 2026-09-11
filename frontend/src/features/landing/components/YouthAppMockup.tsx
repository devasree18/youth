import React from 'react';
import {
  Brain,
  Wind,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Lock,
} from 'lucide-react';


export const YouthAppMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto select-none">
      {/* Ambient background glow behind the app frame */}
      <div
        className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 rounded-3xl blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Browser / App Window Container */}
      <div className="relative bg-white border border-[#DADCE0] rounded-2xl shadow-[0_20px_60px_-15px_rgba(60,64,67,0.15)] overflow-hidden">
        
        {/* Window Top Bar / Header */}
        <div className="h-10 bg-[#F8F9FA] border-b border-[#E8EAED] px-4 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC04]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]/80" />
          </div>

          <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-md border border-[#DADCE0] text-[11px] text-[#5F6368] font-mono">
            <Lock className="w-3 h-3 text-[#1A73E8]" />
            <span>app.youth.edu/dashboard</span>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span className="hidden sm:inline">Client-Side Private</span>
          </div>
        </div>

        {/* App Inner Body Grid */}
        <div className="p-5 sm:p-6 bg-[#FAFBFC] space-y-4 text-left">
          
          {/* Top User Greeting & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8EAED]">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#202124] flex items-center gap-2">
                Good afternoon, Alex
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] border border-blue-100">
                  Week 8 · Midterm Prep
                </span>
              </h2>
              <p className="text-xs text-[#5F6368] mt-0.5">
                Your emotional resilience is steady. 3 consecutive days checked in.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#1A73E8] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
                Resilience: 84%
              </span>
            </div>
          </div>

          {/* Core Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Card 1: 7-Day Trend Visualizer */}
            <div className="p-4 rounded-xl bg-white border border-[#E8EAED] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#202124]">
                  <TrendingUp className="w-4 h-4 text-[#1A73E8]" />
                  <span>Emotional Rhythm</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  +12% vs last week
                </span>
              </div>

              {/* Sparkline Histogram Representation */}
              <div className="h-16 flex items-end justify-between gap-1.5 pt-2">
                {[
                  { day: 'Mon', h: '45%', val: '65' },
                  { day: 'Tue', h: '60%', val: '72' },
                  { day: 'Wed', h: '40%', val: '58' },
                  { day: 'Thu', h: '75%', val: '80' },
                  { day: 'Fri', h: '85%', val: '88' },
                  { day: 'Sat', h: '70%', val: '78' },
                  { day: 'Sun', h: '90%', val: '84', active: true },
                ].map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-slate-100 rounded-t-sm relative h-12 flex items-end">
                      <div
                        style={{ height: item.h }}
                        className={`w-full rounded-t-sm transition-all ${
                          item.active ? 'bg-[#1A73E8]' : 'bg-[#AECBFA]'
                        }`}
                      />
                    </div>
                    <span className="text-[9px] text-[#5F6368] font-medium">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: 24/7 AI Wellness Companion Widget */}
            <div className="p-4 rounded-xl bg-white border border-[#E8EAED] shadow-2xs space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#202124]">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span>AI Reflection Assistant</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E8EAED] text-[11px] text-[#3C4043] leading-relaxed">
                  "You have back-to-back classes this afternoon. Take 5 minutes after chemistry to hydrate and reset."
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#5F6368] pt-1">
                <span>Zero identity logging</span>
                <span className="text-[#1A73E8] font-bold">Reply in chat →</span>
              </div>
            </div>

          </div>

          {/* Quick Action Pill Bar */}
          <div className="p-3 bg-white rounded-xl border border-[#E8EAED] flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center">
                <Wind className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-[#202124]">Quick Protocol:</span>
              <span className="text-[#5F6368] hidden sm:inline">4-7-8 Somatic Breathing</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-slate-400">1 MIN</span>
              <button
                type="button"
                className="px-3 py-1 rounded-md bg-[#1A73E8] text-white font-bold text-[11px] shadow-2xs cursor-pointer hover:bg-[#1557B0]"
              >
                Start Session
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default YouthAppMockup;
