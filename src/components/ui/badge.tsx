import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'teal' | 'amber' | 'coral' | 'neutral' | 'outline' | 'success' | 'warning' | 'danger';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-primary/10 text-primary',
    teal: 'bg-secondary/15 text-secondary',
    success: 'bg-secondary/15 text-secondary',
    amber: 'bg-tertiary-fixed/40 text-tertiary-dark',
    warning: 'bg-tertiary-fixed/40 text-tertiary-dark',
    coral: 'bg-error-container/60 text-error',
    danger: 'bg-error-container/60 text-error',
    neutral: 'bg-surface-container text-on-surface-variant',
    outline: 'border border-outline-subtle text-on-surface-variant',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
