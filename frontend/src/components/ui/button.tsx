import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-[#111827] text-white shadow-xs hover:bg-black active:bg-black font-semibold',
        primary: 'bg-[#00C853] text-white shadow-xs hover:bg-[#00B048] active:bg-[#00963E] font-semibold',
        destructive: 'bg-rose-600 text-white shadow-xs hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-600 font-semibold',
        danger: 'bg-rose-600 text-white shadow-xs hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-600 font-semibold',
        outline: 'border border-slate-200 bg-white text-slate-800 shadow-xs hover:bg-slate-50 hover:border-slate-300 hover:text-black font-medium',
        secondary: 'bg-slate-100 text-slate-800 shadow-xs hover:bg-slate-200/80 active:bg-slate-200 font-medium',
        ghost: 'text-slate-700 hover:bg-slate-100 hover:text-black',
        link: 'text-emerald-600 underline-offset-4 hover:underline font-medium',
      },
      size: {
        default: 'min-h-[44px] h-11 px-4 py-2.5 text-sm',
        sm: 'h-9 min-h-[36px] rounded-lg px-3 text-xs gap-1.5',
        md: 'min-h-[44px] h-11 px-4 py-2.5 text-sm',
        lg: 'min-h-[48px] h-12 rounded-xl px-6 text-base gap-2.5',
        icon: 'min-h-[44px] h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
