import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
} from 'lucide-react';
import '../styles/cinematic-hero.css';

interface HangingCardData {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  rotate: number;
  yOffset: number;
  link: string;
}

const HANGING_CARDS: HangingCardData[] = [
  {
    id: 'mood',
    title: 'Mood Radar',
    subtitle: 'Track daily resilience patterns',
    imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=600&auto=format&fit=crop&q=80',
    rotate: -11,
    yOffset: 12,
    link: '/assessment',
  },
  {
    id: 'somatic',
    title: 'Somatic Reset',
    subtitle: '4-7-8 nervous de-escalation',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    rotate: -5,
    yOffset: 48,
    link: '/games',
  },
  {
    id: 'ai',
    title: 'AI Sanctuary',
    subtitle: '24/7 confidential reflection',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    rotate: 0,
    yOffset: 72,
    link: '/ai-assistant',
  },
  {
    id: 'community',
    title: 'Peer Circles',
    subtitle: 'Safe anonymous campus talk',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    rotate: 5,
    yOffset: 48,
    link: '/community',
  },
  {
    id: 'focus',
    title: 'Focus Orbit',
    subtitle: 'Study rhythms & flow state',
    imageUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&auto=format&fit=crop&q=80',
    rotate: 11,
    yOffset: 12,
    link: '/games',
  },
];

export const ScrollLockedYouthHero: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="overview" className="relative w-full bg-[#FAFAF8] overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 select-none">
      {/* Soft warm ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 200, 83, 0.07) 0%, rgba(254, 240, 138, 0.05) 50%, transparent 80%)'
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
        
        {/* ============================================================ */}
        {/* 1. TOP BADGE PILL                                            */}
        {/* ============================================================ */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-xs font-semibold text-[#202124]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>#1 Wellbeing Platform for Students</span>
        </motion.div>

        {/* ============================================================ */}
        {/* 2. BOLD CONDENSED CENTERED HEADLINE                         */}
        {/* ============================================================ */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="space-y-4 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-black text-[#111827] tracking-tight leading-[0.98] uppercase">
            Safe Space For <span className="text-[#00C853]">Students</span> To <br className="hidden sm:inline" />
            Learn And Grow
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#4B5563] font-normal max-w-2xl mx-auto leading-relaxed pt-1">
            With Built-In Somatic Resets, Confidential 24/7 AI, and Peer Circles
          </p>
        </motion.div>

        {/* ============================================================ */}
        {/* 3. CENTERED GREEN ACTION CTA BUTTON                          */}
        {/* ============================================================ */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="pt-1"
        >
          <Link to="/login">
            <button
              type="button"
              className="astro-btn-green min-h-[52px] px-9 py-3.5 rounded-full font-bold text-base tracking-wide shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Sanctuary</span>
            </button>
          </Link>
        </motion.div>

        {/* ============================================================ */}
        {/* 4. CURVED CLOTHESLINE WITH HANGING ANIMATION CARDS           */}
        {/* ============================================================ */}
        <div className="relative pt-12 pb-10 max-w-6xl mx-auto overflow-visible">
          
          {/* Curved SVG Clothesline Cable */}
          <div className="absolute top-[52px] left-0 right-0 w-full pointer-events-none z-10">
            <svg
              viewBox="0 0 1200 120"
              className="w-full h-24 text-slate-300"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 0,25 Q 600,105 1200,25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Hanging Cards Grid / Arc */}
          <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 pt-4 items-start justify-center">
            {HANGING_CARDS.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                animate={{
                  opacity: 1,
                  y: [card.yOffset, card.yOffset - 6, card.yOffset],
                  rotate: [card.rotate, card.rotate + (idx % 2 === 0 ? 0.8 : -0.8), card.rotate],
                }}
                transition={{
                  duration: 4 + (idx * 0.5),
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                  delay: idx * 0.1,
                }}
                style={{
                  transform: `translateY(${card.yOffset}px) rotate(${card.rotate}deg)`,
                }}
                className="hanging-polaroid-card relative p-2.5 sm:p-3 bg-white border border-slate-100/90 text-left group"
              >
                {/* Emerald Clothespin Clip */}
                <div className="hanging-clip" />

                {/* Card Thumbnail Image */}
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Card Text Content */}
                <div className="pt-3 pb-1 px-1">
                  <h3 className="text-sm font-black text-[#111827] tracking-tight group-hover:text-[#00C853] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-[#6B7280] font-normal leading-tight mt-0.5">
                    {card.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* ============================================================ */}
        {/* 5. TRUST LOGOS STRIP (Like ASTRO reference)                  */}
        {/* ============================================================ */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-10 border-t border-slate-200/60 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all text-xs font-bold text-slate-500 tracking-wider uppercase"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            WHO-5 Validated
          </span>
          <span>·</span>
          <span>Tele-MANAS (14416)</span>
          <span>·</span>
          <span>Harvard Wellbeing Lab</span>
          <span>·</span>
          <span>Client-Side Private</span>
        </motion.div>

      </div>
    </section>
  );
};

export default ScrollLockedYouthHero;



