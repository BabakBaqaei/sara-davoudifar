"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * لحظه‌ی انتخاب — امضای سایت.
 *
 * تنها بخشِ پین‌شده‌ی سایت است، و عمداً تنها: راهنمای موشن می‌گوید بیش از
 * یک‌دو بخشِ پین‌شده با حسِ اسکرولِ بومی می‌جنگد و روی موبایل آزاردهنده
 * است. پس همه‌ی بولدیِ حرکتی این پروژه در همین یک نقطه خرج می‌شود؛ بقیه‌ی
 * سایت آرام است.
 *
 * چه اتفاقی می‌افتد، در طولِ اسکرول:
 *   ۱. «از این‌جا دو انتخاب داشتم…» می‌مانَد.
 *   ۲. «منتظر بمانم» محو و کم‌رنگ می‌شود — انتخابی که رد شد.
 *   ۳. «عامل باشم» جلو می‌آید.
 *   ۴. خطِ قرمز از راست کشیده می‌شود.
 *   ۵. «انتخاب کردم که عمل کنم.» بزرگ می‌شود.
 *
 * «منتظر بمانم» در حالتِ سکون **خوانا** است و کم‌رنگ‌شدنش کارِ خودِ
 * تایم‌لاین است (به ۰.۳۲ می‌رود). نسخه‌ی اول از پایه کم‌رنگ بود و نسبتِ
 * ۳.۹۲:۱ می‌داد — یعنی اگر انیمیشن اجرا نمی‌شد، متن زیرِ آستانه می‌مانْد.
 *
 * حرکت روی خودِ متن است، ولی *فقط شفافیت و جابه‌جاییِ کوچک* — نه پارالاکس.
 * پارالاکسِ متن خواندن را سخت می‌کند؛ آن فقط روی هاله‌ی تزئینیِ پشت است.
 *
 * قاعده‌ی پروژه: در `prefers-reduced-motion` هیچ‌کدام اجرا نمی‌شود و همه‌ی
 * لایه‌ها در حالتِ نهایی و خوانا رندر می‌شوند — استایلِ پایه همان حالتِ
 * نهایی است و انیمیشن فقط از آن **عقب** شروع می‌کند.
 */
export default function ChoiceMoment() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.from("[data-cm='lead']", { opacity: 0, y: 24, duration: 0.6 })
        .from("[data-cm='wait']", { opacity: 0, y: 20, duration: 0.6 }, 0.15)
        .from("[data-cm='act']", { opacity: 0, y: 20, duration: 0.6 }, 0.3)
        // انتخابی که رد شد، عقب می‌نشیند
        .to("[data-cm='wait']", { opacity: 0.32, scale: 0.97, duration: 0.8 }, 1.1)
        .from("[data-cm='rule']", { scaleX: 0, duration: 0.9 }, 1.3)
        .from("[data-cm='verdict']", { opacity: 0, y: 34, duration: 1 }, 1.5)
        .from("[data-cm='tail']", { opacity: 0, y: 18, duration: 0.8 }, 2)
        // هاله‌ی تزئینی، تنها چیزی که پارالاکس می‌گیرد
        .to("[data-cm='glow']", { yPercent: -12, opacity: 0.75, duration: 3 }, 0);
    }, el);

    // ارتفاعِ پین بعد از رسیدنِ فونت و تصویر عوض می‌شود
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });

    return () => {
      ctx.revert();
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <div
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden py-[clamp(48px,8vh,110px)]"
      ref={root}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10
                   bg-[radial-gradient(ellipse_54%_44%_at_62%_44%,rgba(200,50,74,0.16),transparent_70%)]"
        data-cm="glow"
      />

      <p
        className="text-[clamp(16px,2vw,23px)] leading-[1.9] text-chalk/85"
        data-cm="lead"
      >
        از این‌جا دو انتخاب داشتم…
      </p>

      <div className="mt-[clamp(24px,4vh,52px)] grid gap-4 sm:grid-cols-[1fr_1.15fr]">
        <div
          className="rounded-xl border border-chalk/12 p-[clamp(20px,2.4vw,30px)]"
          data-cm="wait"
        >
          <p className="text-[clamp(17px,2.1vw,25px)] leading-[1.55] text-dust line-through decoration-dust/60 decoration-1">
            منتظر بمانم
          </p>
          <p className="mt-3 text-[13.5px] leading-[1.95] text-dust">
            تا کسی وضعیت را درست کند.
          </p>
        </div>

        <div
          className="rounded-xl border border-rose/45 bg-rose/[0.09] p-[clamp(20px,2.4vw,30px)]"
          data-cm="act"
        >
          <p className="text-[clamp(17px,2.1vw,25px)] font-bold leading-[1.55] text-chalk">
            عامل باشم
          </p>
          <p className="mt-3 text-[13.5px] leading-[1.95] text-dust">
            خودم عاملِ تغییرش باشم.
          </p>
        </div>
      </div>

      <div className="mt-[clamp(32px,5.5vh,76px)]">
        <span
          aria-hidden="true"
          className="block h-px w-full origin-right bg-gradient-to-l from-transparent via-rose/60 to-rose-lit"
          data-cm="rule"
        />
        <p
          className="mt-[clamp(20px,3.5vh,40px)] font-display text-[clamp(30px,7vw,96px)] font-extrabold leading-[1.12] tracking-tight text-chalk"
          data-cm="verdict"
        >
          انتخاب کردم که <em className="not-italic text-rose-lit">عمل کنم.</em>
        </p>
        <p
          className="mt-6 max-w-[46ch] text-[clamp(14.5px,1.45vw,16.5px)] leading-[2.15] text-dust"
          data-cm="tail"
        >
          راهِ دوم را انتخاب کردم و همین یک انتخاب، دوازده سالِ بعدم را ساخت.
        </p>
      </div>
    </div>
  );
}
