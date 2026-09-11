import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Wind,
  ShieldCheck,
  Brain,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CinematicNavbar } from '../features/landing/components/CinematicNavbar';
import { ScrollLockedYouthHero } from '../features/landing/components/ScrollLockedYouthHero';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111827] flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Floating 3-Island Navigation Header */}
      <CinematicNavbar />

      {/* 2. ASTRO-Style Curved Clothesline Hanging Animation Cards Hero */}
      <ScrollLockedYouthHero />

      {/* ============================================================== */}
      {/* SECTION 1: ATTRACTIVE INTERACTIVE BENTO SHOWCASE               */}
      {/* ============================================================== */}
      <section id="features" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wide border border-emerald-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Core Wellbeing Sanctuary</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight uppercase">
            Everything You Need To <br className="hidden sm:inline" />
            <span className="text-[#00C853]">Feel Grounded</span> Every Day
          </h2>
          <p className="text-base sm:text-lg text-[#4B5563] max-w-xl mx-auto leading-relaxed">
            Clinical protocols and empathetic tools designed to fit effortlessly between lectures and campus life.
          </p>
        </div>

        {/* Rich 2-Card Hero Feature Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: 24/7 AI Reflection Partner (Span 7) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-2xs">
                  <Brain className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  24/7 Confidential AI
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#111827]">Empathetic AI Companion</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed max-w-lg">
                Judgment-free space to untangle exam anxiety, relationship stress, and self-doubt. Powered by active crisis routing and evidence-based CBT frameworks.
              </p>

              {/* Chat Bubble Preview */}
              <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-slate-200/80 text-xs text-[#374151] space-y-2 mt-2">
                <div className="flex items-center gap-2 text-[11px] font-bold text-purple-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Wellness Partner</span>
                </div>
                <p className="leading-relaxed">
                  "Take three slow breaths. Your workload is heavy today, but let's break it down into manageable 25-minute focus intervals."
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">100% private · Zero identity logs</span>
              <Link
                to="/ai-assistant"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00C853] hover:text-[#00a844] group-hover:translate-x-1 transition-all"
              >
                <span>Try AI Sanctuary</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: 4-7-8 Somatic Nervous Reset (Span 5) */}
          <div className="md:col-span-5 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white rounded-3xl p-8 border border-emerald-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00C853] flex items-center justify-center border border-emerald-100 shadow-2xs">
                  <Wind className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                  Instant Reset
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#111827]">4-7-8 Somatic Breathing</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Scientifically proven rhythm to regulate heart-rate variability and down-shift sympathetic adrenaline in under 60 seconds.
              </p>

              {/* Animated Mini Pulse Meter */}
              <div className="py-4 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100/90 border-2 border-emerald-500/50 flex flex-col items-center justify-center animate-pulse text-center">
                  <Wind className="w-5 h-5 text-emerald-600 mb-0.5" />
                  <span className="text-[10px] font-bold text-emerald-900">Breathe</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-100/80 flex items-center justify-between">
              <span className="text-xs text-emerald-700 font-medium">Under 60 seconds</span>
              <Link
                to="/games"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
              >
                <span>Launch Reset</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 2: ATTRACTIVE CTA SANCTUARY BANNER                     */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#111827] text-white rounded-3xl p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow inside dark banner */}
          <div
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="space-y-3 max-w-xl text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Privacy</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
              Begin your calm sanctuary today.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              No ads, no data monetization, no mandatory university tracking. Just a safe space for your mind to rest and recalibrate.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link to="/login" className="block w-full sm:w-auto">
              <button
                type="button"
                className="astro-btn-green w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-full font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Your Check-In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Sleek Clean Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;

