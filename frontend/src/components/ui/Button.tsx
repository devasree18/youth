import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white shadow-xs hover:bg-blue-700 active:bg-blue-800',
        primary: 'bg-blue-600 text-white shadow-xs hover:bg-blue-700 active:bg-blue-800',
        destructive: 'bg-rose-600 text-white shadow-xs hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-600',
        danger: 'bg-rose-600 text-white shadow-xs hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-600',
        outline: 'border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100',
        secondary: 'bg-slate-100 text-slate-900 shadow-xs hover:bg-slate-200/80 active:bg-slate-200',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200',
        link: 'text-blue-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-8 rounded-md px-3 text-xs gap-1.5',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-11 rounded-lg px-6 text-base gap-2.5',
        icon: 'h-9 w-9 p-0',
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
