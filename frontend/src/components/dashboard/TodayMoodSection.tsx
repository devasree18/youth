import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import type { MoodEntry } from '../../services/moodService';

interface TodayMoodSectionProps {
  todayMood: MoodEntry | null;
  onSelectMood: (moodValue: 'very_low' | 'low' | 'okay' | 'good' | 'great') => Promise<void>;
}

const MOODS: Array<{
  value: 'very_low' | 'low' | 'okay' | 'good' | 'great';
  label: string;
  emoji: string;
}> = [
  { value: 'very_low', label: 'Very low', emoji: '😔' },
  { value: 'low', label: 'Low', emoji: '😟' },
  { value: 'okay', label: 'Okay', emoji: '😐' },
  { value: 'good', label: 'Good', emoji: '🙂' },
  { value: 'great', label: 'Great', emoji: '😄' },
];

export const TodayMoodSection: React.FC<TodayMoodSectionProps> = ({
  todayMood,
  onSelectMood,
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(todayMood?.mood || null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Sync state if prop changes
  React.useEffect(() => {
    if (todayMood?.mood) {
      setSelectedMood(todayMood.mood);
    }
  }, [todayMood]);

  const handleSelect = async (val: 'very_low' | 'low' | 'okay' | 'good' | 'great') => {
    setSelectedMood(val);
    setIsSaving(true);
    try {
      await onSelectMood(val);
      setShowSavedFeedback(true);
      setIsEditing(false);
      setTimeout(() => setShowSavedFeedback(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const activeMoodInfo = MOODS.find((m) => m.value === (todayMood?.mood || selectedMood));

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            How are you feeling today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            A quick check-in helps you notice your week.
          </p>
        </div>

        {todayMood && !isEditing && (
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-semibold text-slate-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span>Today:</span>
              <span className="font-bold text-indigo-950 capitalize">{activeMoodInfo?.label || todayMood.mood}</span>
              <span>{activeMoodInfo?.emoji}</span>
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline cursor-pointer px-1 py-0.5"
            >
              Update
            </button>
          </div>
        )}
      </div>

      {/* 5 Large Selectable Mood Icons */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {MOODS.map((item) => {
          const isSelected = (selectedMood === item.value) || (todayMood?.mood === item.value && !isEditing);
          return (
            <motion.button
              key={item.value}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelect(item.value)}
              disabled={isSaving}
              className={`flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl border transition-all duration-150 cursor-pointer min-h-[82px] sm:min-h-[104px] ${
                isSelected
                  ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 ring-2 ring-indigo-400/30 shadow-xs font-bold'
                  : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300 text-slate-700 font-medium'
              }`}
            >
              <span className="text-2xl sm:text-4xl mb-1.5 sm:mb-2 select-none transform transition-transform group-hover:scale-110">
                {item.emoji}
              </span>
              <span className="text-[11px] sm:text-xs tracking-tight text-center leading-tight">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Subtle Success Indicator */}
      <AnimatePresence>
        {showSavedFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center space-x-1.5 text-xs text-indigo-700 font-semibold pt-1"
          >
            <Check className="w-4 h-4 text-indigo-600" />
            <span>Check-in recorded for today.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
