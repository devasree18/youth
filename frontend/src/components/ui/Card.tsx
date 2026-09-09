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
          'bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden transition-all duration-200',
          {
            'hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300': hoverable,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

