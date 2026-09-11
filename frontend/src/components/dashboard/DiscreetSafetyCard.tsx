import React from 'react';
import { PhoneCall, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DiscreetSafetyCard: React.FC = () => {
  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Support & Care
        </h4>
        <span className="text-[10px] text-stone-400">Human Counseling</span>
      </div>

      <p className="text-xs text-stone-600 font-normal leading-relaxed">
        You're not expected to handle everything alone. Confidential care is always accessible.
      </p>

      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Tele-MANAS */}
        <a
          href="tel:14416"
          className="p-2.5 rounded-2xl bg-stone-50 hover:bg-rose-50/70 border border-stone-200/80 hover:border-rose-200 text-stone-800 transition-colors flex items-center space-x-2 group cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-600 shrink-0" />
          <div className="truncate">
            <p className="text-[11px] font-bold leading-tight group-hover:text-rose-900 truncate">14416 Helpline</p>
            <p className="text-[9px] text-stone-400 truncate">Govt 24/7 Free</p>
          </div>
        </a>

        {/* Counselors */}
        <Link
          to="/counselors"
          className="p-2.5 rounded-2xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200/80 hover:border-emerald-200 text-stone-800 transition-colors flex items-center space-x-2 group"
        >
          <Users className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 shrink-0" />
          <div className="truncate">
            <p className="text-[11px] font-bold leading-tight group-hover:text-emerald-950 truncate">Counselors</p>
            <p className="text-[9px] text-stone-400 truncate">1-on-1 Sessions</p>
          </div>
        </Link>
      </div>
    </div>
  );
};
