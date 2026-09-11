import React from 'react';
import { MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AiSupportPrompt: React.FC = () => {
  return (
    <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
          Need A Moment?
        </span>
        <span className="inline-flex items-center text-[10px] text-stone-400 font-medium">
          <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
          Private
        </span>
      </div>

      <p className="text-xs text-stone-700 leading-relaxed font-normal">
        Talk through what's on your mind. Practice guided reflection, sleep calming techniques, or study stress reframing.
      </p>

      <div className="pt-1 flex items-center justify-between">
        <span className="text-[11px] text-stone-400">24/7 Available</span>
        <Link
          to="/ai-assistant"
          className="text-xs font-semibold text-stone-900 hover:text-emerald-700 transition-colors flex items-center gap-1 group"
        >
          <span>Open Support</span>
          <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
};
