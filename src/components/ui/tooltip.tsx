"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  side?: "top" | "bottom";
  align?: "center" | "start" | "end";
  delayDuration?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 200,
  className,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const showTooltip = React.useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, delayDuration);
  }, [delayDuration]);

  const hideTooltip = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(false);
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }[align];

  const sideClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
  }[side];

  const childProps = children.props as React.HTMLAttributes<HTMLElement>;

  // Render tooltip trigger by cloning child element with interactive event handlers and accessibility attributes
  const trigger = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      childProps.onMouseEnter?.(e);
      showTooltip();
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      childProps.onMouseLeave?.(e);
      hideTooltip();
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      childProps.onFocus?.(e);
      showTooltip();
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      childProps.onBlur?.(e);
      hideTooltip();
    },
    "aria-describedby": open ? "tooltip-content" : undefined,
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <div className="relative inline-flex items-center">
      {trigger}

      {open && (
        <div
          id="tooltip-content"
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150 animate-in fade-in-0 zoom-in-95 shadow-md",
            "bg-[#252A23] text-white dark:bg-[#FAFAF8] dark:text-[#18181B] dark:border dark:border-[#383E36]",
            sideClasses,
            alignClasses,
            className
          )}
        >
          {content}
          {/* Subtle pointer arrow */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute h-1.5 w-1.5 rotate-45",
              "bg-[#252A23] dark:bg-[#FAFAF8]",
              side === "top"
                ? "bottom-[-3px] left-1/2 -translate-x-1/2"
                : "top-[-3px] left-1/2 -translate-x-1/2"
            )}
          />
        </div>
      )}
    </div>
  );
}
