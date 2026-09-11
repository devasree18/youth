import React from 'react';
import { Sparkles, BookMarked, Wind, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface TimelineItem {
  id: string;
  type: 'CHECKIN' | 'JOURNAL' | 'BREATHING' | 'FOCUS' | 'GAME';
  title: string;
  subtitle: string;
  timestamp: string;
  route?: string;
}

interface ActivityTimelineProps {
  items: TimelineItem[];
  isLoading?: boolean;
}

const TYPE_ICONS: Record<string, { icon: React.FC<{ className?: string }>; color: string }> = {
  CHECKIN: { icon: Sparkles, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  JOURNAL: { icon: BookMarked, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  BREATHING: { icon: Wind, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  FOCUS: { icon: Target, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  GAME: { icon: Target, color: 'text-stone-700 bg-stone-100 border-stone-200' },
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ items, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Your Recent Activity
        </h3>
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-2xl bg-stone-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Your Recent Activity
        </h3>
        <span className="text-[11px] text-stone-400 font-normal">Real-time log</span>
      </div>

      {items.length === 0 ? (
        <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70 text-center text-xs text-stone-500 space-y-1">
          <p className="font-medium text-stone-700">No recorded activity yet today.</p>
          <p className="text-[11px] text-stone-400">
            Log a mood check-in or practice a 60s breathing reset to start your timeline.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100 rounded-3xl bg-white border border-stone-200/90 shadow-2xs overflow-hidden">
          {items.slice(0, 4).map((item) => {
            const iconConfig = TYPE_ICONS[item.type] || TYPE_ICONS.GAME;
            const Icon = iconConfig.icon;

            const content = (
              <div className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-stone-50/70 transition-colors group">
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${iconConfig.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-stone-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-stone-400 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-3 text-[11px] text-stone-400">
                  <span>{item.timestamp}</span>
                  {item.route && (
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
              </div>
            );

            return item.route ? (
              <Link key={item.id} to={item.route} className="block">
                {content}
              </Link>
            ) : (
              <div key={item.id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
};
