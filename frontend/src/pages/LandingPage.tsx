import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Activity, 
  BookOpen, 
  Building2, 
  Users, 
  ArrowRight,
  Lock,
  HeartHandshake
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { fadeUpVariants, staggerContainerVariants } from '../lib/motion';

const FEATURES = [
  {
    icon: Activity,
    title: 'Dynamic Wellbeing Index',
    desc: 'Track daily moods, emotional patterns, and resilience metrics calculated through validated clinical frameworks.',
    link: '/assessment',
    tag: 'Clinical'
  },
  {
    icon: MessageSquare,
    title: '24/7 AI Wellness Companion',
    desc: 'Empathetic, confidential conversational support equipped with real-time crisis detection and hotline routing.',
    link: '/ai-assistant',
    tag: 'Safe AI'
  },
  {
    icon: HeartHandshake,
    title: 'Licensed Counselor Network',
    desc: 'Book private, 1-on-1 virtual sessions with vetted campus therapists and mental health professionals.',
    link: '/counselors',
    tag: 'Verified'
  },
  {
    icon: BookOpen,
    title: 'Evidence-Based Resource Hub',
    desc: 'Practical study stress protocols, sleep hygiene guides, and interactive audio meditations designed for students.',
    link: '/resources',
    tag: 'Curated'
  },
  {
    icon: Users,
    title: 'Pseudonymous Community',
    desc: 'Safely share peer experiences, academic advice, and encouragement without revealing your identity.',
    link: '/community',
    tag: 'Privacy-First'
  },
  {
    icon: Building2,
    title: 'Campus Enterprise Portal',
    desc: 'Aggregated, anonymous wellbeing intelligence and risk tracking for university administrators and deans.',
    link: '/institution',
    tag: 'B2B SaaS'
  }
];

const METRICS = [
  { value: '100%', label: 'Confidential & Private', sub: 'Client-side pseudonymity' },
  { value: '24/7', label: 'Crisis Guardrails', sub: 'Tele-MANAS & KIRAN integration' },
  { value: '< 2 min', label: 'Daily Wellbeing Check-in', sub: 'Frictionless routine tracking' },
  { value: '98%', label: 'Student Satisfaction', sub: 'Evidence-based guidance' }
];

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-[#172033] flex flex-col antialiased">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-100 bg-[#F8FAFC]">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainerVariants}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div variants={fadeUpVariants} className="inline-flex items-center space-x-2 mb-6">
            <Badge variant="primary" dot size="md">
              Student Wellbeing Infrastructure
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUpVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#172033] tracking-tight leading-[1.12] max-w-4xl mx-auto"
          >
            Proactive mental health and emotional care for campus life.
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            A calm, safe, and confidential ecosystem for university students. Check in daily, access self-care tools, chat with a private AI companion, or connect with licensed counselors.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto shadow-md">
                <span>Start Your Check-in</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/resources" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Explore Resources
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust & Metric Highlights */}
      <section className="border-b border-slate-200/80 bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {METRICS.map((metric) => (
              <div key={metric.label} className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/60">
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
                  {metric.value}
                </p>
                <p className="text-xs font-bold text-[#172033] mt-1">{metric.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{metric.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Platform Modules */}
      <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            Integrated Wellbeing Suite
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            Comprehensive tools designed for every student need
          </p>
          <p className="text-sm text-slate-500 mt-2 font-normal">
            Whether you want a quick 1-minute reflection or professional therapeutic guidance, YOUTH provides a calm, pressure-free environment.
          </p>
        </div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div key={feat.title} variants={fadeUpVariants}>
                <Card hoverable className="h-full flex flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="neutral" size="sm">{feat.tag}</Badge>
                    </div>
                    <h3 className="text-base font-bold text-[#172033] mb-1.5">{feat.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">{feat.desc}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={feat.link}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center space-x-1"
                    >
                      <span>Explore feature</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* How it works workflow */}
      <section id="how-it-works" className="py-16 bg-[#F8FAFC] border-y border-slate-200/80 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Methodology
            </h2>
            <p className="text-2xl font-bold text-[#172033]">How YOUTH supports student emotional health</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                1
              </div>
              <h4 className="text-sm font-bold text-[#172033]">Daily Check-in</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Log quick mood check-ins and self-evaluations to detect early signs of academic pressure and fatigue.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                2
              </div>
              <h4 className="text-sm font-bold text-[#172033]">Personalized Toolkit</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Receive targeted somatic exercises, audio breathing modules, or 24/7 confidential AI reflection.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                3
              </div>
              <h4 className="text-sm font-bold text-[#172033]">Specialist Care</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Connect directly with certified campus therapists, with urgent crisis routing for immediate 24/7 support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance Banner */}
      <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-start space-x-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172033]">Private by Design & Strictly Confidential</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed font-normal">
                All community discussions are pseudonymous. Institutional analytics are strictly aggregated and never reveal individual student identities.
              </p>
            </div>
          </div>
          <Link to="/login" className="shrink-0 w-full md:w-auto">
            <Button variant="secondary" size="default" className="w-full md:w-auto">
              Access YOUTH Portal
            </Button>
          </Link>
        </div>
      </section>

      {/* Dedicated Public Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
