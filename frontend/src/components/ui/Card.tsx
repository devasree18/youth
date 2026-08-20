import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden',
          {
            'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg': hoverable,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';
