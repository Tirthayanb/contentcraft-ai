"use client";

import * as React from "react";
import { PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Brand Philosophy & Benefits Section
 *
 * Choreographs:
 * 1. Left column editorial sequence:
 *    - "Less noise. More clarity." (two-part contrast settle)
 *    - "A calmer place to do your best writing." (masked phrase rise)
 *    - "Thoughtful tools for the everyday work of getting your ideas across." (quiet settle)
 * 2. Right column 2x2 feature highlights, each with a distinct motion-graphic
 *    concept reinforcing its meaning:
 *    - Clearer writing: scattered fragments resolving into ordered prose lines
 *    - Efficient editing: rough draft line trimmed into a polished line by an edit sweep
 *    - Content history: layered archival entries fanning into a navigable stack
 *    - Focused workspace: peripheral distractions receding to leave a calm writing field
 */
export function BrandPhilosophySection() {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(id);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#252A23] text-white py-14 sm:py-20 px-4 sm:px-6 overflow-x-clip"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8 items-start">
        {/* Left Title Column — Sequenced Editorial Choreography */}
        <div className="lg:col-span-5">
          {/* Step 1: Main heading ("Less noise. More clarity.") */}
          <span className="text-[11px] font-bold tracking-wider text-[#AFB6A7] uppercase block mb-3 sm:mb-4">
            <span
              className={cn(
                "inline-block transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                isVisible
                  ? "opacity-75 translate-x-0"
                  : "opacity-0 -translate-x-2"
              )}
            >
              Less noise.
            </span>{" "}
            <span
              className={cn(
                "inline-block text-[#E0E2DC] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-200 motion-reduce:transition-none motion-reduce:delay-0",
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-2"
              )}
            >
              More clarity.
            </span>
          </span>

          {/* Step 2: Subheading ("A calmer place to do your best writing.") */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            <span className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]">
              <span
                className={cn(
                  "inline-block transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-300 motion-reduce:transition-none motion-reduce:delay-0",
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0"
                )}
              >
                A calmer place to
              </span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]">
              <span
                className={cn(
                  "inline-block transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-[420ms] motion-reduce:transition-none motion-reduce:delay-0",
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0"
                )}
              >
                do your best writing.
              </span>
            </span>
          </h2>

          {/* Step 3: Description */}
          <p
            className={cn(
              "mt-4 sm:mt-6 text-sm text-[#AFB6A7] leading-relaxed max-w-md transition-all duration-700 ease-out delay-[580ms] motion-reduce:transition-none motion-reduce:delay-0",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2.5"
            )}
          >
            Thoughtful tools for the everyday work of getting your ideas across.
          </p>
        </div>

        {/* Right Features 2x2 Grid — Distinct Motion-Graphic Concept per Feature */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-8 sm:gap-y-12">
          {/* Value 1: Clearer writing — scattered fragments resolving into ordered prose */}
          <div
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "group border-t border-[#383E36] pt-5 sm:pt-6 space-y-2 sm:space-y-2.5 transition-opacity duration-700 delay-300 motion-reduce:transition-none motion-reduce:delay-0",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              aria-hidden="true"
              className="h-6 flex items-center gap-2.5 text-[#E0E2DC]"
            >
              <span className="text-lg font-medium leading-none">T</span>
              {/* Fragmented dashes resolving into aligned readable lines */}
              <div className="relative w-10 h-4 flex flex-col justify-center gap-[3px]">
                <span
                  className={cn(
                    "block h-[1.5px] rounded-full bg-[#E0E2DC] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    isVisible
                      ? hoveredIndex === 0
                        ? "w-9 translate-x-0 translate-y-0 rotate-0 opacity-100"
                        : "w-8 translate-x-0 translate-y-0 rotate-0 opacity-90"
                      : "w-4 -translate-x-2 -translate-y-1 -rotate-12 opacity-30"
                  )}
                />
                <span
                  className={cn(
                    "block h-[1.5px] rounded-full bg-[#AFB6A7] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-75 motion-reduce:transition-none",
                    isVisible
                      ? hoveredIndex === 0
                        ? "w-7 translate-x-0 translate-y-0 rotate-0 opacity-100"
                        : "w-6 translate-x-0 translate-y-0 rotate-0 opacity-80"
                      : "w-5 translate-x-2 translate-y-0.5 rotate-6 opacity-25"
                  )}
                />
                <span
                  className={cn(
                    "block h-[1.5px] rounded-full bg-[#7F867B] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-150 motion-reduce:transition-none",
                    isVisible
                      ? hoveredIndex === 0
                        ? "w-8 translate-x-0 translate-y-0 rotate-0 opacity-90"
                        : "w-5 translate-x-0 translate-y-0 rotate-0 opacity-70"
                      : "w-3 -translate-x-1 translate-y-1 rotate-12 opacity-20"
                  )}
                />
              </div>
            </div>
            <h3 className="text-sm font-bold text-white">Clearer writing</h3>
            <p className="text-xs text-[#AFB6A7] leading-relaxed">
              Say what you mean with words that are easier to read and understand.
            </p>
          </div>

          {/* Value 2: Efficient editing — rough state trimmed into polished clarity */}
          <div
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "group border-t border-[#383E36] pt-5 sm:pt-6 space-y-2 sm:space-y-2.5 transition-opacity duration-700 delay-[420ms] motion-reduce:transition-none motion-reduce:delay-0",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              aria-hidden="true"
              className="h-6 flex items-center gap-2.5 text-[#E0E2DC]"
            >
              <PenTool
                className={cn(
                  "w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  isVisible
                    ? hoveredIndex === 1
                      ? "translate-x-1 -rotate-6"
                      : "translate-x-0 rotate-0"
                    : "-translate-x-1.5 rotate-12"
                )}
              />
              {/* Rough excess line fading while crisp polished line locks in */}
              <div className="relative w-12 h-3 flex items-center">
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-11 rounded-full bg-[#7F867B] transition-all duration-700 ease-out delay-100 motion-reduce:transition-none",
                    isVisible
                      ? "opacity-25 scale-x-100"
                      : "opacity-75 scale-x-100"
                  )}
                />
                <span
                  className={cn(
                    "relative h-[2px] rounded-full bg-[#E0E2DC] origin-left transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-200 motion-reduce:transition-none",
                    isVisible
                      ? hoveredIndex === 1
                        ? "w-9 opacity-100"
                        : "w-7 opacity-95"
                      : "w-3 opacity-30"
                  )}
                />
              </div>
            </div>
            <h3 className="text-sm font-bold text-white">Efficient editing</h3>
            <p className="text-xs text-[#AFB6A7] leading-relaxed">
              Spend less time reworking sentences and more time moving ideas
              forward.
            </p>
          </div>

          {/* Value 3: Content history — sequential layered stack / timeline */}
          <div
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "group border-t border-[#383E36] pt-5 sm:pt-6 space-y-2 sm:space-y-2.5 transition-opacity duration-700 delay-[520ms] motion-reduce:transition-none motion-reduce:delay-0",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              aria-hidden="true"
              className="h-6 flex items-center"
            >
              {/* Layered prior entries fanning into a navigable stack */}
              <div className="relative w-10 h-5">
                <span
                  className={cn(
                    "absolute left-0 top-1.5 w-5 h-3.5 rounded-[3px] border border-[#7F867B]/60 bg-[#2D332B] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    isVisible
                      ? hoveredIndex === 2
                        ? "translate-x-0 -translate-y-0.5 opacity-70"
                        : "translate-x-0 translate-y-0 opacity-50"
                      : "translate-x-2 translate-y-1 opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-1.5 top-1 w-5 h-3.5 rounded-[3px] border border-[#AFB6A7]/70 bg-[#323830] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100 motion-reduce:transition-none",
                    isVisible
                      ? hoveredIndex === 2
                        ? "translate-x-1 -translate-y-0.5 opacity-90"
                        : "translate-x-0.5 translate-y-0 opacity-75"
                      : "translate-x-1.5 translate-y-1 opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-3 top-0.5 w-5 h-3.5 rounded-[3px] border border-[#E0E2DC] bg-[#383E36] flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-200 motion-reduce:transition-none",
                    isVisible
                      ? hoveredIndex === 2
                        ? "translate-x-2 -translate-y-0.5 scale-105 opacity-100"
                        : "translate-x-1 translate-y-0 scale-100 opacity-100"
                      : "translate-x-0 translate-y-1 scale-90 opacity-0"
                  )}
                >
                  <span className="w-2.5 h-[1.5px] rounded-full bg-[#E0E2DC]" />
                </span>
              </div>
            </div>
            <h3 className="text-sm font-bold text-white">Content history</h3>
            <p className="text-xs text-[#AFB6A7] leading-relaxed">
              Return to past results and pick up the ideas worth keeping.
            </p>
          </div>

          {/* Value 4: Focused workspace — distractions dissolving to leave a clean writing field */}
          <div
            onMouseEnter={() => setHoveredIndex(3)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "group border-t border-[#383E36] pt-5 sm:pt-6 space-y-2 sm:space-y-2.5 transition-opacity duration-700 delay-[620ms] motion-reduce:transition-none motion-reduce:delay-0",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              aria-hidden="true"
              className="h-6 flex items-center"
            >
              {/* Surrounding visual noise receding outward from a centered field */}
              <div className="relative w-10 h-5 flex items-center justify-center">
                {/* Peripheral distraction dots */}
                <span
                  className={cn(
                    "absolute left-0 top-0 w-1 h-1 rounded-full bg-[#7F867B] transition-all duration-700 ease-out motion-reduce:transition-none",
                    isVisible
                      ? hoveredIndex === 3
                        ? "-translate-x-1.5 -translate-y-1 opacity-0"
                        : "-translate-x-1 -translate-y-0.5 opacity-20"
                      : "translate-x-1 translate-y-0.5 opacity-80"
                  )}
                />
                <span
                  className={cn(
                    "absolute right-0 top-0 w-1 h-1 rounded-full bg-[#7F867B] transition-all duration-700 ease-out motion-reduce:transition-none",
                    isVisible
                      ? hoveredIndex === 3
                        ? "translate-x-1.5 -translate-y-1 opacity-0"
                        : "translate-x-1 -translate-y-0.5 opacity-20"
                      : "-translate-x-1 translate-y-0.5 opacity-80"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 bottom-0 w-1 h-1 rounded-full bg-[#7F867B] transition-all duration-700 ease-out motion-reduce:transition-none",
                    isVisible
                      ? hoveredIndex === 3
                        ? "-translate-x-1.5 translate-y-1 opacity-0"
                        : "-translate-x-1 translate-y-0.5 opacity-20"
                      : "translate-x-1 -translate-y-0.5 opacity-80"
                  )}
                />
                <span
                  className={cn(
                    "absolute right-0 bottom-0 w-1 h-1 rounded-full bg-[#7F867B] transition-all duration-700 ease-out motion-reduce:transition-none",
                    isVisible
                      ? hoveredIndex === 3
                        ? "translate-x-1.5 translate-y-1 opacity-0"
                        : "translate-x-1 translate-y-0.5 opacity-20"
                      : "-translate-x-1 -translate-y-0.5 opacity-80"
                  )}
                />

                {/* Clean centered writing field */}
                <span
                  className={cn(
                    "w-6 h-4 rounded-[3px] border border-[#E0E2DC] flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-150 motion-reduce:transition-none",
                    isVisible
                      ? hoveredIndex === 3
                        ? "scale-110 border-white bg-[#2D332B]"
                        : "scale-100 border-[#E0E2DC]"
                      : "scale-90 opacity-60"
                  )}
                >
                  <span className="w-2.5 h-[1.5px] rounded-full bg-[#E0E2DC]" />
                </span>
              </div>
            </div>
            <h3 className="text-sm font-bold text-white">Focused workspace</h3>
            <p className="text-xs text-[#AFB6A7] leading-relaxed">
              Just the text, the tools, and room to think. Nothing getting in the
              way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
