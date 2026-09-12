"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO4_LAYERS } from "@/lib/hero4/layers";
import { initHeroIntro, setHeroIntroStart } from "@/lib/hero4/intro";
import { initHeroScroll } from "@/lib/hero4/scroll";
import { initMouseParallax } from "@/lib/hero4/parallax";
import { applyReducedMotion } from "@/lib/hero4/reduced-motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * هیرو نسخه‌ی ۴ — گرافیکِ «ABOUT ME» به‌صورت لایه‌های زنده.
 *
 * همان گرافیکِ هیروی ۲ است، ولی نه به‌عنوان یک تصویرِ تخت: هشت لایه‌ی
 * جدا در DOM که با لود و اسکرول حرکت می‌کنند. ترکیب‌بندیِ مرجع دست
 * نخورده — تایپ بازنویسی نشده، سارا عوض نشده، چیزی از نو کشیده نشده.
 *
 * ── معماریِ سه‌لایه‌ی هر عنصر ──
 *   .l-par  → پارالاکسِ ماوس
 *     .l-scr → تایم‌لاینِ اسکرول
 *       .l-in → تایم‌لاینِ ورود
 * دلیلش در `lib/hero4/parallax.ts` نوشته شده: دو سیستمِ انیمیشن روی یک
 * عنصر، `transform` همدیگر را پاک می‌کنند.
 *
 * ── چرا `<img>` خام و نه `next/image` ──
 * این هشت فایل از قبل دقیقاً در اندازه‌ی لازم و webp ساخته شده‌اند
 * (مجموعاً ۷۱۵KB). عبوردادنشان از بهینه‌سازِ Next فقط یک رمزگذاریِ دوباره
 * است، و `fill` هم روی چیدمانِ تودرتوی بالا قید اضافه می‌گذارد.
 *
 * ── موبایل ──
 * همه‌ی لایه‌ها `contain` می‌شوند و ترکیب‌بندی مثل یک نوار وسطِ کادرِ تیره
 * می‌نشیند. اول زمینه `cover` بود تا نوارِ خالی نماند، ولی رندر نشان داد
 * غلط است: زمینه، تابشِ قرمزِ بلوزِ سارا روی دیوار را در خود دارد و
 * برشِ مرکزی در کادرِ عمودی آن را به یک لکه‌ی قرمزِ بزرگ در پایینِ صفحه
 * تبدیل می‌کرد. رنگِ خودِ بخش به لبه‌ی گرافیک نزدیک است تا درز نخورد.
 */
export default function HeroLayered() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      applyReducedMotion(root);
      return;
    }

    // `scroll-behavior: smooth` روی <html> با scrub تصادم دارد و اسکرول
    // را لرزان می‌کند. تا وقتی این هیرو سوار است خاموشش می‌کنیم.
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const ctx = gsap.context(() => {
      setHeroIntroStart(root);
      const intro = initHeroIntro(root);
      const scroll = initHeroScroll(root);

      // قلابِ آزمون، فقط در توسعه. پنلِ مرورگرِ ابزار، rAF را وقتی پنهان
      // است نگه می‌دارد و تایم‌لاین وسطِ راه می‌ایستد؛ با این دسته می‌شود
      // تایم‌لاین را جای دلخواه برد و حالتِ نهایی را قطعی بررسی کرد.
      if (process.env.NODE_ENV !== "production") {
        (root as unknown as { __hero4?: unknown }).__hero4 = {
          intro,
          scroll,
          // پنل، دستگاهِ لمسی را تقلید می‌کند (`pointer: coarse`) پس شرطِ
          // پارالاکس آن‌جا رد می‌شود؛ با این، منطقش قابل آزمون می‌مانَد.
          forceParallax: () => initMouseParallax(root, 1),
          // rAF در پنل throttle می‌شود و تویین جلو نمی‌رود؛ با این می‌شود
          // دستی تیک زد و مقدارِ نهایی را قطعی خواند.
          tick: (n = 40) => {
            for (let i = 0; i < n; i++) gsap.ticker.tick();
          },
        };
      }
      // پارالاکس فقط با نشانگرِ دقیق. روی لمسی نه: `pointermove` آن‌جا
      // فقط هنگام کشیدن می‌آید و حرکتش پرش‌دار حس می‌شود.
      let disposeParallax: (() => void) | undefined;
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        disposeParallax = initMouseParallax(root, window.innerWidth < 1024 ? 0.5 : 1);
      }
      return () => {
        intro.kill();
        disposeParallax?.();
      };
    }, root);

    // چیدمان بعد از رسیدنِ تصاویر عوض می‌شود (contain/cover)، و ScrollTrigger
    // بلندیِ پین را از همان چیدمان می‌گیرد.
    const imgs = Array.from(root.querySelectorAll("img"));
    let pending = imgs.filter((i) => !i.complete).length;
    const onLoad = () => {
      pending -= 1;
      if (pending <= 0) ScrollTrigger.refresh();
    };
    if (pending > 0) {
      for (const i of imgs) {
        if (!i.complete) {
          i.addEventListener("load", onLoad, { once: true });
          i.addEventListener("error", onLoad, { once: true });
        }
      }
    }

    return () => {
      ctx.revert();
      html.style.scrollBehavior = prevBehavior;
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="درباره‌ی سارا داودی‌فر"
      className="relative h-svh w-full overflow-hidden bg-[#1c1b1d]"
    >
      {HERO4_LAYERS.map((l) => (
        <div
          key={l.key}
          className="pointer-events-none absolute inset-0"
          style={{ zIndex: l.z }}
        >
          {/* ماوس */}
          <div className="absolute inset-0 will-change-transform" data-par={l.key}>
            {/* اسکرول */}
            <div className="absolute inset-0 will-change-transform" data-scr={l.key}>
              {/* ورود */}
              <div className="absolute inset-0 will-change-transform" data-in={l.key}>
                {l.key === "signature" ? (
                  // پرده‌ی چپ‌به‌راست روی خودِ دست‌خط، نه روی جعبه‌ی حرکت
                  <div className="absolute inset-0" data-pen>
                    <LayerImage layer={l} />
                  </div>
                ) : (
                  <LayerImage layer={l} />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function LayerImage({ layer }: { layer: (typeof HERO4_LAYERS)[number] }) {
  // در موبایل همه‌ی لایه‌ها یک‌شکل برش می‌خورند، وگرنه از هم می‌پاشند
  const fit = "object-contain md:object-cover";
  return (
    <img
      alt={layer.alt}
      aria-hidden={layer.alt === "" ? true : undefined}
      className={`absolute inset-0 h-full w-full select-none ${fit}`}
      decoding={layer.critical ? "sync" : "async"}
      draggable={false}
      fetchPriority={layer.critical ? "high" : "low"}
      height={1429}
      src={layer.src}
      width={2560}
    />
  );
}
