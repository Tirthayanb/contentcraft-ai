'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface BackButtonProps {
  className?: string;
}

/**
 * Reusable icon-only Back Button.
 *
 * Navigates to the previous page in history when one exists; falls back to
 * the Landing Page (`/`) when there is no prior in-app history.
 */
export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  const handleClick = React.useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Go back"
      className={cn(
        'flex items-center justify-center rounded-lg text-[#74786F] hover:bg-[#F0EFEA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#373A36]',
        'w-8 h-8',
        className,
      )}
    >
      <ArrowLeft className="w-5 h-5 fill-current stroke-none" />
    </button>
  );
}
