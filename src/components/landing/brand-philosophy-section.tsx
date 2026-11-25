"use client";

import * as React from "react";
import { PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandPhilosophySection() {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

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

  const fadeIn = isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";

  return (
    <section
      ref={sectionRef}
      className={cn(
        "bg-[#252A23] text-white py-14 sm:py-20 px-4 sm:px-6 overflow-x-clip",
        "transition-opacity duration-1000"
      )}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8 items-start">
        {/* ── Left Column ── */}
        <div className="lg:col-span-5">
          {/* Heading 1: "Less noise. More clarity." */}
          <span className={cn("block mb-3 sm:mb-4", fadeIn)}>
            <span
              className="text-[11px] font-bold tracking-wider text-[#AFB6A7] uppercase inline-block"
            >
              Less noise.
            </span>{" "}
            <span className="text-[#74786F] opacity-40 mr-1">·</span>
            <span
              className="text-[11px] font-bold tracking-wider text-[#E0E2DC] uppercase inline-block"
            >
              More clarity.
            </span>
          </span>

          {/* Heading 2: "A calmer place to do your best writing." */}
          <h2 className={cn("text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-1 sm:mb-2", fadeIn)}>
            A calmer place to<br />
            do your best writing.
          </h2>

          {/* Paragraph */}
          <p className={cn("mt-4 sm:mt-6 text-sm text-[#AFB6A7] leading-relaxed max-w-md", fadeIn)}>
            Thoughtful tools for the everyday work of getting your ideas across.
          </p>
        </div>

        {/* ── Right Features Grid ── */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-8 sm:gap-y-12">
          {/* Feature 1: Clearer writing */}
          <div className={cn(
            "group border-t border-[#383E36] pt-5 sm:pt-6 space-y-2 sm:space-y-2.5 transition-opacity duration-700",
            fadeIn
          )}>
            <div className="h-6 flex items-center gap-2.5 text-[#E0E2DC]">
              <span className="text-lg font-medium leading-none">T</span>
              <div className="relative w-12 h-4 flex flex-col justify-center gap-[3px]">
                <span className="block h-[1.5px] rounded-full bg-[#E0E2DC] w-8" />
                <span className="block h-[1.5px] rounded-full bg-[#AFB6A7] w-7" />
                <span className="block h-[1.5px] rounded-full bg-[#7F867B] w-6" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-white">Clearer writing</h3>
            <p className="text-xs text-[#AFB6A7] leading-relaxed">
              Say what you mean with words that are easier to read and understand.
            </p>
          </div>

          {/* Feature 2: Efficient editing */}
          <div className={cn(
            "group border-t border-[#383E36] pt-5 sm:pt-6 space-y-2 sm:space-y-2.5 transition-opacity duration-700",
            fadeIn
          )}>
            <div className="h-6 flex items-center gap-2.5 text-[#E0E2DC]">
              <PenTool className="w-4 h-4" />
              <div className="relative w-12 h-3 flex items-center">
                <span className="absolute left-0 h-[1.5px] w-4 rounded-full bg-[#7F867B]" />
                <span className="relative h-[2px] rounded-full bg-[#E0E2DC] origin-left w-9" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-white">Efficient editing</h3>
            <p className="text-xs text-[#AFB6A7] leading-relaxed">
              Spend less time reworking sentences and more time moving ideas forward.
            </p>
          </div>

          {/* Feature 3: Content history */}
          <div className={cn(
            "group border-t border-[#383E36] pt-5 sm:pt-6 space-y-2 sm:space-y-2.5 transition-opacity duration-700",
            fadeIn
          )}>
            <div className="h-6 flex items-center">
              <div className="relative w-12 h-5">
                <span className="absolute left-0 top-1.5 w-5 h-3.5 rounded-[3px] border border-[#7F867B]/60 bg-[#2D332B] opacity-60" />
                <span className="absolute left-1.5 top-1 w-5 h-3.5 rounded-[3px] border border-[#AFB6A7]/70 bg-[#323830] opacity-75" />
                <span className="absolute left-3 top-0.5 w-5 h-3.5 rounded-[3px] border border-[#E0E2DC] bg-[#383E36] flex items-center justify-center opacity-100">
                  <span className="w-2.5 h-[1.5px] rounded-full bg-[#E0E2DC]" />
                </span>
              </div>
            </div>
            <h3 className="text-sm font-bold text-white">Content history</h3>
            <p className="text-xs text-[#AFB6A7] leading-relaxed">
              Return to past results and pick up the ideas worth keeping.
            </p>
          </div>

          {/* Feature 4: Focused workspace */}
          <div className={cn(
            "group border-t border-[#383E36] pt-5 sm:pt-6 space-y-2 sm:space-y-2.5 transition-opacity duration-700",
            fadeIn
          )}>
            <div className="h-6 flex items-center">
              <div className="relative w-12 h-5 flex items-center justify-center">
                <span
                  className="absolute left-0 top-0 w-1 h-1 rounded-full bg-[#7F867B] opacity-20"
                />
                <span
                  className="absolute right-0 top-0 w-1 h-1 rounded-full bg-[#7F867B] opacity-20"
                />
                <span
                  className="absolute left-0 bottom-0 w-1 h-1 rounded-full bg-[#7F867B] opacity-20"
                />
                <span
                  className="absolute right-0 bottom-0 w-1 h-1 rounded-full bg-[#7F867B] opacity-20"
                />
                <span
                  className="w-6 h-4 rounded-[3px] border border-[#E0E2DC] flex items-center justify-center"
                >
                  <span className="w-2.5 h-[1.5px] rounded-full bg-[#E0E2DC]" />
                </span>
              </div>
            </div>
            <h3 className="text-sm font-bold text-white">Focused workspace</h3>
            <p className="text-xs text-[#AFB6A7] leading-relaxed">
              Just the text, the tools, and room to think. Nothing getting in the way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
