"use client";

import { useEffect, useRef, useState } from "react";

/**
 * کارت کوچک ویدیو، زیر متن هیرو.
 *
 * ویدیو بی‌صدا و لوپ داخل کارت پخش می‌شود (پیش‌نمایش زنده)، و دکمه‌ی
 * «تماشا» نسخه‌ی کامل را با صدا و کنترل باز می‌کند.
 *
 * پخش با attribute autoPlay شروع می‌شود تا به جاوااسکریپت وابسته نباشد؛
 * ناظر فقط بیرون از کادر متوقفش می‌کند تا CPU و باتری هدر نرود.
 */
export default function HeroVideoCard({ onOpen }: { onOpen: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const el = videoRef.current;
    if (!wrap || !el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let playing = true;

    const decide = (visible: boolean) => {
      if (visible === playing) return;
      playing = visible;
      if (visible) el.play().catch(() => {});
      else if (!el.paused) el.pause();
    };

    const measure = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const shown = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      decide(r.height > 0 && shown / r.height >= 0.3);
    };

    const io = new IntersectionObserver(([e]) => decide(e.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(wrap);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    measure();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="mt-[clamp(26px,4.4vh,48px)]">
      {/* برچسب بالای کارت */}
      <div className="mb-2.5 flex items-center gap-2.5">
        <span className="size-1.5 rounded-full bg-violet-400" />
        <span className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-neutral-300">
          Emeralds Conference · سخنرانی
        </span>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="group relative block w-full max-w-[340px] overflow-hidden rounded-xl border border-white/15 bg-black/40 text-right shadow-2xl backdrop-blur-sm transition-colors duration-300 hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
        aria-label="تماشای ویدیوی سخنرانی"
      >
        <div ref={wrapRef} className="relative aspect-video w-full overflow-hidden">
          <video
            ref={videoRef}
            className={`h-full w-full object-cover transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            poster="/video/hero-loop-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setReady(true)}
            tabIndex={-1}
          >
            <source src="/video/hero-loop.webm" type="video/webm" />
            <source src="/video/hero-loop.mp4" type="video/mp4" />
          </video>

          {/* تیره‌کننده تا دکمه خوانا بماند */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* دکمه‌ی تماشا */}
          <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-neutral-950 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="text-[12px] font-bold">تماشا</span>
          </div>
        </div>
      </button>
    </div>
  );
}
