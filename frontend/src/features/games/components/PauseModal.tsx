import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, LogOut, Pause } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
  title?: string;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onExit,
  title = 'Game Paused',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Pause className="w-6 h-6 fill-current" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 mb-6">
              Take a slow breath. Whenever you are ready, you can continue or restart.
            </p>

            <div className="space-y-3">
              <Button
                type="button"
                onClick={onResume}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                Resume
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onRestart}
                className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={onExit}
                className="w-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Exit to Games
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
