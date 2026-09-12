"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useIsomorphicLayoutEffect, useReducedMotion } from "motion/react";

/**
 * نوارِ نام‌های چرخان.
 *
 * منبع: کامپوننتِ «Logo Marquee» از 21st.dev (@ddoemonn)، با تطبیق برای
 * این پروژه. منطقِ حرکت دست‌نخورده مانده چون خوب نوشته شده:
 *   • با hover و focus می‌ایستد،
 *   • بیرون از کادر با IntersectionObserver خاموش می‌شود،
 *   • و مهم‌تر از همه: در `prefers-reduced-motion` به یک فهرستِ
 *     اسکرول‌شدنیِ ساده تبدیل می‌شود، نه اینکه محتوا را پنهان کند —
 *     همان قاعده‌ای که در این پروژه چند بار شکسته بودیم.
 *
 * چهار چیز عوض شد:
 *   ۱. پالت: خاکستریِ سرد و قابِ سفید رفت؛ حالا شفاف است و رنگ‌ها از
 *      توکن‌های سایت می‌آیند تا روی زمینه‌ی `char` بنشیند.
 *   ۲. آیتم‌ها از لینک به متنِ ساده تغییر کردند: این پنج رویداد آدرسی
 *      ندارند که به آن لینک شود، و لینکِ بی‌مقصد فقط تَبِ خالی
 *      می‌سازد. پس حلقه‌ی فوکوسِ آبیِ اصلی هم موضوعیت ندارد.
 *   ۳. RTL. این یکی ظریف است و اولین بار غلط زدم: ریاضیِ این کامپوننت
 *      فرض می‌کند سرریزِ نوار به **چپِ** مبدأ می‌رود، که فقط در LTR
 *      درست است؛ در ظرفِ راست‌به‌چپ نوار در حالتِ سکون کاملاً از کادر
 *      بیرون می‌افتاد و نوار خالی دیده می‌شد. پس ظرفِ داخلی `dir="ltr"`
 *      شد تا همان ریاضیِ آزموده دست‌نخورده کار کند، و هر برچسب
 *      `dir="auto"` گرفت تا جهتِ خودش را از متنِ خودش بگیرد.
 *      جهتِ حرکت هم `left` است نه `right`: چشمِ فارسی‌خوان از راست شروع
 *      می‌کند، پس نامِ تازه باید از لبه‌ی راست وارد شود.
 *   ۴. محوشدگیِ دو لبه هم‌رنگِ زمینه‌ی بخش شد.
 */

const RAMP = 0.19;
const SETTLE = 0.16;
const MAX_COPIES = 14;

export type MarqueeDirection = "left" | "right";

export type UseLogoMarqueeOptions = {
  speed?: number;
  direction?: MarqueeDirection;
  gap?: number;
  paused?: boolean;
};

function fold(x: number, loop: number) {
  const m = x % loop;
  return m > 0 ? m - loop : m;
}

function clamp(x: number, min: number, max: number) {
  return x < min ? min : x > max ? max : x;
}

export function useLogoMarquee({
  speed = 44,
  direction = "left",
  gap = 40,
  paused = false,
}: UseLogoMarqueeOptions = {}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLUListElement>(null);

  const [copies, setCopies] = useState(4);
  const [held, setHeld] = useState(false);
  const [near, setNear] = useState(false);

  const reduced = useReducedMotion() === true;
  const stopped = held || paused;

  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const movingRef = useRef(false);
  movingRef.current = !stopped && !reduced;

  const offset = useRef(0);
  const nudge = useRef(0);
  const rate = useRef(0);
  const span = useRef(0);

  const paint = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const x = reducedRef.current ? 0 : offset.current - span.current;
    track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
  }, []);

  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current;
    const group = groupRef.current;
    if (!viewport || !group) return;

    const measure = () => {
      const width = group.getBoundingClientRect().width;
      const loop = width > 0 ? width + gap : 0;
      const room = viewport.getBoundingClientRect().width;
      span.current = loop;
      offset.current = loop > 0 ? clamp(offset.current, -loop, loop) : 0;
      paint();

      const next =
        reduced || loop <= 0 ? 4 : clamp(Math.ceil(room / loop) + 3, 4, MAX_COPIES);
      setCopies((prev) => (prev === next ? prev : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(group);
    return () => observer.disconnect();
  }, [gap, paint, reduced]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry) setNear(entry.isIntersecting);
      },
      { rootMargin: "96px" },
    );
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !near) return;

    let frame = 0;
    let last = 0;
    const sign = direction === "right" ? 1 : -1;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      const loop = span.current;
      if (loop <= 0) return;

      rate.current +=
        ((movingRef.current ? 1 : 0) - rate.current) * (1 - Math.exp(-dt / RAMP));

      const pull = nudge.current * (1 - Math.exp(-dt / SETTLE));
      nudge.current -= pull;

      let x = offset.current + sign * speed * rate.current * dt + pull;
      if (rate.current > 0.002 && Math.abs(nudge.current) < 0.25) {
        nudge.current = 0;
        x = fold(x, loop);
      } else {
        x = clamp(x, -loop, loop);
      }

      offset.current = x;
      paint();
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, near, speed, direction, paint]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const pin = () => {
      if (reducedRef.current) return;
      if (viewport.scrollLeft !== 0) viewport.scrollLeft = 0;
      if (viewport.scrollTop !== 0) viewport.scrollTop = 0;
    };
    viewport.addEventListener("scroll", pin, { passive: true });
    return () => viewport.removeEventListener("scroll", pin);
  }, []);

  useEffect(() => {
    const release = () => setHeld(false);
    window.addEventListener("blur", release);
    return () => window.removeEventListener("blur", release);
  }, []);

  const reveal = useCallback((node: HTMLElement) => {
    const viewport = viewportRef.current;
    const loop = span.current;
    if (!viewport || reducedRef.current || loop <= 0) return;
    if (node === viewport) return;

    const view = viewport.getBoundingClientRect();
    const box = node.getBoundingClientRect();
    const pad = 12;

    let delta = 0;
    if (box.left < view.left + pad) delta = view.left + pad - box.left;
    else if (box.right > view.right - pad) delta = view.right - pad - box.right;
    if (delta === 0) return;

    const target = clamp(offset.current + nudge.current + delta, -loop, loop);
    nudge.current = target - offset.current;
  }, []);

  const bind = {
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType !== "touch") setHeld(true);
    },
    onPointerDown: () => setHeld(true),
    onPointerUp: (e: React.PointerEvent) => {
      if (e.pointerType === "touch") setHeld(false);
    },
    onPointerCancel: () => setHeld(false),
    onPointerLeave: () => setHeld(false),
    onFocus: (e: React.FocusEvent) => {
      setHeld(true);
      reveal(e.target as HTMLElement);
    },
    onBlur: () => setHeld(false),
  };

  return { viewportRef, trackRef, groupRef, copies, paused: stopped, reduced, bind };
}

export type MarqueeItem = { id: string; label: string };

export type LogoMarqueeProps = {
  items: MarqueeItem[];
  label: string;
  speed?: number;
  direction?: MarqueeDirection;
  gap?: number;
  className?: string;
};

const FACE =
  "inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-lg px-3 " +
  "text-[clamp(13px,1.35vw,15px)] tracking-[0.04em] text-dust";

export function LogoMarquee({
  items,
  label,
  speed = 34,
  direction = "left",
  gap = 48,
  className = "",
}: LogoMarqueeProps) {
  const { viewportRef, trackRef, groupRef, copies, reduced, bind } = useLogoMarquee({
    speed,
    direction,
    gap,
  });

  const groups = reduced ? 1 : copies;
  const live = reduced ? 0 : 1;

  return (
    <section
      aria-label={label}
      className={`relative isolate w-full min-w-0 max-w-full overflow-hidden ${className}`}
      {...bind}
    >
      <div
        className="overflow-y-hidden py-2 outline-none"
        dir="ltr"
        ref={viewportRef}
        style={{ overflowX: reduced ? "auto" : "hidden" }}
        tabIndex={reduced ? 0 : undefined}
      >
        <div
          className="flex w-max items-center"
          ref={trackRef}
          style={{ gap, willChange: "transform" }}
        >
          {Array.from({ length: groups }, (_, copy) => (
            <ul
              aria-hidden={copy === live ? undefined : true}
              /* ظرف `ltr` است تا ریاضیِ حرکت درست بماند، ولی خودِ فهرست
                 باید راست‌به‌چپ چیده شود: چشمِ فارسی‌خوان از راست شروع
                 می‌کند، پس اولین نام باید راست‌ترین باشد. */
              className="flex w-max flex-row-reverse items-center"
              key={copy}
              ref={copy === live ? groupRef : undefined}
              style={{ gap }}
            >
              {items.map((item) => (
                <li className="shrink-0" key={item.id}>
                  <span className={FACE} dir="auto">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* محوشدگیِ لبه‌ها، هم‌رنگِ زمینه‌ی بخش */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-char to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-char to-transparent"
      />
    </section>
  );
}

export default LogoMarquee;
