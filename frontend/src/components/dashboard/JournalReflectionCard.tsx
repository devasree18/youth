import React from 'react';
import { BookMarked, ArrowRight, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JournalReflectionCardProps {
  latestEntry?: {
    id: string;
    title: string;
    content: string;
    date: string;
    moodTag?: string;
  } | null;
}

export const JournalReflectionCard: React.FC<JournalReflectionCardProps> = ({ latestEntry }) => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
          <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
          Your Reflection
        </h3>
        {latestEntry && (
          <span className="text-[11px] text-stone-400 font-normal">
            {latestEntry.date}
          </span>
        )}
      </div>

      {latestEntry ? (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
            {latestEntry.title}
          </h4>
          <p className="text-xs text-stone-600 font-normal leading-relaxed line-clamp-2">
            "{latestEntry.content}"
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-stone-100">
            {latestEntry.moodTag && (
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {latestEntry.moodTag}
              </span>
            )}
            <Link
              to="/solutions"
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors flex items-center gap-1 ml-auto"
            >
              <span>Open Journal</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          <p className="text-xs text-stone-500 font-normal leading-relaxed">
            No reflection yet today. Take 60 seconds to note down what felt heavy or rewarding.
          </p>
          <Link
            to="/solutions"
            className="inline-flex items-center text-xs font-semibold text-stone-800 hover:text-emerald-700 transition-colors gap-1.5"
          >
            <PenLine className="w-3.5 h-3.5 text-stone-400" />
            <span>Write a reflection →</span>
          </Link>
        </div>
      )}
    </div>
  );
};
