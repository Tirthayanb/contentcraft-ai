"use client";

import * as React from "react";
import {
  FileText,
  PenTool,
  Sliders,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Single source of truth for Toolkit Media assignments.
 * Swappable when additional video assets or static posters become available.
 */
export const TOOLKIT_MEDIA_CONFIG = {
  summarize: {
    type: "video" as const,
    src: "/video-assets/video_summ.mp4",
  },
  rewrite: {
    type: "video" as const,
    src: "/video-assets/Product_animation_for_rewrite_fe\u2026_fa9ebad0.mp4",
  },
  simplify: {
    type: "placeholder" as const,
    title: "Simplify Engine",
    subtitle: "AI Clarity Preview",
  },
  social: {
    type: "placeholder" as const,
    title: "Social Engine",
    subtitle: "Cross-Platform Preview",
  },
};

export interface ToolkitItem {
  id: "summarize" | "rewrite" | "simplify" | "social";
  toolKey: "write" | "refine" | "simplify" | "repurpose";
  name: string;
  tagline: string;
  subLabel: string;
  quote: string;
  transformation: string;
  icon: React.ElementType;
}

export const TOOLKIT_ITEMS: ToolkitItem[] = [
  {
    id: "summarize",
    toolKey: "write",
    name: "Summarize",
    tagline:
      "Extract the key points. Turn long reads into a clear, useful overview.",
    subLabel: "Less scrolling, more signal",
    quote: "The essentials, without the extra.",
    transformation: "Meeting notes \u2192 Key takeaways",
    icon: FileText,
  },
  {
    id: "rewrite",
    toolKey: "refine",
    name: "Rewrite",
    tagline:
      "Improve clarity and flow while keeping what makes your writing yours.",
    subLabel: "Same idea, better flow",
    quote: "Find the words you meant to use.",
    transformation: "Rough draft \u2192 Polished copy",
    icon: PenTool,
  },
  {
    id: "simplify",
    toolKey: "simplify",
    name: "Simplify",
    tagline:
      "Make complex text easier to understand. Keep the meaning, lose the jargon.",
    subLabel: "Plain words, please",
    quote: "Big ideas. A little less complex.",
    transformation: "Technical text \u2192 Plain language",
    icon: Sliders,
  },
  {
    id: "social",
    toolKey: "repurpose",
    name: "Social Post",
    tagline:
      "Shape your ideas into social-ready content that gets to the point.",
    subLabel: "Ready for the feed",
    quote: "From a good idea to a great post.",
    transformation: "Draft idea \u2192 Social-ready post",
    icon: MessageSquare,
  },
];

interface ToolkitCarouselProps {
  onSelectTool?: (tool: "write" | "repurpose" | "refine" | "simplify") => void;
}

export function ToolkitCarousel({ onSelectTool }: ToolkitCarouselProps) {
  // We use 1 clone before and 1 clone after to support seamless looping without visible jumps
  // Array format: [lastItem, item0, item1, item2, item3, item0]
  // Indices: 0 is clone of item3, 1 is item0, ..., 4 is item3, 5 is clone of item0
  const originalLength = TOOLKIT_ITEMS.length;
  const [slideIndex, setSlideIndex] = React.useState(1); // Start at 1 (real item 0)
  const [isTransitioning, setIsTransitioning] = React.useState(true);
  const [isPaused, setIsPaused] = React.useState(false);

  // Active item index for UI dots (0 to 3)
  const activeRealIndex = (slideIndex - 1 + originalLength) % originalLength;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);
  const [translateX, setTranslateX] = React.useState(0);

  const touchStartXRef = React.useRef<number | null>(null);
  const touchStartYRef = React.useRef<number | null>(null);

  // Cloned items list for smooth infinite looping
  const extendedItems = React.useMemo(() => {
    const firstClone = { ...TOOLKIT_ITEMS[0], cloneKey: "clone-end" };
    const lastClone = { ...TOOLKIT_ITEMS[originalLength - 1], cloneKey: "clone-start" };
    return [lastClone, ...TOOLKIT_ITEMS, firstClone];
  }, [originalLength]);

  // Recalculate track position to center current card in the container viewport
  const updateTrackPosition = React.useCallback(() => {
    if (!containerRef.current || !cardRefs.current[slideIndex]) return;

    const containerWidth = containerRef.current.offsetWidth;
    const targetCard = cardRefs.current[slideIndex];
    if (!targetCard) return;

    // Card offset left relative to track + half width
    const cardCenter = targetCard.offsetLeft + targetCard.offsetWidth / 2;
    // We want cardCenter to align with containerWidth / 2
    const targetX = containerWidth / 2 - cardCenter;
    setTranslateX(targetX);
  }, [slideIndex]);

  // Update position on slide change and window resize
  React.useEffect(() => {
    updateTrackPosition();
    window.addEventListener("resize", updateTrackPosition);
    return () => window.removeEventListener("resize", updateTrackPosition);
  }, [updateTrackPosition]);

  // Handle seamless loop boundaries after animation completes
  const handleTransitionEnd = React.useCallback(() => {
    if (slideIndex === 0) {
      // Reached start clone -> jump to real last item without transition
      setIsTransitioning(false);
      setSlideIndex(originalLength);
    } else if (slideIndex === extendedItems.length - 1) {
      // Reached end clone -> jump to real first item without transition
      setIsTransitioning(false);
      setSlideIndex(1);
    }
  }, [slideIndex, originalLength, extendedItems.length]);

  // Re-enable transitions after jumping boundary
  React.useEffect(() => {
    if (!isTransitioning) {
      const frame = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isTransitioning]);

  // Navigation handlers
  const nextSlide = React.useCallback(() => {
    if (!isTransitioning) return;
    setSlideIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const prevSlide = React.useCallback(() => {
    if (!isTransitioning) return;
    setSlideIndex((prev) => prev - 1);
  }, [isTransitioning]);

  const goToSlide = (realIndex: number) => {
    setIsTransitioning(true);
    setSlideIndex(realIndex + 1);
  };

  // Autoplay timer (4.5s), pauses on hover/touch/focus
  React.useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Manage video playback: only the active card's video plays
  React.useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === slideIndex) {
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch(() => {
            // Browser autoplay restrictions
          });
        }
      } else {
        video.pause();
      }
    });
  }, [slideIndex]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  const handleCardClick = (realIndex: number, toolKey: "write" | "repurpose" | "refine" | "simplify") => {
    if (realIndex === activeRealIndex) {
      if (onSelectTool) onSelectTool(toolKey);
      document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" });
    } else {
      goToSlide(realIndex);
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Toolkit tools preview"
      className="relative w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#373A36]/30 py-4"
    >
      {/* Sliding Track Viewport */}
      <div
        className="w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          className={cn(
            "flex items-center gap-[2px]",
            isTransitioning ? "transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)]" : "transition-none",
            "motion-reduce:transition-none"
          )}
          style={{
            transform: `translate3d(${translateX}px, 0, 0)`,
          }}
        >
          {extendedItems.map((item, index) => {
            const isSlideActive = index === slideIndex;
            const realIdx = (index - 1 + originalLength) % originalLength;
            const media = TOOLKIT_MEDIA_CONFIG[item.id];
            const Icon = item.icon;

            return (
              <div
                key={"cloneKey" in item ? `${item.cloneKey}-${index}` : item.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="shrink-0 px-0 w-[85vw] sm:w-[70vw] md:w-[640px] lg:w-[720px] max-w-[800px]"
              >
                <div
                  onClick={() => handleCardClick(realIdx, item.toolKey)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-500 ease-out cursor-pointer",
                    "motion-reduce:transition-none motion-reduce:transform-none",
                    isSlideActive
                      ? "scale-100 opacity-100 border-[#CDCBC5] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
                      : "scale-[0.93] sm:scale-95 opacity-50 hover:opacity-75 border-[#E4E6DE] bg-[#F7F7F4] shadow-xs"
                  )}
                >
                  {/* Media Container (Video or Styled Static Placeholder) */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-[#222620]">
                    {media.type === "video" ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        src={media.src}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#272C27] to-[#1E221E] px-6 text-center text-white">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#AFB6A7] backdrop-blur-sm">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xs font-semibold tracking-wider text-[#AFB6A7] uppercase">
                          {media.subtitle}
                        </span>
                        <h4 className="mt-1 text-base sm:text-lg font-bold text-white">
                          {media.title}
                        </h4>
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-[#E0E2DC]">
                          <Sparkles className="h-3 w-3 text-[#A8B4A2]" />
                          Interactive Preview
                        </div>
                      </div>
                    )}

                    {/* Gradient Overlay for subtle depth */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>

                  {/* Card Content Area - Exactly matches existing text */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F4F5EF] flex items-center justify-center text-[#373A36] group-hover:bg-[#ECEEE6] transition-colors">
                          <Icon className="w-5 h-5 text-[#5C5C57]" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-xl font-bold text-[#252A23]">
                            {item.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-[#74786F] leading-relaxed">
                        {item.tagline}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-5 pt-3 border-t border-[#F0EFEA] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold tracking-wider text-[#AFB6A7] uppercase block mb-1">
                          {item.subLabel}
                        </span>
                        <p className="text-xs font-semibold text-[#252A23]">
                          {item.quote}
                        </p>
                      </div>
                      <span className="text-[11px] font-medium text-[#80807A] self-start sm:self-auto sm:text-right">
                        {item.transformation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls & Pagination Indicators */}
      <div className="mt-6 sm:mt-8 flex items-center justify-between max-w-6xl mx-auto px-4 sm:px-6">
        {/* Apple TV+ Style Expandable Pagination Indicators */}
        <div className="flex items-center gap-2">
          {TOOLKIT_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${item.name}`}
              aria-current={idx === activeRealIndex ? "true" : "false"}
              className={cn(
                "h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#373A36]",
                idx === activeRealIndex
                  ? "w-8 bg-[#373A36]"
                  : "w-2 bg-[#E4E6DE] hover:bg-[#CDCBC5]"
              )}
            />
          ))}
        </div>

        {/* Previous / Next Arrow Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous tool"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#E4E6DE] bg-white text-[#5C5C57] shadow-xs transition-colors hover:bg-[#F4F5EF] hover:text-[#252A23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#373A36]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next tool"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#E4E6DE] bg-white text-[#5C5C57] shadow-xs transition-colors hover:bg-[#F4F4F0] hover:text-[#252A23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#373A36]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
