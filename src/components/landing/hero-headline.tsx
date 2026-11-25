"use client";

import * as React from "react";

const HERO_TEXT = "Your ideas, better expressed.";

// Cycle timing (ms): form → hold → disperse → hidden → repeat
const CYCLE_MS = 2600;
const FORM_MS = 700;    // type-in window
const HOLD_MS = 900;    // fully readable
const DISPERSE_MS = 700; // fly-apart window

export function KineticHeroHeadline() {
  const [phase, setPhase] = React.useState<"dispersed" | "forming" | "holding" | "dispersing">("dispersed");

  React.useEffect(() => {
    let t: NodeJS.Timeout;

    const loop = () => {
      setPhase("forming"); // characters type in, staggered
      t = setTimeout(() => setPhase("holding"), FORM_MS); // hold readable
      t = setTimeout(() => setPhase("dispersing"), FORM_MS + HOLD_MS); // fly apart
      t = setTimeout(() => setPhase("dispersed"), FORM_MS + HOLD_MS + DISPERSE_MS); // rest hidden
      t = setTimeout(loop, CYCLE_MS); // re-form
    };

    loop();

    return () => clearTimeout(t);
  }, []);

  return (
    <h1
      className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#252A23] max-w-4xl mx-auto leading-[1.12]"
      aria-label="Your ideas, better expressed."
    >
      {HERO_TEXT.split("").map((char, i) => {
        const isSpace = char === " ";

        const base =
          "inline-block transition-all ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:rotate-0 motion-reduce:translate-x-0 motion-reduce:transition-none";

        let phaseClass = "";
        let delayClass = "";

        if (phase === "dispersed") {
          phaseClass = "opacity-0 translate-y-[-0.5em] scale-[0.55] rotate-[4deg] translate-x-0";
        } else if (phase === "forming") {
          // Type-in: fade up from below, staggered per character
          phaseClass = "opacity-100 translate-y-0 scale-100 rotate-0 translate-x-0";
          delayClass = `delay-[${i * 45}ms] duration-[500ms]`;
        } else if (phase === "holding") {
          phaseClass = "opacity-100 translate-y-0 scale-100 rotate-0 translate-x-0";
        } else if (phase === "dispersing") {
          // Disperse: scale down, rotate, drift up & outward, staggered
          const xDrift = i % 2 === 0 ? "translate-x-[0.25em]" : "translate-x-[-0.25em]";
          phaseClass = `opacity-0 translate-y-[-0.55em] scale-[0.5] rotate-[6deg] ${xDrift}`;
          delayClass = `delay-[${i * 35}ms] duration-[550ms]`;
        }

        return (
          <span
            key={i}
            className={`${base} ${phaseClass} ${delayClass}`}
          >
            {isSpace ? "\u00A0" : char}
          </span>
        );
      })}
    </h1>
  );
}
