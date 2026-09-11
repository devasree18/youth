import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-blue-600 text-white shadow-xs',
        primary: 'bg-blue-50 text-blue-700 border-blue-200',
        secondary: 'border-transparent bg-slate-100 text-slate-900',
        destructive: 'border-transparent bg-rose-600 text-white shadow-xs',
        danger: 'bg-rose-50 text-rose-700 border-rose-200',
        outline: 'text-slate-950 border-slate-200',
        neutral: 'bg-slate-50 text-slate-700 border-slate-200',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        warning: 'bg-amber-50 text-amber-800 border-amber-200',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.2 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, size, dot = false, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full mr-1.5 shrink-0', {
            'bg-slate-400': variant === 'neutral' || variant === 'secondary' || variant === 'outline',
            'bg-blue-600': variant === 'default' || variant === 'primary',
            'bg-emerald-500': variant === 'success',
            'bg-amber-500': variant === 'warning',
            'bg-rose-500': variant === 'destructive' || variant === 'danger',
          })}
        />
      )}
      {children}
    </div>
  );
}
