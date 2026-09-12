"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Props = {
  /** عکس پایه — همیشه دیده می‌شود (نسخه‌ی تاریک) */
  backSrc: string;
  /** عکس رونما — فقط زیر ماسک دیده می‌شود (نسخه‌ی روشن) */
  frontSrc: string;
  alt: string;
  /** قطر ماسک به پیکسل — فقط وقتی maskHeightRatio داده نشده */
  maskSize?: number;
  /** پهنای محو‌شدگی لبه‌ی ماسک به پیکسل — فقط وقتی نسبت داده نشده */
  edgeSoftness?: number;
  /**
   * قطر ماسک به‌نسبت ارتفاع کادر (مثلاً ۰.۸ = ۸۰٪ ارتفاع).
   *
   * چرا نسبی و نه پیکسل ثابت: با object-fit: cover و کادری که نسبتش از
   * تصویر کم‌تر است، تمام ارتفاع تصویر روی ارتفاع کادر می‌افتد. یعنی
   * صورت همیشه کسر ثابتی از ارتفاع کادر است و روی نمایشگر بزرگ‌تر،
   * بزرگ‌تر رندر می‌شود. ماسکِ پیکسلی ثابت آن‌جا نسبتاً آب می‌رود.
   */
  maskHeightRatio?: number;
  /** محوشدگی لبه به‌نسبت ارتفاع کادر */
  edgeSoftnessRatio?: number;
  /** ضریب میان‌یابی هر فریم — کوچک‌تر = تعقیب کندتر و سینماتیک‌تر */
  revealSpeed?: number;
  overlayTint?: string;
  overlayOpacity?: number;
  /** بلر روی عکس پایه */
  imageBlur?: number;
  /** جای سکون ماسک، درصدی از کادر */
  initialX?: number;
  initialY?: number;
  revealOpacity?: number;
  objectPosition?: string;
  sizes?: string;
  className?: string;
};

/**
 * آشکارسازی سینماتیک با ماسک متعقب نشانگر.
 *
 * دو تصویر هم‌تراز روی هم می‌نشینند و یک «عدسی» گرد با لبه‌ی محو، نسخه‌ی
 * روشن را روی نسخه‌ی تاریک باز می‌کند — مثل نوری که روی صورت می‌چرخد.
 *
 * چرا با transform و نه با به‌روزرسانی خودِ mask-image:
 * تغییر متغیری که mask-image به آن وابسته است، هر فریم رنگ‌آمیزی مجدد
 * کل لایه‌ی تمام‌صفحه را لازم می‌کند. این‌جا ماسک ثابت است و فقط عدسی
 * جابه‌جا می‌شود، در حالی که تصویر درونش به همان اندازه در جهت مخالف
 * حرکت می‌کند تا سرِ جای خود بماند. نتیجه فقط transform است، یعنی کار
 * روی کامپوزیتور و بدون repaint.
 *
 * دسترس‌پذیری: با prefers-reduced-motion ماسک در نقطه‌ی سکون ثابت
 * می‌ماند و حلقه‌ی انیمیشن اصلاً اجرا نمی‌شود.
 */
export default function CinematicHoverMaskReveal({
  backSrc,
  frontSrc,
  alt,
  maskSize = 360,
  edgeSoftness = 140,
  maskHeightRatio,
  edgeSoftnessRatio,
  revealSpeed = 0.18,
  overlayTint = "#000000",
  overlayOpacity = 0.12,
  imageBlur = 0,
  initialX = 50,
  initialY = 50,
  revealOpacity = 1,
  objectPosition = "center center",
  sizes = "100vw",
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const lens = lensRef.current;
    const inner = innerRef.current;
    if (!root || !lens || !inner) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // اندازه‌ی ماسک در measure() از ارتفاع کادر حساب می‌شود، پس متغیر است
    let half = maskSize / 2;

    // مختصات مرکز ماسک؛ cur آن‌چه رسم می‌شود، target آن‌چه دنبالش می‌رویم
    const cur = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let raf = 0;
    let size = { w: 0, h: 0 };

    const write = () => {
      const lx = cur.x - half;
      const ly = cur.y - half;
      lens.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      inner.style.transform = `translate3d(${-lx}px, ${-ly}px, 0)`;
    };

    const home = () => {
      target.x = (size.w * initialX) / 100;
      target.y = (size.h * initialY) / 100;
    };

    const tick = () => {
      const dx = target.x - cur.x;
      const dy = target.y - cur.y;
      cur.x += dx * revealSpeed;
      cur.y += dy * revealSpeed;
      write();
      // زیر نیم‌پیکسل دیگر دیدنی نیست؛ حلقه را می‌بندیم تا باتری نسوزد
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        cur.x = target.x;
        cur.y = target.y;
        write();
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!reduced && !raf) raf = requestAnimationFrame(tick);
    };

    // اندازه‌گیری هندسی. عمداً هم فوری صدا زده می‌شود و هم به resize پنجره
    // بسته است و ResizeObserver فقط پشتیبان است: اگر ناظر callback ندهد،
    // لایه‌ی رونما صفر در صفر می‌ماند و افکت بی‌صدا از کار می‌افتد.
    let settled = false;
    const measure = () => {
      const r = root.getBoundingClientRect();
      if (!r.width || !r.height) return;
      size = { w: r.width, h: r.height };
      inner.style.width = `${r.width}px`;
      inner.style.height = `${r.height}px`;

      // ماسک: نسبی اگر نسبت داده شده، وگرنه همان پیکسل ثابت
      const dia = maskHeightRatio ? r.height * maskHeightRatio : maskSize;
      const soft = edgeSoftnessRatio
        ? r.height * edgeSoftnessRatio
        : edgeSoftness;
      half = dia / 2;
      const core = Math.max(0, half - soft);
      const g = `radial-gradient(circle ${half}px at ${half}px ${half}px, #000 0, #000 ${core}px, transparent ${half}px)`;
      lens.style.width = `${dia}px`;
      lens.style.height = `${dia}px`;
      lens.style.setProperty("mask-image", g);
      lens.style.setProperty("-webkit-mask-image", g);
      // نقطه‌ی سکون فقط تا اولین حرکت نشانگر تعقیب می‌شود؛ بعد از آن
      // تغییر اندازه نباید ماسک را از زیر دست کاربر به مرکز برگرداند.
      if (!settled) {
        home();
        cur.x = target.x;
        cur.y = target.y;
        write();
      } else {
        write();
      }
    };

    measure();
    // اگر در نخستین فریم چیدمان هنوز صفر بود، فریم بعد دوباره تلاش کن
    const retry = requestAnimationFrame(measure);

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    window.addEventListener("resize", measure);

    const onMove = (e: PointerEvent) => {
      if (!size.w) measure();
      const r = root.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      settled = true;
      kick();
    };
    const onLeave = () => {
      home();
      kick();
    };

    // نشانگر روی متن‌های رویی هم می‌رود، پس گوش‌دادن روی خودِ کادر کافی
    // نیست: رویدادها را از سطح سند می‌گیریم و با مختصات، داخل‌بودن را
    // خودمان تشخیص می‌دهیم.
    const onDocMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      if (inside) onMove(e);
      else if (settled) onLeave();
    };

    document.addEventListener("pointermove", onDocMove, { passive: true });
    document.addEventListener("pointerdown", onDocMove, { passive: true });
    root.addEventListener("pointercancel", onLeave);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      document.removeEventListener("pointermove", onDocMove);
      document.removeEventListener("pointerdown", onDocMove);
      root.removeEventListener("pointercancel", onLeave);
      cancelAnimationFrame(retry);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [
    maskSize,
    edgeSoftness,
    maskHeightRatio,
    edgeSoftnessRatio,
    revealSpeed,
    initialX,
    initialY,
  ]);

  const core = Math.max(0, maskSize / 2 - edgeSoftness);
  // ماسک ثابت است و فقط همراه عدسی جابه‌جا می‌شود
  const mask = `radial-gradient(circle ${maskSize / 2}px at ${maskSize / 2}px ${
    maskSize / 2
  }px, #000 0, #000 ${core}px, transparent ${maskSize / 2}px)`;

  return (
    <div ref={rootRef} className={className}>
      {/* پایه — نسخه‌ی تاریک */}
      <Image
        alt={alt}
        className="object-cover"
        fill
        preload
        quality={88}
        sizes={sizes}
        src={backSrc}
        style={{
          objectPosition,
          filter: imageBlur ? `blur(${imageBlur}px)` : undefined,
        }}
      />

      {/* عدسی — نسخه‌ی روشن، بریده به ماسک نرم */}
      <div
        ref={lensRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 will-change-transform"
        style={{
          width: maskSize,
          height: maskSize,
          opacity: revealOpacity,
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      >
        {/* ابعاد این لایه در افکت با ResizeObserver ست می‌شود تا با کادر
            بیرونی مو‌به‌مو یکی باشد؛ اگر یکی نباشد، دو تصویر روی هم
            نمی‌افتند و درزِ آشکار دیده می‌شود. */}
        <div ref={innerRef} className="absolute left-0 top-0">
          <Image
            alt=""
            className="object-cover"
            fill
            preload
            quality={88}
            sizes={sizes}
            src={frontSrc}
            style={{ objectPosition }}
          />
        </div>
      </div>

      {/* تینت یکنواخت روی هر دو لایه */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: overlayTint, opacity: overlayOpacity }}
      />
    </div>
  );
}
