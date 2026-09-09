import React from 'react';
import { cn } from '@/lib/utils';

export interface StatusPillProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'safe' | 'notice' | 'alert' | 'neutral';
  label: string;
  pulse?: boolean;
}

export function StatusPill({ status, label, pulse = true, className, ...props }: StatusPillProps) {
  const styles = {
    safe: {
      container: 'bg-secondary/10 text-secondary border-secondary/20',
      dot: 'bg-secondary',
    },
    notice: {
      container: 'bg-tertiary/15 text-tertiary-dark border-tertiary/30',
      dot: 'bg-tertiary',
    },
    alert: {
      container: 'bg-primary-container/15 text-primary border-primary-container/30',
      dot: 'bg-primary-container',
    },
    neutral: {
      container: 'bg-surface-container text-on-surface-variant border-outline-subtle',
      dot: 'bg-outline',
    },
  };

  const current = styles[status] || styles.neutral;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold select-none shadow-2xs',
        current.container,
        className
      )}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              current.dot
            )}
          />
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', current.dot)} />
      </span>
      <span>{label}</span>
    </div>
  );
}
