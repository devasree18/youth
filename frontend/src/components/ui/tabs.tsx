import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'pills' | 'underline';
}

export const Tabs = ({
  items,
  activeTab,
  onChange,
  className,
  variant = 'pills',
}: TabsProps) => {
  if (variant === 'underline') {
    return (
      <div className={cn('flex items-center space-x-6 border-b border-slate-200', className)}>
        {items.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center space-x-2 py-3 text-xs font-semibold border-b-2 -mb-px transition-colors duration-150 cursor-pointer',
              isActive
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            )}
          >
            {tab.icon && <span className="w-3.5 h-3.5 shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                  isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

return (
  <div
    className={cn(
      'inline-flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/60',
      className
    )}
  >
    {items.map((tab) => {
      const isActive = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer',
            isActive
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          )}
        >
          {tab.icon && <span className="w-3.5 h-3.5 shrink-0">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200 text-slate-600'
              )}
            >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
