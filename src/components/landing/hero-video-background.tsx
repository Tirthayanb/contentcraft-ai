"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface HeroVideoBackgroundProps {
  prefersReducedMotion: boolean;
  className?: string;
}

/**
 * Cinematic, full-bleed hero video background.
 *
 * Renders an autoplaying, muted, looping, inline video that covers the hero
 * edge to edge with no player chrome. A static poster is shown while loading
 * and when the user prefers reduced motion. A subtle gradient overlay keeps
 * hero copy readable, and a scroll-driven fade blends the video into the page
 * background color as the user scrolls into the following section.
 */
export function HeroVideoBackground({
  prefersReducedMotion,
  className,
}: HeroVideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const vh = window.innerHeight;
    const { top } = el.getBoundingClientRect();
    const h = el.offsetHeight;
    // 0 when the container's top edge reaches the viewport bottom,
    // 1 when the container has fully scrolled past the viewport top.
    const progress = Math.max(0, Math.min(1, (vh - top) / (vh + h)));
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafRef.current = requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion) {
      video.pause();
    } else {
      video.play().catch(() => {
        // Autoplay may be blocked (e.g., iOS Low Power Mode / data saver).
        // The poster frame remains visible as a graceful fallback.
      });
    }
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={["absolute inset-0 overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Full-bleed ambient video — no chrome, no controls, fills the hero edge to edge. */}
      <div className="absolute inset-0 z-0">
        {!prefersReducedMotion ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/design-assets/artwork/caustic-glass-artwork.jpeg"
            className="w-full h-full object-cover object-center"
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
            disableRemotePlayback
          >
            <source
              src="/video-assets/Woman_working_on_laptop_94b636d0.mp4"
              type="video/mp4"
            />
          </video>
        ) : (
          // Reduced motion: show a static poster frame instead of playback.
          <Image
            src="/design-assets/artwork/caustic-glass-artwork.jpeg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        )}
      </div>

      {/* Subtle, elegant contrast overlay — keeps copy readable while footage still shows through. */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#FAFAF8]/45 via-[#FAFAF8]/12 to-transparent pointer-events-none" />

      {/* Scroll-driven fade: video -> page background color as the user scrolls into the next section. */}
      <div
        className="absolute inset-0 z-20 pointer-events-none bg-[#FAFAF8]"
        style={{ opacity: scrollProgress }}
      />
    </div>
  );
}
