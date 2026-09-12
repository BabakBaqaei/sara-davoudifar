"use client";

import { useEffect, type RefObject } from "react";

/**
 * ویدیو را بیرون از کادر متوقف می‌کند و در کادر پخش.
 *
 * ویدیویی که دیده نمی‌شود ولی دیکود می‌شود، هم CPU می‌خورد هم باتری.
 *
 * سه لایه تصمیم دارد و دلیلش این است که هیچ‌کدام تنها قابل اعتماد نیست:
 *   ۱. IntersectionObserver — منبع اصلی.
 *   ۲. اندازه‌گیری هندسی روی scroll و resize.
 *   ۳. بازبینی دوره‌ای، فقط وقتی ویدیو متوقف است.
 *
 * لایه‌ی سوم لازم است چون در بعضی محیط‌ها ناظر یک‌بار در mount کار می‌کند
 * و بعد هیچ گذارِ ورود به کادر را خبر نمی‌دهد؛ با تکیه‌ی صرف بر آن، ویدیو
 * برای همیشه متوقف می‌ماند. یک getBoundingClientRect در هر ۸۰۰ms هزینه‌ای
 * ندارد و به‌محض پخش‌شدن قطع می‌شود.
 *
 * حالت پیش‌فرض عمداً «پخش» است و توقف فقط با سیگنالِ واقعیِ منفی رخ می‌دهد،
 * تا بدترین حالتِ افت، رفتار پیش‌فرض HTML باشد (پخش می‌شود، فقط بهینه نیست)
 * نه یک ویدیوی همیشه‌خاموش.
 */
export function useVideoInView(
  wrapRef: RefObject<HTMLElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const el = videoRef.current;
    if (!wrap || !el) return;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.pause();
      return;
    }

    let playing = true;
    let poll = 0;

    const decide = (visible: boolean) => {
      if (visible !== playing) {
        playing = visible;
        if (visible) el.play().catch(() => {});
        else if (!el.paused) el.pause();
      }
      if (!visible && !poll) poll = window.setInterval(measure, 800);
      else if (visible && poll) {
        clearInterval(poll);
        poll = 0;
      }
    };

    const measure = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const shown = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      decide(r.height > 0 && shown > 0);
    };

    const io = new IntersectionObserver(([e]) => decide(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(wrap);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      if (poll) clearInterval(poll);
    };
  }, [wrapRef, videoRef]);
}
