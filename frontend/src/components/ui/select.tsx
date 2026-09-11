import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, id, disabled, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const element = (
      <div className="relative w-full">
        <select
          id={selectId}
          ref={ref}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2 pr-9 text-sm text-slate-900 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50 cursor-pointer',
            error && 'border-rose-400 focus-visible:ring-rose-600',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>
    );

    if (!label && !helperText && !error) {
      return element;
    }

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700 tracking-tight"
          >
            {label}
          </label>
        )}
        {element}
        {error ? (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Select.displayName = 'Select';
