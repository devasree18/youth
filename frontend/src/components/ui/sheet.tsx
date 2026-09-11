import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { transitionNormal } from '../../lib/motion';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export const Sheet = ({
  isOpen,
  onClose,
  title,
  description,
  side = 'right',
  children,
}: SheetProps) => {
  React.useEffect(() => {
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
    };
  }, [isOpen, onClose]);

  const slideVariants = {
    initial: {
      x: side === 'right' ? '100%' : side === 'left' ? '-100%' : 0,
      y: side === 'bottom' ? '100%' : side === 'top' ? '-100%' : 0,
    },
    animate: { x: 0, y: 0, transition: transitionNormal },
    exit: {
      x: side === 'right' ? '100%' : side === 'left' ? '-100%' : 0,
      y: side === 'bottom' ? '100%' : side === 'top' ? '-100%' : 0,
      transition: { duration: 0.15 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Sheet Content */}
          <motion.div
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'relative z-50 flex flex-col bg-white p-6 shadow-xl',
              {
                'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-slate-200 ml-auto':
                  side === 'right',
                'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-slate-200 mr-auto':
                  side === 'left',
                'inset-x-0 top-0 w-full border-b border-slate-200 mb-auto':
                  side === 'top',
                'inset-x-0 bottom-0 w-full border-t border-slate-200 mt-auto':
                  side === 'bottom',
              }
            )}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
                {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
