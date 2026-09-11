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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-100 bg-[#f8fafc]">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainerVariants}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div variants={fadeUpVariants} className="inline-flex items-center space-x-2 mb-6">
            <Badge variant="primary" dot size="md">
              Enterprise Mental Health Platform
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUpVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] max-w-4xl mx-auto"
          >
            Proactive mental health infrastructure for students and campuses.
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            A comprehensive, privacy-first wellbeing system combining daily check-ins, safe AI guidance, licensed counselors, and institutional intelligence.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/login">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get started for free
              </Button>
            </Link>
            <Link to="/institution">
              <Button variant="secondary" size="lg">
                Explore campus portal
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {METRICS.map((m, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{m.value}</div>
                <div className="text-xs font-semibold text-slate-700">{m.label}</div>
                <div className="text-[11px] text-slate-400">{m.sub}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Integrated Wellbeing Ecosystem
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Designed for every layer of campus care.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            From early self-assessment to licensed clinical interventions, all tools work seamlessly together.
          </p>
        </div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div key={idx} variants={fadeUpVariants}>
                <Card hoverable className="flex flex-col justify-between p-6 h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="neutral" size="sm">{feature.tag}</Badge>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <Link
                      to={feature.link}
                      className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 space-x-1"
                    >
                      <span>Learn more</span>
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
      <section className="py-16 bg-[#f8fafc] border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              Methodology
            </h2>
            <p className="text-2xl font-bold text-slate-900">How YOUTH drives student resilience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-7 h-7 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="text-sm font-semibold text-slate-900">Continuous Assessment</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Log quick mood check-ins and evidence-based self-evaluations to detect early signs of academic fatigue.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-7 h-7 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="text-sm font-semibold text-slate-900">Automated Triage</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive targeted self-help exercises, audio breathing modules, or 24/7 AI coping strategies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-7 h-7 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="text-sm font-semibold text-slate-900">Clinical Escalation</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct access to book campus therapists, with urgent crisis hotline routing for immediate emergency safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance Banner */}
      <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Enterprise Security & Strict Privacy</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                All community interactions are pseudonymous. Institution data is aggregated and automatically suppressed when cohort counts are under 5 students to prevent re-identification.
              </p>
            </div>
          </div>
          <Link to="/login" className="shrink-0">
            <Button variant="secondary" size="md">
              Review Security Policy
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              Y
            </div>
            <span className="text-xs font-semibold text-slate-700">
              © {new Date().getFullYear()} YOUTH Technologies Inc. All rights reserved.
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-500">
            <Link to="/resources" className="hover:text-slate-900 transition-colors">Resources</Link>
            <Link to="/crisis" className="hover:text-rose-600 text-rose-700 font-medium transition-colors">Crisis Hotlines</Link>
            <Link to="/institution" className="hover:text-slate-900 transition-colors">Campus Portal</Link>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
