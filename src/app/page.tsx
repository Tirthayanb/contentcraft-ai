"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  PenTool,
  Sliders,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Layers,
  Clock,
  Layout,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ToolType = "summarize" | "rewrite" | "simplify" | "social";

interface ToolContent {
  label: string;
  badge: string;
  inputText: string;
  inputNote: string;
  summaryTitle: string;
  summaryPoints: string[];
  footerTag: string;
}

const TOOL_DATA: Record<ToolType, ToolContent> = {
  summarize: {
    label: "Summarize",
    badge: "Team update",
    inputText:
      "We're introducing a weekly planning session to help our team stay aligned. Every Monday, we'll spend 20 minutes reviewing priorities, identifying blockers, and agreeing on next steps. Please add your updates to the shared document before the meeting so we can focus on decisions rather than status reports. We'll try this format for four weeks, then gather feedback and adjust.",
    inputNote: "Paste it. Refine it.",
    summaryTitle: "A more focused start to the week.",
    summaryPoints: [
      "Meet every Monday for 20 minutes to align priorities, discuss blockers, and decide next steps.",
      "Add updates to the shared document beforehand to keep meetings decision-focused.",
      "Trial the format for four weeks, then use team feedback to improve it.",
    ],
    footerTag: "Summarize · Key points",
  },
  rewrite: {
    label: "Rewrite",
    badge: "Polish draft",
    inputText:
      "Our squad is kicking off a weekly sync so everybody is on the same page. On Mondays for 20 mins, we check what to do first, see what's stuck, and lock in the next plan. Make sure you write your notes into the shared doc before we start so we don't waste time on updates.",
    inputNote: "Same idea, better flow.",
    summaryTitle: "A clear, compelling revision.",
    summaryPoints: [
      "Keep everyone synchronized with a disciplined 20-minute Monday kickoff.",
      "Shift the conversation from passive reporting to active decision-making.",
      "Iterate on feedback after the first month to fine-tune the cadence.",
    ],
    footerTag: "Rewrite · Polished copy",
  },
  simplify: {
    label: "Simplify",
    badge: "Plain language",
    inputText:
      "To optimize organizational synergy and streamline operational velocity, we are instituting a synchronous recurring weekly rendezvous. Team constituents must asynchronously populate the collaborative artifact prior to convening.",
    inputNote: "Plain words, please.",
    summaryTitle: "Clear, direct, and jargon-free.",
    summaryPoints: [
      "We're starting a quick weekly team meeting every Monday.",
      "It will last 20 minutes to review goals and solve problems together.",
      "Write your notes in the shared doc before we meet.",
    ],
    footerTag: "Simplify · Plain language",
  },
  social: {
    label: "Social Post",
    badge: "Audience ready",
    inputText:
      "We cut our status meetings down from an hour to a 20-minute weekly alignment session. Everyone adds notes before we meet, and we only talk about decisions and blockers. Productivity and team morale are noticeably higher.",
    inputNote: "Ready for the feed.",
    summaryTitle: "Ready-to-publish social update.",
    summaryPoints: [
      "Ditch 60-minute status meetings. Try a focused 20-minute decision sync instead.",
      "Read beforehand, align on blockers during the call, and execute faster.",
      "Great teams protect focus time. Less meeting fatigue, more impact.",
    ],
    footerTag: "Social Post · Social-ready post",
  },
};

function LogoIcon() {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2B2D2A] text-white">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6h16M4 12h10M4 18h16" />
        <circle cx="18" cy="12" r="2" />
      </svg>
    </div>
  );
}

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolType>("summarize");
  const [inputText, setInputText] = useState<string>(TOOL_DATA.summarize.inputText);
  const [outputData, setOutputData] = useState<{
    title: string;
    points: string[];
    footerTag: string;
  }>({
    title: TOOL_DATA.summarize.summaryTitle,
    points: TOOL_DATA.summarize.summaryPoints,
    footerTag: TOOL_DATA.summarize.footerTag,
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectTool = (tool: ToolType) => {
    setActiveTool(tool);
    const data = TOOL_DATA[tool];
    setInputText(data.inputText);
    setOutputData({
      title: data.summaryTitle,
      points: data.summaryPoints,
      footerTag: data.footerTag,
    });
    setCopied(false);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setCopied(false);
    setTimeout(() => {
      const data = TOOL_DATA[activeTool];
      // Deterministically format output based on current input text or tool default
      const trimmed = inputText.trim();
      if (!trimmed) {
        setOutputData({
          title: "Please add your text to begin.",
          points: [
            "Paste or write a rough draft into the editor on the left.",
            "Choose a tool from the tabs above to transform your copy.",
            "Click Generate to see your structured preview here.",
          ],
          footerTag: `${data.label} · Ready`,
        });
      } else {
        setOutputData({
          title: data.summaryTitle,
          points: data.summaryPoints,
          footerTag: data.footerTag,
        });
      }
      setIsGenerating(false);
    }, 450);
  };

  const handleCopy = async () => {
    const textToCopy = `${outputData.title}\n\n${outputData.points.map((p) => `• ${p}`).join("\n")}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      }
    } catch {
      // Fallback if clipboard API is restricted
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] font-sans selection:bg-neutral-200 scroll-smooth">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[#FAFAF8]/90 backdrop-blur-sm border-b border-[#E7E5E0]">
        <div className="max-w-6xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="#workspace" className="flex items-center gap-3 group">
            <LogoIcon />
            <span className="font-semibold text-lg tracking-tight text-[#1A1A1A]">
              ContentCraft AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B6B66]">
            <Link href="#workspace" className="hover:text-black transition-colors">
              Product
            </Link>
            <Link href="#features" className="hover:text-black transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-black transition-colors">
              How It Works
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              asChild
              className="bg-[#2B2D2A] hover:bg-black text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-sm transition-all"
            >
              <Link href="#workspace">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Links */}
        <div className="flex md:hidden items-center justify-around py-2.5 px-4 border-t border-[#E7E5E0]/60 text-xs font-medium text-[#6B6B66]">
          <Link href="#workspace" className="hover:text-black">
            Product
          </Link>
          <Link href="#features" className="hover:text-black">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-black">
            How It Works
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEFED] text-[#6B6B66] text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3C3E3A]" />
          A little clarity goes a long way
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1A1A1A] max-w-4xl mx-auto leading-[1.12]">
          Your ideas, better expressed.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-[#6B6B66] max-w-xl mx-auto font-normal leading-relaxed">
          Summarize, rewrite, simplify, and create content with a toolkit
          designed to help you write with clarity.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto sm:max-w-none">
          <Button
            asChild
            className="w-full sm:w-auto bg-[#2B2D2A] hover:bg-black text-white px-6 py-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 group shadow-sm"
          >
            <Link href="#workspace">
              Try ContentCraft
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-[#DCDAD5] bg-white hover:bg-[#F5F5F3] text-[#2B2D2A] px-6 py-6 rounded-xl font-medium text-sm shadow-none"
          >
            <Link href="#features">Explore Features</Link>
          </Button>
        </div>

        {/* Interactive / Visual Workspace Preview */}
        <div id="workspace" className="mt-14 max-w-4xl mx-auto text-left scroll-mt-28">
          <div className="bg-white rounded-2xl border border-[#E7E5E0] shadow-sm overflow-hidden p-4 sm:p-7">
            {/* Workspace Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EFEA] mb-5">
              <span className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">
                The writing workspace
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-[#A09F99] uppercase">
                Interactive Preview
              </span>
            </div>

            {/* Tool Selection Tabs */}
            <div className="bg-[#F5F5F3] p-1.5 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-1 mb-6 text-xs font-medium text-[#6B6B66]">
              <button
                type="button"
                onClick={() => handleSelectTool("summarize")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                  activeTool === "summarize"
                    ? "bg-white text-[#1A1A1A] font-semibold shadow-xs"
                    : "hover:text-[#1A1A1A]"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Summarize
              </button>
              <button
                type="button"
                onClick={() => handleSelectTool("rewrite")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                  activeTool === "rewrite"
                    ? "bg-white text-[#1A1A1A] font-semibold shadow-xs"
                    : "hover:text-[#1A1A1A]"
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                Rewrite
              </button>
              <button
                type="button"
                onClick={() => handleSelectTool("simplify")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                  activeTool === "simplify"
                    ? "bg-white text-[#1A1A1A] font-semibold shadow-xs"
                    : "hover:text-[#1A1A1A]"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Simplify
              </button>
              <button
                type="button"
                onClick={() => handleSelectTool("social")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                  activeTool === "social"
                    ? "bg-white text-[#1A1A1A] font-semibold shadow-xs"
                    : "hover:text-[#1A1A1A]"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Social Post
              </button>
            </div>

            {/* Split Workspace Editor & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Box: Your text */}
              <div className="border border-[#EBEAE5] rounded-xl p-5 flex flex-col justify-between min-h-[300px] bg-white">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-[#1A1A1A]">
                      Your text
                    </span>
                    <span className="text-[11px] text-[#A09F99]">
                      {TOOL_DATA[activeTool].badge}
                    </span>
                  </div>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={7}
                    className="w-full text-xs leading-relaxed text-[#4A4B46] resize-none border-none outline-none focus:ring-0 p-0 bg-transparent"
                    placeholder="Enter or paste your text here..."
                  />
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#F5F5F3] mt-6">
                  <span className="text-[11px] text-[#A09F99]">
                    {TOOL_DATA[activeTool].inputNote}
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 bg-[#2B2D2A] hover:bg-black text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-75 cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        Processing
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

              {/* Right Box: Your summary */}
              <div className="border border-[#E2E8DF] bg-[#F3F6F2] rounded-xl p-5 flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A]">
                      <Sparkles className="w-3.5 h-3.5 text-[#2B2D2A]" />
                      Your summary
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-[11px] text-[#6B6B66] hover:text-black transition-colors font-medium cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-xs font-semibold text-[#1A1A1A] mb-3">
                    {outputData.title}
                  </h3>

                  <ul className="space-y-3 text-xs text-[#3E403C]">
                    {outputData.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#3E403C] mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#E2E8DF] text-[11px] text-[#7A7E76] mt-6">
                  {outputData.footerTag}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-[#9E9E98]">
            One draft. Four ways forward. Your voice, always.
          </p>
        </div>
      </section>

      {/* The Toolkit Section */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto border-t border-[#EFEFED] scroll-mt-20">
        <div className="mb-12">
          <span className="text-xs font-bold tracking-wider text-[#8A8983] uppercase block mb-3">
            The Toolkit
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A]">
            Good writing, less friction.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B6B66]">
            Four focused tools. Whatever your draft needs next.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Summarize */}
          <div
            onClick={() => {
              handleSelectTool("summarize");
              const el = document.getElementById("workspace");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white border border-[#E7E5E0] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-[#CDCBC5] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F4F4F2] flex items-center justify-center text-[#2B2D2A] mb-5 group-hover:bg-[#EFEFED] transition-colors">
                <FileText className="w-5 h-5 text-[#5C5C57]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Summarize</h3>
              <p className="text-xs text-[#6B6B66] leading-relaxed">
                Extract the key points. Turn long reads into a clear, useful
                overview.
              </p>
            </div>

            <div className="mt-12 pt-5 border-t border-[#F0EFEA]">
              <span className="text-[10px] font-bold tracking-wider text-[#A09F99] uppercase block mb-1.5">
                Less scrolling, more signal
              </span>
              <p className="text-xs font-semibold text-[#1A1A1A] mb-3">
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
              handleSelectTool("rewrite");
              const el = document.getElementById("workspace");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white border border-[#E7E5E0] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-[#CDCBC5] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F4F4F2] flex items-center justify-center text-[#2B2D2A] mb-5 group-hover:bg-[#EFEFED] transition-colors">
                <PenTool className="w-5 h-5 text-[#5C5C57]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Rewrite</h3>
              <p className="text-xs text-[#6B6B66] leading-relaxed">
                Improve clarity and flow while keeping what makes your writing
                yours.
              </p>
            </div>

            <div className="mt-12 pt-5 border-t border-[#F0EFEA]">
              <span className="text-[10px] font-bold tracking-wider text-[#A09F99] uppercase block mb-1.5">
                Same idea, better flow
              </span>
              <p className="text-xs font-semibold text-[#1A1A1A] mb-3">
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
            className="bg-white border border-[#E7E5E0] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-[#CDCBC5] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F4F4F2] flex items-center justify-center text-[#2B2D2A] mb-5 group-hover:bg-[#EFEFED] transition-colors">
                <Sliders className="w-5 h-5 text-[#5C5C57]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Simplify</h3>
              <p className="text-xs text-[#6B6B66] leading-relaxed">
                Make complex text easier to understand. Keep the meaning, lose the
                jargon.
              </p>
            </div>

            <div className="mt-12 pt-5 border-t border-[#F0EFEA]">
              <span className="text-[10px] font-bold tracking-wider text-[#A09F99] uppercase block mb-1.5">
                Plain words, please
              </span>
              <p className="text-xs font-semibold text-[#1A1A1A] mb-3">
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
              handleSelectTool("social");
              const el = document.getElementById("workspace");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white border border-[#E7E5E0] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-[#CDCBC5] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F4F4F2] flex items-center justify-center text-[#2B2D2A] mb-5 group-hover:bg-[#EFEFED] transition-colors">
                <MessageSquare className="w-5 h-5 text-[#5C5C57]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Social Post</h3>
              <p className="text-xs text-[#6B6B66] leading-relaxed">
                Shape your ideas into social-ready content that gets to the point.
              </p>
            </div>

            <div className="mt-12 pt-5 border-t border-[#F0EFEA]">
              <span className="text-[10px] font-bold tracking-wider text-[#A09F99] uppercase block mb-1.5">
                Ready for the feed
              </span>
              <p className="text-xs font-semibold text-[#1A1A1A] mb-3">
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
      <section id="how-it-works" className="py-20 px-6 max-w-6xl mx-auto border-t border-[#EFEFED] scroll-mt-20">
        <div className="mb-14">
          <span className="text-xs font-bold tracking-wider text-[#8A8983] uppercase block mb-3">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A]">
            From draft to done. Simply.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B6B66]">
            A straightforward process that keeps you in control.
          </p>
        </div>

        {/* 3 Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Step 1 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E0] text-[#8A8983]">
              <span className="text-xs font-semibold">01</span>
              <span className="text-xs">⟷</span>
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">Add your text</h3>
            <p className="text-xs sm:text-sm text-[#6B6B66] leading-relaxed">
              Bring a rough draft, a long article, or an idea that needs a little
              shaping.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E0] text-[#8A8983]">
              <span className="text-xs font-semibold">02</span>
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">Choose a tool</h3>
            <p className="text-xs sm:text-sm text-[#6B6B66] leading-relaxed">
              Summarize, rewrite, simplify, or create a social post. You set the
              direction.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E0] text-[#8A8983]">
              <span className="text-xs font-semibold">03</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">Make it yours</h3>
            <p className="text-xs sm:text-sm text-[#6B6B66] leading-relaxed">
              Review the result, add your finishing touch, and copy it wherever you
              write.
            </p>
          </div>
        </div>
      </section>

      {/* Dark Value Proposition Section */}
      <section className="bg-[#242623] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left Title Column */}
          <div className="lg:col-span-5">
            <span className="text-[11px] font-bold tracking-wider text-[#A0A29D] uppercase block mb-4">
              Less noise. More clarity.
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              A calmer place to do your best writing.
            </h2>
            <p className="mt-6 text-sm text-[#A0A29D] leading-relaxed max-w-md">
              Thoughtful tools for the everyday work of getting your ideas across.
            </p>
          </div>

          {/* Right Features 2x2 Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
            {/* Value 1 */}
            <div className="border-t border-[#3B3D39] pt-6 space-y-2.5">
              <span className="text-lg text-[#E0E2DC] block">T</span>
              <h3 className="text-sm font-bold text-white">Clearer writing</h3>
              <p className="text-xs text-[#A0A29D] leading-relaxed">
                Say what you mean with words that are easier to read and understand.
              </p>
            </div>

            {/* Value 2 */}
            <div className="border-t border-[#3B3D39] pt-6 space-y-2.5">
              <PenTool className="w-4 h-4 text-[#E0E2DC]" />
              <h3 className="text-sm font-bold text-white">Efficient editing</h3>
              <p className="text-xs text-[#A0A29D] leading-relaxed">
                Spend less time reworking sentences and more time moving ideas
                forward.
              </p>
            </div>

            {/* Value 3 */}
            <div className="border-t border-[#3B3D39] pt-6 space-y-2.5">
              <Clock className="w-4 h-4 text-[#E0E2DC]" />
              <h3 className="text-sm font-bold text-white">Content history</h3>
              <p className="text-xs text-[#A0A29D] leading-relaxed">
                Return to past results and pick up the ideas worth keeping.
              </p>
            </div>

            {/* Value 4 */}
            <div className="border-t border-[#3B3D39] pt-6 space-y-2.5">
              <Layout className="w-4 h-4 text-[#E0E2DC]" />
              <h3 className="text-sm font-bold text-white">Focused workspace</h3>
              <p className="text-xs text-[#A0A29D] leading-relaxed">
                Just the text, the tools, and room to think. Nothing getting in the
                way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <span className="text-[11px] font-bold tracking-wider text-[#8A8983] uppercase block mb-4">
          Your next draft starts here
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1A1A1A] max-w-2xl mx-auto leading-tight">
          Make every draft a little better.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#6B6B66]">
          Bring your ideas. We&apos;ll help you find the words.
        </p>
        <div className="mt-8">
          <Button
            asChild
            className="bg-[#2B2D2A] hover:bg-black text-white px-7 py-6 rounded-xl font-medium text-sm inline-flex items-center gap-2 group shadow-sm"
          >
            <Link href="#workspace">
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E7E5E0] bg-[#FAFAF8] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="#workspace" className="flex items-center gap-3 group">
            <LogoIcon />
            <span className="font-semibold text-base tracking-tight text-[#1A1A1A]">
              ContentCraft AI
            </span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#6B6B66] font-medium">
            <Link href="#workspace" className="hover:text-black transition-colors">
              Product
            </Link>
            <Link href="#features" className="hover:text-black transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-black transition-colors">
              How It Works
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-[#EFEFED] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9E9E98]">
          <p>© 2026 ContentCraft AI</p>
          <p>A little more clarity. A little more you.</p>
        </div>
      </footer>
    </div>
  );
}
