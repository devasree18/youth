import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  UserCheck,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Check,
  Compass
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import type { ResourceItem } from '../../services/resourceService';

interface GuideReaderModalProps {
  guide: ResourceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectRelated?: (guide: ResourceItem) => void;
  relatedGuides?: ResourceItem[];
}

export const GuideReaderModal: React.FC<GuideReaderModalProps> = ({
  guide,
  isOpen,
  onClose,
  onSelectRelated,
  relatedGuides = [],
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      window.speechSynthesis?.cancel();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    // Reset reader states when guide changes
    setIsPlayingAudio(false);
    setCompletedSteps([]);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [guide?._id]);

  if (!guide) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${guide.title}. Category: ${guide.category}. ${guide.description}. ${guide.content || ''}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Generate structured takeaways and protocol steps based on guide content or fallback
  const takeaways = [
    'Regulate sympathetic nervous response before attempting cognitive problem-solving.',
    'Break complex stressors into distinct 15-to-25 minute actionable focus intervals.',
    'Build daily grounding anchors to buffer against compounding academic and social fatigue.',
  ];

  const protocolSteps = [
    {
      title: 'Acknowledge and Ground',
      desc: 'Pause current tasks. Place both feet firmly flat on the floor and take three diaphragmatic breaths.',
    },
    {
      title: 'Categorize the Primary Stressor',
      desc: 'Separate what is under direct control today from what is future speculation or external demand.',
    },
    {
      title: 'Execute Micro-Recovery Cycle',
      desc: 'Engage in a 5-minute somatic reset or progressive muscle release to restore baseline clarity.',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col z-10 overflow-hidden"
          >
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-100 bg-slate-50/70 backdrop-blur-xs">
              <div className="flex items-center space-x-2">
                <Badge variant="primary" size="sm">
                  {guide.category}
                </Badge>
                <span className="hidden sm:inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  <UserCheck className="w-3 h-3 mr-1 text-emerald-600" />
                  Clinical Team Verified
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Audio Listen Toggle */}
                {'speechSynthesis' in window && (
                  <button
                    onClick={handleToggleAudio}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                    title={isPlayingAudio ? 'Pause listening' : 'Listen to article'}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen (TTS)</span>
                      </>
                    )}
                  </button>
                )}

                {/* Bookmark Button */}
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                  title={isBookmarked ? 'Saved to bookmarks' : 'Bookmark guide'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all cursor-pointer relative"
                  title="Share link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer ml-1"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-7 custom-scrollbar">
              {/* Header Title & Metadata */}
              <div className="space-y-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                  {guide.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center text-slate-600 font-semibold">
                    <BookOpen className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    By {guide.author || 'YOUTH Clinical Care Team'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {guide.readTimeMinutes || 5} min read
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium bg-emerald-50/80 px-2 py-0.5 rounded-md">
                    Evidence-Based Framework
                  </span>
                </div>
              </div>

              {/* Lead Summary Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/50 border border-emerald-100/90 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                <div className="flex items-center space-x-2 font-bold text-emerald-900 text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Clinical Overview</span>
                </div>
                <p>{guide.description}</p>
              </div>

              {/* Main Article Content */}
              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-5">
                {guide.content ? (
                  <div className="whitespace-pre-line space-y-4">
                    {guide.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <>
                    <section className="space-y-2.5">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        1. Understanding the Stress Mechanics
                      </h2>
                      <p>
                        When facing intensive academic deadlines, social transitions, or performance expectations, the human nervous system often misinterprets cognitive overload as acute physical threat. This triggers elevated cortisol output, narrowing cognitive flexibility and depleting working memory.
                      </p>
                      <p>
                        By understanding that emotional overwhelm is a biological adaptation rather than a personal failure, students can systematically deploy targeted reset protocols rather than struggling against unproductive anxiety loops.
                      </p>
                    </section>

                    <section className="space-y-2.5">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        2. Science-Backed Action Protocol
                      </h2>
                      <p>
                        Follow these clinical sequence steps whenever you feel tension building or mental stamina declining:
                      </p>
                    </section>
                  </>
                )}

                {/* Interactive Practice Protocol Checklist */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Interactive Reset Protocol (Try this now)
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {protocolSteps.map((step, idx) => {
                      const isDone = completedSteps.includes(idx);
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleStep(idx)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 select-none ${
                            isDone
                              ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isDone
                                ? 'bg-emerald-600 text-white'
                                : 'border border-slate-300 bg-slate-50 text-transparent'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <div className="space-y-0.5">
                            <h4
                              className={`text-xs font-bold ${
                                isDone ? 'line-through text-slate-500' : 'text-slate-900'
                              }`}
                            >
                              Step {idx + 1}: {step.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Takeaways Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center">
                    <Compass className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Essential Takeaways
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                    {takeaways.map((t, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Crisis Support Banner */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start space-x-3">
                  <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-amber-900">
                      Need immediate human counseling or crisis guidance?
                    </h4>
                    <p className="text-[11px] text-amber-800 leading-relaxed font-normal">
                      Connect 24/7 with Government of India Tele-MANAS hotline at{' '}
                      <a href="tel:14416" className="font-bold underline text-amber-950">
                        14416
                      </a>{' '}
                      or explore verified professional counselors.
                    </p>
                  </div>
                </div>
              </div>

              {/* Related Guides Section */}
              {relatedGuides.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recommended Next Reads
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {relatedGuides.slice(0, 2).map((rel) => (
                      <div
                        key={rel._id}
                        onClick={() => onSelectRelated && onSelectRelated(rel)}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/20 transition-all cursor-pointer group"
                      >
                        <Badge variant="neutral" size="sm" className="mb-1.5">
                          {rel.category}
                        </Badge>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {rel.title}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                          <span>{rel.readTimeMinutes || 5} min</span>
                          <span className="text-emerald-600 font-semibold group-hover:underline flex items-center">
                            Read <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="px-5 sm:px-7 py-3.5 border-t border-slate-100 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-medium text-center sm:text-left">
                Empowered by YOUTH Evidence-Based Psychology Protocol
              </span>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Link to="/games" className="w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs">
                    Try Somatic Reset
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onClose}
                  className="w-full sm:w-auto text-xs"
                >
                  Done Reading
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
