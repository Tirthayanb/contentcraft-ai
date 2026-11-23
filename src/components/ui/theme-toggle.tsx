'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';

interface ThemeToggleProps {
  className?: string;
  size?: 'default' | 'sm';
}

const ThemeToggle = React.forwardRef<HTMLDivElement, ThemeToggleProps>(
  ({ className, size = 'sm', ...props }, ref) => {
    const { resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const btnSize = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
    const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Theme mode"
        className={cn(
          'inline-flex items-center gap-1 rounded-lg border border-transparent bg-[#FAFAF8] p-1 shadow-sm',
          className
        )}
        {...props}
      >
        {/* Light Mode — Sun */}
        <button
          type="button"
          aria-pressed={!isDark}
          aria-label="Switch to light mode"
          onClick={() => setTheme('light')}
          className={cn(
            btnSize,
            'rounded-md flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#373A36]/30 disabled:pointer-events-none disabled:opacity-50',
            !isDark
              ? 'bg-[#27272A] text-[#FAFAF8] shadow-sm'
              : 'text-[#9CA3AF] hover:bg-[#F4F4F2] hover:text-[#373A36]'
          )}
        >
          <Sun className={cn(iconSize, 'fill-current stroke-none')} />
        </button>

        {/* Dark Mode — Moon */}
        <button
          type="button"
          aria-pressed={isDark}
          aria-label="Switch to dark mode"
          onClick={() => setTheme('dark')}
          className={cn(
            btnSize,
            'rounded-md flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#373A36]/30 disabled:pointer-events-none disabled:opacity-50',
            isDark
              ? 'bg-[#27272A] text-[#FAFAF8] shadow-sm'
              : 'text-[#9CA3AF] hover:bg-[#F4F4F2] hover:text-[#373A36]'
          )}
        >
          <Moon className={cn(iconSize, 'fill-current stroke-none')} />
        </button>
      </div>
    );
  }
);

ThemeToggle.displayName = 'ThemeToggle';

export { ThemeToggle, type ThemeToggleProps };

