import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, collapsed = false, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        'flex flex-col border-r border-slate-200 bg-white transition-all duration-200 shrink-0 sticky top-0 h-screen',
        collapsed ? 'w-16' : 'w-60',
        className
      )}
      {...props}
    />
  )
);
Sidebar.displayName = 'Sidebar';

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('h-16 px-4 flex items-center justify-between border-b border-slate-100', className)}
    {...props}
  />
));
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 py-4 px-2.5 overflow-y-auto space-y-6', className)}
    {...props}
  />
));
SidebarContent.displayName = 'SidebarContent';

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-3 border-t border-slate-100 bg-slate-50/50', className)}
    {...props}
  />
));
SidebarFooter.displayName = 'SidebarFooter';
