'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';

interface ThemeToggleProps {
  className?: string;
  size?: 'default' | 'sm';
}

const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, size = 'sm' }, ref) => {
    const { resolvedTheme, setTheme } = useTheme();

    const btnSize = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
    const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
        aria-label={resolvedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        className={cn(
          'flex items-center justify-center rounded-lg text-[#74786F] hover:bg-[#F0EFEA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#373A36]',
          btnSize,
          className,
        )}
      >
        {resolvedTheme === 'light' ? (
          <Moon className={iconSize} />
        ) : (
          <Sun className={iconSize} />
        )}
      </button>
    );
  },
);

ThemeToggle.displayName = 'ThemeToggle';

export { ThemeToggle, type ThemeToggleProps };
