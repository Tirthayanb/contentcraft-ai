"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  PenTool,
  Repeat,
  Sparkles,
  Sliders,
  FileText,
  MessageSquare,
  Copy,
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Clock,
  Layout,
  RotateCw,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/components/providers/theme-provider";
import { BrandLogo } from "@/components/brand/brand-logo";

type ToolType = "write" | "repurpose" | "refine" | "simplify";

interface ToolContent {
  id: ToolType;
  title: string;
  tagline: string;
  badge: string;
  guideNote: string;
  tagLeft: string;
  tagRight: string;
  inputText: string;
  outputTitle: string;
  outputText: string;
  outputMeta: string;
}

const TOOLS: Record<ToolType, ToolContent> = {
  write: {
    id: "write",
    title: "Write",
    tagline: "Turn a thought into a first draft.",
    badge: "Team update",
    guideNote: "Start with Write. Make it yours.",
    tagLeft: "Friendly",
    tagRight: "Concise",
    inputText:
      "Write a short team update about our new Monday planning session. We'll meet for 20 minutes to align priorities, discuss blockers, and decide next steps. Keep it warm and clear.",
    outputTitle: "A more focused start to the week.",
    outputText:
      "Let's start Mondays with a little more clarity. Join us for a 20-minute planning session to share priorities, work through blockers, and agree on what's next. Add your updates beforehand so we can focus on decisions, not status reports.",
    outputMeta: "Write · Team update",
  },
  repurpose: {
    id: "repurpose",
    title: "Repurpose",
    tagline: "One idea. A new way to share it.",
    badge: "Cross-channel",
    guideNote: "Adapt formats. Keep the core idea intact.",
    tagLeft: "Social",
    tagRight: "Thread",
    inputText:
      "We turned our 60-minute status meetings into a 20-minute Monday planning session. The results: faster decisions, zero fluff, and higher team momentum all week long.",
    outputTitle: "Why shorter meetings win.",
    outputText:
      "Cut the meeting fat. We replaced an hour-long status call with a 20-minute kickoff focused entirely on unblocking each other. Spend less time talking about work, and more time doing work that matters.",
    outputMeta: "Repurpose · Social post",
  },
  refine: {
    id: "refine",
    title: "Refine",
    tagline: "Your voice, with a little more clarity.",
    badge: "Voice & tone",
    guideNote: "Polish tone. Keep your distinct voice.",
    tagLeft: "Clarity",
    tagRight: "Impact",
    inputText:
      "We are going to start having weekly sessions on Mondays to talk about what everyone is doing and resolve any blockers together before we jump into tasks.",
    outputTitle: "Clarity meets purpose.",
    outputText:
      "Every Monday, we're holding a focused 20-minute alignment session to prioritize our week, clear obstacles early, and hit the ground running with shared confidence.",
    outputMeta: "Refine · Polished draft",
  },
  simplify: {
    id: "simplify",
    title: "Simplify",
    tagline: "Keep the meaning. Lose the jargon.",
    badge: "Plain language",
    guideNote: "Trim excess words. Maximize readability.",
    tagLeft: "Direct",
    tagRight: "Simple",
    inputText:
      "To optimize team synergy and achieve strategic velocity, all personnel shall convene for a synchronous 20-minute status rendezvous every Monday morning.",
    outputTitle: "Simply said.",
    outputText:
      "We're meeting every Monday for 20 minutes to align our priorities and fix blockers together. Quick, simple, and direct.",
    outputMeta: "Simplify · Plain language",
  },
};

const TOOL_ORDER: ToolType[] = ["write", "repurpose", "refine", "simplify"];



export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolType>("write");
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  const [inputText, setInputText] = useState<string>(TOOLS.write.inputText);
  const [outputData, setOutputData] = useState<{
    title: string;
    text: string;
    meta: string;
  }>({
    title: TOOLS.write.outputTitle,
    text: TOOLS.write.outputText,
    meta: TOOLS.write.outputMeta,
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const currentToolIndex = TOOL_ORDER.indexOf(activeTool);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Listen for prefers-reduced-motion media query changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", listener);
    } else {
      mediaQuery.addListener(listener);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, []);

  // Synchronize workspace display with the active tool
  const triggerTransition = useCallback((tool: ToolType, dir: "next" | "prev") => {
    setDirection(dir);
    setIsTransitioning(true);
    setActiveTool(tool);

    const data = TOOLS[tool];
    setInputText(data.inputText);
    setOutputData({
      title: data.outputTitle,
      text: data.outputText,
      meta: data.outputMeta,
    });
    setCopied(false);

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    // Clean transition state after motion completes (600ms)
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, []);

  const handleSelectTool = useCallback(
    (tool: ToolType) => {
      if (tool === activeTool) return;
      const targetIndex = TOOL_ORDER.indexOf(tool);
      const dir = targetIndex > currentToolIndex ? "next" : "prev";
      triggerTransition(tool, dir);
    },
    [activeTool, currentToolIndex, triggerTransition]
  );

  const handlePrevTool = useCallback(() => {
    const prevIndex = (currentToolIndex - 1 + TOOL_ORDER.length) % TOOL_ORDER.length;
    triggerTransition(TOOL_ORDER[prevIndex], "prev");
  }, [currentToolIndex, triggerTransition]);

  const handleNextTool = useCallback(() => {
    const nextIndex = (currentToolIndex + 1) % TOOL_ORDER.length;
    triggerTransition(TOOL_ORDER[nextIndex], "next");
  }, [currentToolIndex, triggerTransition]);

  // Keyboard navigation handler for carousel container (ArrowLeft / ArrowRight)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevTool();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextTool();
      }
    },
    [handlePrevTool, handleNextTool]
  );

  // Auto-advance carousel every 5s; pause on hover, focus, tab visibility, or reduced motion
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const interval = setInterval(() => {
      handleNextTool();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, prefersReducedMotion, handleNextTool]);

  // Pause when the document tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Close mobile menu on route-style navigation (anchor clicks)
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Touch swipe support (minimum 40px delta)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Horizontal swipe threshold: > 40px and more horizontal than vertical
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNextTool();
      } else {
        handlePrevTool();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setCopied(false);
    setTimeout(() => {
      const data = TOOLS[activeTool];
      const trimmed = inputText.trim();
      if (!trimmed) {
        setOutputData({
          title: "Please enter your thoughts first.",
          text: "Write or paste a quick idea in the box on the left, then click Generate to preview your draft.",
          meta: `${data.title} · Ready`,
        });
      } else {
        setOutputData({
          title: data.outputTitle,
          text: data.outputText,
          meta: data.outputMeta,
        });
      }
      setIsGenerating(false);
    }, 450);
  };

  const handleCopy = async () => {
    const textToCopy = `${outputData.title}\n\n${outputData.text}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      }
    } catch {
      // Fallback if browser clipboard permissions are restricted
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#252A23] font-sans selection:bg-[#EAE8E3] scroll-smooth">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-[#FAFAF8]/95 backdrop-blur-sm border-b border-[#E4E6DE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="#workspace" className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#373A36] rounded-md">
            <BrandLogo size="md" priority />
          </Link>

          {/* Desktop nav links — hidden below md */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#74786F] whitespace-nowrap">
            <Link href="#workspace" className="hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#373A36] rounded px-1 py-0.5">
              Product
            </Link>
            <Link href="#features" className="hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#373A36] rounded px-1 py-0.5">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#373A36] rounded px-1 py-0.5">
              How It Works
            </Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Desktop-only actions — hidden on mobile */}
            <Link
              href="#signin"
              className="hidden md:inline text-sm font-medium text-[#74786F] hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#373A36] rounded px-1 py-0.5"
            >
              Sign In
            </Link>
            <Button
              asChild
              className="hidden md:inline-flex bg-[#373A36] hover:bg-[#272C27] text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#373A36]"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
            <ThemeToggle size="sm" className="hidden md:ml-3 sm:ml-4" />

            {/* Mobile bar: compact single-icon theme toggle + hamburger menu */}
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[#74786F] hover:bg-[#F0EFEA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#373A36]"
              aria-label={resolvedTheme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {resolvedTheme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#F0EFEA] text-[#74786F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#373A36]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-[#E4E6DE]/60 bg-[#FAFAF8] px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <Link
              href="#workspace"
              onClick={closeMobileMenu}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#74786F] hover:text-black hover:bg-[#F3F4EF] transition-colors"
            >
              Product
            </Link>
            <Link
              href="#features"
              onClick={closeMobileMenu}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#74786F] hover:text-black hover:bg-[#F3F4EF] transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={closeMobileMenu}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#74786F] hover:text-black hover:bg-[#F3F4EF] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#signin"
              onClick={closeMobileMenu}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#74786F] hover:text-black hover:bg-[#F3F4EF] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={closeMobileMenu}
              className="mt-2 block w-full px-4 py-3 text-center rounded-xl text-sm font-medium text-white bg-[#373A36] shadow-sm hover:bg-[#272C27] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#373A36]/30"
            >
              Get Started
            </Link>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-10 sm:pt-16 md:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F4EF] text-[#74786F] text-xs font-medium mb-6 sm:mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#373A36]" />
          A little clarity goes a long way
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#252A23] max-w-4xl mx-auto leading-[1.12]">
          Your ideas, better expressed.
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-[#74786F] max-w-xl mx-auto font-normal leading-relaxed">
          Summarize, rewrite, simplify, and create content with a toolkit
          designed to help you write with clarity.
        </p>

        {/* CTAs */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
          <Button
            asChild
            className="w-full sm:w-auto bg-[#373A36] hover:bg-[#272C27] text-white px-6 py-5 sm:py-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 group shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#373A36]"
          >
            <Link href="#workspace">
              Try ContentCraft
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-[#E0DED9] bg-white hover:bg-[#F4F5EF] text-[#373A36] px-6 py-5 sm:py-6 rounded-xl font-medium text-sm shadow-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#373A36]"
          >
            <Link href="#features">Explore Features</Link>
          </Button>
        </div>

        {/* Interactive Workspace / Tool Preview */}
        <div id="workspace" className="mt-10 sm:mt-14 max-w-4xl mx-auto text-left scroll-mt-24 sm:scroll-mt-28">
          <div className="bg-white rounded-2xl border border-[#E4E6DE] shadow-sm overflow-hidden p-4 sm:p-5 md:p-7 space-y-5 sm:space-y-7">
            
            {/* Upper Section: One idea. Four ways forward. (TOOL PREVIEW) */}
            <div
              role="region"
              aria-roledescription="carousel"
              aria-label="ContentCraft AI Tool Preview Carousel"
              tabIndex={0}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              onKeyDown={handleKeyDown}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="outline-none focus-visible:ring-2 focus-visible:ring-[#7F867B] focus-visible:ring-offset-2 rounded-xl transition-all"
            >
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#F0EFEA] mb-4 sm:mb-5">
                <span className="text-xs sm:text-sm font-semibold text-[#252A23]">
                  One idea. Four ways forward.
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#AFB6A7] uppercase">
                  TOOL PREVIEW
                </span>
              </div>

              {/* 4 Tool Carousel / Selectable Cards Grid */}
              <div
                role="tablist"
                aria-label="Writing toolkit options"
                className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 relative"
              >
                {/* Write */}
                <button
                  type="button"
                  role="tab"
                  id="tab-write"
                  aria-selected={activeTool === "write"}
                  aria-controls="panel-workspace"
                  onClick={() => handleSelectTool("write")}
                  className={`relative text-left p-3 sm:p-4 rounded-xl border transition-all duration-300 min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F867B] ${
                    activeTool === "write"
                      ? "bg-[#F3F4EE] border-[#7F867B] shadow-xs"
                      : "bg-white border-[#E4E6DE] hover:border-[#D5D3CC]"
                  }`}
                >
                  {/* Animated Active Border & Indicator */}
                  {activeTool === "write" && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-xl border border-[#7F867B] ring-1 ring-[#7F867B]/30 pointer-events-none transition-all duration-500 ease-in-out"
                    />
                  )}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 font-semibold text-xs text-[#252A23]">
                    <PenTool className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#373A36]" />
                    Write
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#74786F] leading-snug">
                    Turn a thought into a first draft.
                  </p>
                </button>

                {/* Repurpose */}
                <button
                  type="button"
                  role="tab"
                  id="tab-repurpose"
                  aria-selected={activeTool === "repurpose"}
                  aria-controls="panel-workspace"
                  onClick={() => handleSelectTool("repurpose")}
                  className={`relative text-left p-3 sm:p-4 rounded-xl border transition-all duration-300 min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F867B] ${
                    activeTool === "repurpose"
                      ? "bg-[#F3F4EE] border-[#7F867B] shadow-xs"
                      : "bg-white border-[#E4E6DE] hover:border-[#D5D3CC]"
                  }`}
                >
                  {activeTool === "repurpose" && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-xl border border-[#7F867B] ring-1 ring-[#7F867B]/30 pointer-events-none transition-all duration-500 ease-in-out"
                    />
                  )}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 font-semibold text-xs text-[#252A23]">
                    <Repeat className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#373A36]" />
                    Repurpose
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#74786F] leading-snug">
                    One idea. A new way to share it.
                  </p>
                </button>

                {/* Refine */}
                <button
                  type="button"
                  role="tab"
                  id="tab-refine"
                  aria-selected={activeTool === "refine"}
                  aria-controls="panel-workspace"
                  onClick={() => handleSelectTool("refine")}
                  className={`relative text-left p-3 sm:p-4 rounded-xl border transition-all duration-300 min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F867B] ${
                    activeTool === "refine"
                      ? "bg-[#F3F4EE] border-[#7F867B] shadow-xs"
                      : "bg-white border-[#E4E6DE] hover:border-[#D5D3CC]"
                  }`}
                >
                  {activeTool === "refine" && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-xl border border-[#7F867B] ring-1 ring-[#7F867B]/30 pointer-events-none transition-all duration-500 ease-in-out"
                    />
                  )}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 font-semibold text-xs text-[#252A23]">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#373A36]" />
                    Refine
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#74786F] leading-snug">
                    Your voice, with a little more clarity.
                  </p>
                </button>

                {/* Simplify */}
                <button
                  type="button"
                  role="tab"
                  id="tab-simplify"
                  aria-selected={activeTool === "simplify"}
                  aria-controls="panel-workspace"
                  onClick={() => handleSelectTool("simplify")}
                  className={`relative text-left p-3 sm:p-4 rounded-xl border transition-all duration-300 min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F867B] ${
                    activeTool === "simplify"
                      ? "bg-[#F3F4EE] border-[#7F867B] shadow-xs"
                      : "bg-white border-[#E4E6DE] hover:border-[#D5D3CC]"
                  }`}
                >
                  {activeTool === "simplify" && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-xl border border-[#7F867B] ring-1 ring-[#7F867B]/30 pointer-events-none transition-all duration-500 ease-in-out"
                    />
                  )}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 font-semibold text-xs text-[#252A23]">
                    <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#373A36]" />
                    Simplify
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#74786F] leading-snug">
                    Keep the meaning. Lose the jargon.
                  </p>
                </button>
              </div>

              {/* Sub-header with Carousel Pagination & Guidance Note */}
              <div className="flex items-center justify-between pt-3 sm:pt-4 text-xs text-[#74786F]">
                <div
                  className={`hidden sm:block transition-all duration-500 ease-in-out ${
                    prefersReducedMotion
                      ? ""
                      : isTransitioning
                      ? "opacity-60 translate-x-1"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  <span>{TOOLS[activeTool].guideNote}</span>
                </div>

                {/* Controls: Prev / Indicators / Next */}
                <div className="flex items-center gap-1 sm:gap-1.5 ml-auto" role="group" aria-label="Carousel navigation">
                  <button
                    type="button"
                    onClick={handlePrevTool}
                    className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg hover:bg-[#F0EFEA] text-[#8A8983] hover:text-[#252A23] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F867B]"
                    aria-label="Previous tool slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 sm:gap-1.5 px-1" aria-label="Slide indicators">
                    {TOOL_ORDER.map((tool) => {
                      const isActive = activeTool === tool;
                      return (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => handleSelectTool(tool)}
                          aria-label={`Go to slide ${tool}`}
                          aria-current={isActive ? "true" : "false"}
                          className="min-h-[44px] min-w-[16px] sm:min-w-[20px] flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F867B] rounded"
                        >
                          <span
                            className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${
                              isActive
                                ? "w-4 bg-[#7F867B]"
                                : "w-1.5 bg-[#DCDAD5] hover:bg-[#B0AEA8]"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextTool}
                    className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg hover:bg-[#F0EFEA] text-[#8A8983] hover:text-[#252A23] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F867B]"
                    aria-label="Next tool slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Lower Section: Try it once (No signup needed) */}
            <div
              id="panel-workspace"
              role="region"
              aria-labelledby={`tab-${activeTool}`}
              className="pt-5 sm:pt-6 border-t border-[#F0EFEA]"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm font-semibold text-[#252A23]">
                  Try it once
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#AFB6A7]">
                  No signup needed
                </span>
              </div>

              {/* Two Column Interactive Workspace Area with Gentle Stagger Motion */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Left Card: Your idea */}
                <div
                  className={`border border-[#EBEAE5] rounded-xl p-4 sm:p-5 flex flex-col justify-between min-h-[260px] sm:min-h-[300px] bg-white transition-all duration-500 ease-in-out ${
                    prefersReducedMotion
                      ? ""
                      : isTransitioning
                      ? direction === "next"
                        ? "opacity-75 -translate-x-2"
                        : "opacity-75 translate-x-2"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="text-xs font-semibold text-[#252A23]">
                        Your idea
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#AFB6A7] transition-opacity duration-300">
                        {TOOLS[activeTool].badge}
                      </span>
                    </div>

                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      rows={6}
                      className="w-full text-xs leading-relaxed text-[#4A4B46] resize-none border-none outline-none focus:ring-0 p-0 bg-transparent placeholder:text-[#AFB6A7]"
                      placeholder="Write your thought, rough draft, or team update here..."
                    />
                  </div>

                  <div className="pt-3 sm:pt-4 flex items-center justify-between border-t border-[#F4F5EF] mt-4 sm:mt-6">
                    <span className="text-[10px] sm:text-[11px] text-[#AFB6A7]">
                      {TOOLS[activeTool].tagLeft} · {TOOLS[activeTool].tagRight}
                    </span>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex items-center gap-1.5 bg-[#373A36] hover:bg-[#272C27] text-white text-xs font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors disabled:opacity-75 cursor-pointer shadow-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F867B]"
                    >
                      {isGenerating ? (
                        <>
                          Generating
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        </>
                      ) : (
                        <>
                          Generate
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Card: Your first draft (Green-tinted Olive Background) with Gentle Stagger */}
                <div
                  className={`border border-[#DFE5DC] bg-[#EFF3ED] rounded-xl p-4 sm:p-5 flex flex-col justify-between min-h-[260px] sm:min-h-[300px] transition-all duration-500 ease-in-out delay-75 ${
                    prefersReducedMotion
                      ? ""
                      : isTransitioning
                      ? direction === "next"
                        ? "opacity-75 translate-x-2"
                        : "opacity-75 -translate-x-2"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#252A23]">
                        <Sparkles className="w-3.5 h-3.5 text-[#373A36]" />
                        Your first draft
                      </div>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1 text-[11px] text-[#74786F] hover:text-black transition-colors font-medium cursor-pointer min-h-[44px] px-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F867B]"
                        aria-label="Copy drafted text to clipboard"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span className="text-emerald-800 font-semibold">
                              Copied
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    {/* Staggered Heading */}
                    <h3
                      className={`text-xs font-semibold text-[#252A23] mb-2 sm:mb-3 transition-all duration-500 ease-in-out ${
                        prefersReducedMotion
                          ? ""
                          : isTransitioning
                          ? "opacity-70 translate-y-1"
                          : "opacity-100 translate-y-0"
                      }`}
                    >
                      {outputData.title}
                    </h3>

                    {/* Staggered Description */}
                    <p
                      className={`text-xs leading-relaxed text-[#41473D] transition-all duration-500 ease-in-out delay-100 ${
                        prefersReducedMotion
                          ? ""
                          : isTransitioning
                          ? "opacity-70 translate-y-1"
                          : "opacity-100 translate-y-0"
                      }`}
                    >
                      {outputData.text}
                    </p>
                  </div>

                  {/* Staggered Meta Tag */}
                  <div className="pt-3 sm:pt-4 border-t border-[#DFE5DC] text-[10px] sm:text-[11px] text-[#7A7E76] mt-4 sm:mt-6">
                    {outputData.meta}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer: A good start? Save your drafts and keep creating. + Sign up free */}
              <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-[#F0EFEA] text-xs text-[#74786F]">
                <span className="text-center sm:text-left">
                  A good start? Save your drafts and keep creating.
                </span>
                <Button
                  asChild
                  className="w-full sm:w-auto bg-[#373A36] hover:bg-[#272C27] text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 group min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#7F867B]"
                >
                  <Link href="/signup">
                    Sign up free
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-3 sm:mt-4 text-center text-[10px] sm:text-xs text-[#9E9E98]">
            One draft. Four ways forward. Your voice, always.
          </p>
        </div>
      </section>

      {/* The Toolkit Section */}
      <section
        id="features"
        className="py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#F3F4EF] scroll-mt-20"
      >
        <div className="mb-8 sm:mb-12">
          <span className="text-xs font-bold tracking-wider text-[#8A8983] uppercase block mb-2 sm:mb-3">
            The Toolkit
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#252A23]">
            Good writing, less friction.
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#74786F]">
            Four focused tools. Whatever your draft needs next.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Summarize */}
          <div
            onClick={() => {
              handleSelectTool("write");
              const el = document.getElementById("workspace");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white border border-[#E4E6DE] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-[#CDCBC5] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F4F5EF] flex items-center justify-center text-[#373A36] mb-4 sm:mb-5 group-hover:bg-[#F3F4EF] transition-colors">
                <FileText className="w-5 h-5 text-[#5C5C57]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#252A23] mb-1.5 sm:mb-2">Summarize</h3>
              <p className="text-xs text-[#74786F] leading-relaxed">
                Extract the key points. Turn long reads into a clear, useful
                overview.
              </p>
            </div>

            <div className="mt-8 sm:mt-12 pt-4 sm:pt-5 border-t border-[#F0EFEA]">
              <span className="text-[10px] font-bold tracking-wider text-[#AFB6A7] uppercase block mb-1.5">
                Less scrolling, more signal
              </span>
              <p className="text-xs font-semibold text-[#252A23] mb-2 sm:mb-3">
                The essentials, without the extra.
              </p>
              <span className="text-[11px] text-[#80807A]">
                Meeting notes → Key takeaways
              </span>
            </div>
          </div>

          {/* Card 2: Rewrite */}
          <div
            onClick={() => {
              handleSelectTool("refine");
              const el = document.getElementById("workspace");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white border border-[#E4E6DE] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-[#CDCBC5] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F4F5EF] flex items-center justify-center text-[#373A36] mb-4 sm:mb-5 group-hover:bg-[#F3F4EF] transition-colors">
                <PenTool className="w-5 h-5 text-[#5C5C57]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#252A23] mb-1.5 sm:mb-2">Rewrite</h3>
              <p className="text-xs text-[#74786F] leading-relaxed">
                Improve clarity and flow while keeping what makes your writing
                yours.
              </p>
            </div>

            <div className="mt-8 sm:mt-12 pt-4 sm:pt-5 border-t border-[#F0EFEA]">
              <span className="text-[10px] font-bold tracking-wider text-[#AFB6A7] uppercase block mb-1.5">
                Same idea, better flow
              </span>
              <p className="text-xs font-semibold text-[#252A23] mb-2 sm:mb-3">
                Find the words you meant to use.
              </p>
              <span className="text-[11px] text-[#80807A]">
                Rough draft → Polished copy
              </span>
            </div>
          </div>

          {/* Card 3: Simplify */}
          <div
            onClick={() => {
              handleSelectTool("simplify");
              const el = document.getElementById("workspace");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white border border-[#E4E6DE] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-[#CDCBC5] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F4F5EF] flex items-center justify-center text-[#373A36] mb-4 sm:mb-5 group-hover:bg-[#F3F4EF] transition-colors">
                <Sliders className="w-5 h-5 text-[#5C5C57]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#252A23] mb-1.5 sm:mb-2">Simplify</h3>
              <p className="text-xs text-[#74786F] leading-relaxed">
                Make complex text easier to understand. Keep the meaning, lose the
                jargon.
              </p>
            </div>

            <div className="mt-8 sm:mt-12 pt-4 sm:pt-5 border-t border-[#F0EFEA]">
              <span className="text-[10px] font-bold tracking-wider text-[#AFB6A7] uppercase block mb-1.5">
                Plain words, please
              </span>
              <p className="text-xs font-semibold text-[#252A23] mb-2 sm:mb-3">
                Big ideas. A little less complex.
              </p>
              <span className="text-[11px] text-[#80807A]">
                Technical text → Plain language
              </span>
            </div>
          </div>

          {/* Card 4: Social Post */}
          <div
            onClick={() => {
              handleSelectTool("repurpose");
              const el = document.getElementById("workspace");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white border border-[#E4E6DE] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-[#CDCBC5] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F4F5EF] flex items-center justify-center text-[#373A36] mb-4 sm:mb-5 group-hover:bg-[#F3F4EF] transition-colors">
                <MessageSquare className="w-5 h-5 text-[#5C5C57]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#252A23] mb-1.5 sm:mb-2">Social Post</h3>
              <p className="text-xs text-[#74786F] leading-relaxed">
                Shape your ideas into social-ready content that gets to the point.
              </p>
            </div>

            <div className="mt-8 sm:mt-12 pt-4 sm:pt-5 border-t border-[#F0EFEA]">
              <span className="text-[10px] font-bold tracking-wider text-[#AFB6A7] uppercase block mb-1.5">
                Ready for the feed
              </span>
              <p className="text-xs font-semibold text-[#252A23] mb-2 sm:mb-3">
                From a good idea to a great post.
              </p>
              <span className="text-[11px] text-[#80807A]">
                Draft idea → Social-ready post
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#F3F4EF] scroll-mt-20"
      >
        <div className="mb-10 sm:mb-14">
          <span className="text-xs font-bold tracking-wider text-[#8A8983] uppercase block mb-2 sm:mb-3">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#252A23]">
            From draft to done. Simply.
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#74786F]">
            A straightforward process that keeps you in control.
          </p>
        </div>

        {/* 3 Step Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {/* Step 1 */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E6DE] text-[#8A8983]">
              <span className="text-xs font-semibold">01</span>
              <span className="text-xs">⟷</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#252A23]">Add your text</h3>
            <p className="text-xs sm:text-sm text-[#74786F] leading-relaxed">
              Bring a rough draft, a long article, or an idea that needs a little
              shaping.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E6DE] text-[#8A8983]">
              <span className="text-xs font-semibold">02</span>
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#252A23]">Choose a tool</h3>
            <p className="text-xs sm:text-sm text-[#74786F] leading-relaxed">
              Summarize, rewrite, simplify, or create a social post. You set the
              direction.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E6DE] text-[#8A8983]">
              <span className="text-xs font-semibold">03</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#252A23]">Make it yours</h3>
            <p className="text-xs sm:text-sm text-[#74786F] leading-relaxed">
              Review the result, add your finishing touch, and copy it wherever you
              write.
            </p>
          </div>
        </div>
      </section>

      {/* Dark Value Proposition Section */}
      <section className="bg-[#252A23] text-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8 items-start">
          {/* Left Title Column */}
          <div className="lg:col-span-5">
            <span className="text-[11px] font-bold tracking-wider text-[#AFB6A7] uppercase block mb-3 sm:mb-4">
              Less noise. More clarity.
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              A calmer place to do your best writing.
            </h2>
            <p className="mt-4 sm:mt-6 text-sm text-[#AFB6A7] leading-relaxed max-w-md">
              Thoughtful tools for the everyday work of getting your ideas across.
            </p>
          </div>

          {/* Right Features 2x2 Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-8 sm:gap-y-12">
            {/* Value 1 */}
            <div className="border-t border-[#383E36] pt-5 sm:pt-6 space-y-2 sm:space-y-2.5">
              <span className="text-lg text-[#E0E2DC] block">T</span>
              <h3 className="text-sm font-bold text-white">Clearer writing</h3>
              <p className="text-xs text-[#AFB6A7] leading-relaxed">
                Say what you mean with words that are easier to read and understand.
              </p>
            </div>

            {/* Value 2 */}
            <div className="border-t border-[#383E36] pt-5 sm:pt-6 space-y-2 sm:space-y-2.5">
              <PenTool className="w-4 h-4 text-[#E0E2DC]" />
              <h3 className="text-sm font-bold text-white">Efficient editing</h3>
              <p className="text-xs text-[#AFB6A7] leading-relaxed">
                Spend less time reworking sentences and more time moving ideas
                forward.
              </p>
            </div>

            {/* Value 3 */}
            <div className="border-t border-[#383E36] pt-5 sm:pt-6 space-y-2 sm:space-y-2.5">
              <Clock className="w-4 h-4 text-[#E0E2DC]" />
              <h3 className="text-sm font-bold text-white">Content history</h3>
              <p className="text-xs text-[#AFB6A7] leading-relaxed">
                Return to past results and pick up the ideas worth keeping.
              </p>
            </div>

            {/* Value 4 */}
            <div className="border-t border-[#383E36] pt-5 sm:pt-6 space-y-2 sm:space-y-2.5">
              <Layout className="w-4 h-4 text-[#E0E2DC]" />
              <h3 className="text-sm font-bold text-white">Focused workspace</h3>
              <p className="text-xs text-[#AFB6A7] leading-relaxed">
                Just the text, the tools, and room to think. Nothing getting in the
                way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        <span className="text-[11px] font-bold tracking-wider text-[#8A8983] uppercase block mb-3 sm:mb-4">
          Your next draft starts here
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#252A23] max-w-2xl mx-auto leading-tight">
          Make every draft a little better.
        </h2>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#74786F]">
          Bring your ideas. We&apos;ll help you find the words.
        </p>
        <div className="mt-6 sm:mt-8">
          <Button
            asChild
            className="bg-[#373A36] hover:bg-[#272C27] text-white px-6 sm:px-7 py-5 sm:py-6 rounded-xl font-medium text-sm inline-flex items-center gap-2 group shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#373A36]"
          >
            <Link href="#workspace">
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E4E6DE] bg-[#FAFAF8] py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <Link href="#workspace" className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#373A36] rounded">
            <BrandLogo size="sm" />
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#74786F] font-medium">
            <Link href="#workspace" className="hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#373A36] rounded px-1 py-0.5">
              Product
            </Link>
            <Link href="#features" className="hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#373A36] rounded px-1 py-0.5">
              Features
            </Link>
            <Link href="#signin" className="hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#373A36] rounded px-1 py-0.5">
              Sign In
            </Link>
            <Link href="#privacy" className="hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#373A36] rounded px-1 py-0.5">
              Privacy
            </Link>
            <Link href="#terms" className="hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#373A36] rounded px-1 py-0.5">
              Terms
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#F3F4EF] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-[#9E9E98]">
          <p>© 2026 ContentCraft AI</p>
          <p>A little more clarity. A little more you.</p>
        </div>
      </footer>
    </div>
  );
}
