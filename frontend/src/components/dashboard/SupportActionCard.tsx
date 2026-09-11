import React from 'react';
import { motion } from 'framer-motion';
import { Bot, UserCheck, ArrowRight, LifeBuoy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SupportActionCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Support</h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Safe, confidential spaces whenever you need a listening ear
          </p>
        </div>
      </div>

      {/* Two Calm Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Talk with AI Support */}
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/ai-assistant')}
          className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 text-left transition-all cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-950">
                Talk with AI Support
              </div>
              <div className="text-xs text-slate-500 font-normal">
                Private, instant reflections & guidance
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </motion.button>

        {/* Find a counselor */}
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/counselors')}
          className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-200 text-left transition-all cursor-pointer"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-950">
                Find a counselor
              </div>
              <div className="text-xs text-slate-500 font-normal">
                Connect with verified campus experts
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </motion.button>
      </div>

      {/* Discreet Urgent Help Link */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <LifeBuoy className="w-3.5 h-3.5 text-slate-400" />
          <span>In immediate crisis or feeling unsafe?</span>
        </span>
        <button
          onClick={() => navigate('/crisis')}
          className="text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
        >
          Need urgent help?
        </button>
      </div>
    </section>
  );
};
