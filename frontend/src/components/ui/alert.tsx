import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const alertVariants = cva(
  'relative w-full rounded-2xl border p-4 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-slate-950',
  {
    variants: {
      variant: {
        default: 'bg-white text-[#172033] border-slate-200',
        info: 'bg-indigo-50/70 border-indigo-200/80 text-indigo-950 [&>svg]:text-indigo-600',
        warning: 'bg-amber-50/70 border-amber-200/80 text-amber-950 [&>svg]:text-amber-600',
        destructive: 'bg-rose-50/70 border-rose-200/80 text-rose-950 [&>svg]:text-rose-600',
        error: 'bg-rose-50/70 border-rose-200/80 text-rose-950 [&>svg]:text-rose-600',
        success: 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950 [&>svg]:text-emerald-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  children: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, children, ...props }, ref) => {
    const icons = {
      default: Info,
      info: Info,
      warning: AlertTriangle,
      destructive: AlertCircle,
      error: AlertCircle,
      success: CheckCircle2,
    };

    const Icon = icons[variant || 'default'];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <div className="space-y-0.5">
          {title && <h5 className="font-semibold tracking-tight">{title}</h5>}
          <div className="text-xs leading-relaxed opacity-90">{children}</div>
        </div>
      </div>
    );
  }
);
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-xs leading-relaxed [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';
