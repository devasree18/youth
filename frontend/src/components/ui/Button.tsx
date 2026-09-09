import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          {
            'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 focus:ring-blue-500': variant === 'primary',
            'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm focus:ring-slate-400': variant === 'secondary',
            'border border-blue-200 bg-transparent hover:bg-blue-50 text-blue-700 focus:ring-blue-500': variant === 'outline',
            'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-400': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20 focus:ring-red-500': variant === 'danger',
            'h-9 px-3.5 text-xs': size === 'sm',
            'h-11 px-5 text-sm': size === 'md',
            'h-13 px-7 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

