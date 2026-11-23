'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';

interface ThemeToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: 'default' | 'sm';
}

const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, size = 'default', ...props }, ref) => {
    const { resolvedTheme, toggleTheme } = useTheme();

    const isDark = resolvedTheme === 'dark';

    const trackSize = size === 'sm' ? 'w-10 h-5' : 'w-12 h-6';
    const thumbSize = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={toggleTheme}
        className={cn(
          'relative flex items-center justify-center overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          trackSize,
          isDark ? 'bg-[#27272A]' : 'bg-[#E5E5E0]',
          className
        )}
        {...props}
      >
        {/* Sun icon (visible in light mode) */}
        <div
          className={cn(
            'absolute left-1 top-1 flex items-center justify-center transition-transform duration-200 ease-in-out',
            isDark
              ? 'translate-x-[-120%] opacity-0'
              : 'translate-x-0 opacity-100'
          )}
        >
          <Sun className={cn(iconSize, 'text-[#373A36]')} />
        </div>

        {/* Moon icon (visible in dark mode) */}
        <div
          className={cn(
            'absolute right-1 top-1 flex items-center justify-center transition-transform duration-200 ease-in-out',
            isDark
              ? 'translate-x-0 opacity-100'
              : 'translate-x-[120%] opacity-0'
          )}
        >
          <Moon className={cn(iconSize, 'text-[#FAFAF8]')} />
        </div>

        {/* Sliding thumb */}
        <div
          className={cn(
            thumbSize,
            'rounded-full bg-[#FAFAF8] shadow-md transition-transform duration-200 ease-in-out',
            isDark ? 'translate-x-full -translate-x-1/2' : 'translate-x-0 -translate-x-1/2'
          )}
        />
      </button>
    );
  }
);

ThemeToggle.displayName = 'ThemeToggle';

export { ThemeToggle, type ThemeToggleProps };
