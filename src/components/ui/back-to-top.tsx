"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";

/**
 * Calculates whether an RGB color is perceived as dark (relative luminance < 0.35).
 */
function isColorDark(colorString: string): boolean {
  if (!colorString || colorString === "transparent" || colorString === "rgba(0, 0, 0, 0)") {
    return false;
  }
  const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return false;
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  // Standard perceptual luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.35;
}

export interface BackToTopProps {
  /** Pixels scrolled before the button becomes visible. */
  threshold?: number;
  /** Bottom offset class or style override (defaults to 24px). */
  bottomOffset?: string;
  /** Right offset class or style override (defaults to 24px). */
  rightOffset?: string;
  className?: string;
}

export function BackToTop({
  threshold = 100,
  bottomOffset = "24px",
  rightOffset = "24px",
  className,
}: BackToTopProps) {
  const [visible, setVisible] = React.useState(false);
  const [isOverDark, setIsOverDark] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const { resolvedTheme } = useTheme();

  const handleScroll = React.useCallback(() => {
    setVisible(window.scrollY > threshold);

    // Dynamic contrast detection: check the background behind the button
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Temporarily hide button pointer events or query underlying elements
      const elements = document.elementsFromPoint(centerX, centerY);
      let foundDark = false;

      for (const el of elements) {
        if (el === buttonRef.current || buttonRef.current.contains(el)) continue;

        // Check if element has dark styling or explicit dark classes/attributes
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;

        if (
          el.classList.contains("dark") ||
          el.getAttribute("data-theme") === "dark" ||
          isColorDark(bg)
        ) {
          foundDark = true;
          break;
        }

        // Stop checking if an opaque non-dark background is reached
        if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
          break;
        }
      }

      setIsOverDark(foundDark);
    }
  }, [threshold]);

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  const scrollToTop = React.useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // In dark theme or when scrolled over a dark background section, adapt to a crisp white/light button
  const shouldInvert = resolvedTheme === "dark" || isOverDark;

  return (
    <Button
      ref={buttonRef}
      size="icon"
      variant="default"
      style={{
        bottom: bottomOffset,
        right: rightOffset,
      }}
      className={cn(
        "fixed z-50 rounded-full shadow-lg cursor-pointer",
        // Smooth transitions with entrance/exit animation
        "transition-all duration-300 ease-out motion-reduce:transition-none",
        // Interactive states: hover upward lift & elevation, active press state
        "hover:-translate-y-1.5 hover:shadow-xl active:translate-y-0 active:scale-95 active:shadow-md",
        // Dynamic color scheme: white background when over dark area or dark theme, dark charcoal otherwise
        shouldInvert
          ? "bg-white text-[#252A23] hover:bg-[#F3F4EF] border border-[#E4E6DE] shadow-2xl"
          : "bg-[#252A23] text-white hover:bg-[#383E36]",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none",
        className,
      )}
      onClick={scrollToTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp aria-hidden="true" className="w-5 h-5" />
    </Button>
  );
}
