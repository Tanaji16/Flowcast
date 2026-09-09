import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'teal' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';
    
    const variants = {
      primary: 'bg-primary-container text-white hover:bg-coral-hover hover:-translate-y-0.5 active:translate-y-0 active:opacity-95 shadow-md shadow-primary-container/25 focus:ring-primary-container rounded-full',
      secondary: 'bg-white border border-outline-subtle text-on-surface hover:bg-surface-container-low hover:border-outline/40 active:bg-surface-container shadow-sm focus:ring-secondary rounded-full',
      teal: 'bg-secondary text-white hover:bg-[#0c8277] hover:-translate-y-0.5 active:translate-y-0 active:opacity-95 shadow-md shadow-secondary/25 focus:ring-secondary rounded-full',
      outline: 'border border-outline-subtle bg-transparent text-on-surface hover:bg-surface-container-low focus:ring-secondary rounded-xl',
      danger: 'bg-error text-white hover:bg-[#a31515] active:bg-[#8f1212] shadow-sm focus:ring-error rounded-full',
      ghost: 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container focus:ring-secondary rounded-xl',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3.5 text-base gap-2.5',
      icon: 'h-9 w-9 p-0 rounded-full',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
