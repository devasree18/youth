import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface MoodOption {
  value: 'very_low' | 'low' | 'okay' | 'good' | 'great';
  label: string;
  sublabel: string;
  toneColor: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    value: 'very_low',
    label: 'Very Low',
    sublabel: 'Exhausted / Stressed',
    toneColor: 'bg-rose-400',
    activeBg: 'bg-rose-50',
    activeBorder: 'border-rose-400',
    activeText: 'text-rose-950',
  },
  {
    value: 'low',
    label: 'Low',
    sublabel: 'Uneasy / Low Energy',
    toneColor: 'bg-amber-400',
    activeBg: 'bg-amber-50',
    activeBorder: 'border-amber-400',
    activeText: 'text-amber-950',
  },
  {
    value: 'okay',
    label: 'Okay',
    sublabel: 'Neutral / Steady',
    toneColor: 'bg-stone-400',
    activeBg: 'bg-stone-100',
    activeBorder: 'border-stone-400',
    activeText: 'text-stone-900',
  },
  {
    value: 'good',
    label: 'Good',
    sublabel: 'Clear / Capable',
    toneColor: 'bg-teal-400',
    activeBg: 'bg-teal-50',
    activeBorder: 'border-teal-400',
    activeText: 'text-teal-950',
  },
  {
    value: 'great',
    label: 'Great',
    sublabel: 'Energized / Balanced',
    toneColor: 'bg-emerald-500',
    activeBg: 'bg-emerald-50',
    activeBorder: 'border-emerald-500',
    activeText: 'text-emerald-950',
  },
];

interface HorizontalMoodScaleProps {
  currentMood?: string | null;
  onSelectMood: (moodValue: string) => Promise<void> | void;
}

export const HorizontalMoodScale: React.FC<HorizontalMoodScaleProps> = ({
  currentMood,
  onSelectMood,
}) => {
  const [selected, setSelected] = useState<string | null>(currentMood || null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelect = async (val: string) => {
    setSelected(val);
    setIsSaving(true);
    try {
      await onSelectMood(val);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2400);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          How are you feeling right now?
        </h3>
        <span className="text-[11px] text-stone-400 font-normal">
          {selected ? 'Logged for today' : 'Select one'}
        </span>
      </div>

      {/* Horizontal Emotional Scale */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {MOOD_OPTIONS.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              disabled={isSaving}
              className={`group relative p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                isSelected
                  ? `${option.activeBg} ${option.activeBorder} ${option.activeText} shadow-2xs ring-1 ring-emerald-500/20`
                  : 'bg-white border-stone-200/90 hover:border-stone-300 hover:bg-stone-50/60 text-stone-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125 ${
                    option.toneColor
                  } ${isSelected ? 'ring-2 ring-white shadow-xs' : ''}`}
                />
                {isSelected && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-white/90 px-1.5 py-0.2 rounded-md shadow-2xs flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" /> Logged
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold leading-snug">{option.label}</p>
              <p className="text-[10px] text-stone-400 font-normal mt-0.5 truncate">
                {option.sublabel}
              </p>
            </button>
          );
        })}
      </div>

      {/* Subtle confirmation text */}
      <AnimatePresence>
        {savedSuccess && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[11px] text-emerald-700 font-medium pt-0.5"
          >
            ✓ Mood recorded to your wellbeing timeline.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
