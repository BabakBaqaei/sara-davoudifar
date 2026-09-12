"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import CinematicHoverMaskReveal from "@/components/ui/cinematic-hover-mask-reveal";
import { asset } from "@/lib/asset";

/**
 * هیرو — پرتره‌ی سینماتیک با آشکارسازی نوری.
 *
 * سوژه در مرکز کادر می‌ایستد و هر دو طرفش زمینه‌ی قرمز خالی است، پس
 * ستون‌های متن روی خودِ زمینه می‌نشینند و صورت آزاد می‌ماند:
 *   راست (شروعِ RTL) → نام، نقش، جمله‌ی برند، دکمه
 *   چپ              → عمداً خالی؛ صورت این‌جاست
 *
 * نسخه‌ی تاریک پایه است و نشانگر ماوس مثل نور، نسخه‌ی روشن را باز می‌کند.
 */

export default function HeroSplit() {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });

  /* فقط پارالاکسِ اسکرول. زومِ سکون این‌جا نیست — در چیدمانِ کادر است
     (`lg:-inset-[7%]` پایین‌تر) و دلیلش آن‌جا نوشته شده.
     نسبت ۱.۰۵۳ همان ۱.۲/۱.۱۴ نسخه‌ی اول است. */
  const artScale = useTransform(scrollYProgress, [0, 1], [1, 1.053]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={container}
      className="relative min-h-svh overflow-hidden bg-crimson-deep"
      aria-labelledby="hero-title"
    >
      {/* زمینه‌ی رادیال — پشتِ پرتره. روی نمایشگر خیلی پهن که کادر عکس
          تمام عرض را پر نمی‌کند، همین لایه قرمز را ادامه می‌دهد. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_62%_58%_at_50%_42%,var(--color-crimson-lit),var(--color-crimson)_46%,var(--color-crimson-deep)_100%)]"
      />

      {/* پرتره با آشکارسازی.
          ارتفاع در موبایل به یک نوار svh بسته شده و نه به کل بخش: وقتی
          ستون‌ها روی هم می‌چینند بخش بلند می‌شود، و inset-0 کادرِ عکس را
          عمودی می‌کند؛ آن‌وقت object-cover این تصویرِ افقی را چند برابر
          بزرگ می‌کند و از پرتره فقط یک تکه مو می‌ماند.

          `-inset-[7%]` در دسکتاپ زومِ سکون است: کادر ۱.۱۴ برابرِ بخش
          می‌شود و object-cover سارا را همان ۱.۱۴ برابر بزرگ می‌کند، و
          overflow-hidden بخش لبه‌ها را می‌برد. این همان نسبتِ نسخه‌ی اول
          است که یک‌بار به خواستِ بابک زوم‌اوت شد و بعد پس گرفته شد.

          چرا چیدمان و نه transform (که نسخه‌ی اول با scale:1.14 می‌گرفت):
          کامپوننتِ آشکارسازی اندازه‌ی ماسک را از
          `root.getBoundingClientRect()` می‌گیرد، و آن rect بعد از اعمالِ
          transformِ والد است. پس px هایی که روی لنز می‌نویسد یک‌بار دیگر
          هم با همان والد بزرگ می‌شوند: ماسک ۱.۱۴ برابرِ لازم می‌شد و
          نقطه‌ی سکون ~۷۰px زیرِ صورت می‌افتاد. با بزرگ‌کردنِ خودِ کادر،
          rect واقعی است و همه‌ی نسبت‌ها سرِ جای خود می‌مانند. */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[58svh] lg:-inset-[7%] lg:h-auto"
        style={{ scale: artScale }}
      >
        <CinematicHoverMaskReveal
          alt="پرتره‌ی سارا داودی‌فر"
          backSrc={asset("/images/hero-dark-2560.jpg")}
          className="absolute inset-0"
          /* اندازه از خودِ کادر گرفته می‌شود، نه پیکسل ثابت.
             صورت سارا در این جفت از پیشانی (۱۳٪) تا چانه (۶۵٪) یعنی ۵۲٪
             ارتفاع کادر است. با این نسبت‌ها قطر مؤثر ماسک ۱.۰۶ برابر
             ارتفاع صورت می‌شود، پس پیشانی تا چانه کامل زیر نور می‌آید و
             لبه نرم می‌ماند.

             این نسبتِ اولیه است. یک‌بار به زوم‌اوت ۰.۷۴ برده شد
             (۰.۵۰۱/۰.۰۹۳ با مرکز ۵۱٪/۵۵٪) و بعد به‌خواستِ بابک برگشت. */
          edgeSoftnessRatio={0.125}
          frontSrc={asset("/images/hero-lit-2560.jpg")}
          /* نقطه‌ی سکون روی صورت است، نه مرکز هندسی کادر:
             مرکز صورت در ۵۱٪ عرض و ۳۹٪ ارتفاع می‌افتد. */
          initialX={51}
          initialY={39}
          maskHeightRatio={0.676}
          objectPosition="center center"
          overlayOpacity={0.12}
          overlayTint="#000000"
          revealSpeed={0.18}
          sizes="100vw"
        />
      </motion.div>

      {/* وینیت افقی — دو لبه را می‌نشاند تا ستون‌های متن بخوانند. فقط از
          lg به بالا، چون در موبایل ستونی نیست که کنارِ صورت بنشیند.
          جهت‌ها فیزیکی نوشته شده‌اند: در RTL محور منطقی برعکس می‌شود و
          وینیت باید همان‌جا بماند که هست. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block
                   bg-[linear-gradient(to_right,rgba(12,1,4,0.82)_0%,rgba(12,1,4,0.22)_26%,transparent_42%,transparent_58%,rgba(12,1,4,0.22)_74%,rgba(12,1,4,0.82)_100%)]"
      />

      {/* محوشدن نوار پرتره در زمینه — موبایل. ارتفاعش با نوار یکی است تا
          درصدهای گرادیان به همان نوار حساب شوند، نه به کل بخش. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[58svh] lg:hidden
                   bg-[linear-gradient(to_bottom,rgba(12,1,4,0.45)_0%,transparent_26%,transparent_58%,var(--color-crimson-deep)_100%)]"
      />

      {/* وینیت عمودی — دسکتاپ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block
                   bg-[linear-gradient(to_bottom,rgba(12,1,4,0.55)_0%,transparent_22%,transparent_62%,rgba(12,1,4,0.9)_100%)]"
      />

      {/* ── محتوا ── */}
      <motion.div
        className="relative mx-auto grid min-h-svh max-w-[1600px] items-stretch gap-x-8
                   px-[clamp(20px,4vw,64px)] pb-[clamp(48px,8vh,132px)]
                   pt-[52svh] lg:pt-[clamp(80px,11vh,132px)]
                   lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        {/* ستون راست (شروعِ RTL) — معرفی، جمله، دکمه */}
        <div className="flex flex-col justify-between gap-10">
          <div>
            <h1
              id="hero-title"
              className="font-display text-[clamp(40px,5.6vw,84px)] font-extrabold leading-[1.1] tracking-tight text-paper
                         [text-shadow:0_2px_36px_rgba(0,0,0,0.7)]"
            >
              سارا داودی‌فر
            </h1>

            <p className="mt-[clamp(10px,1.6vh,20px)] text-[clamp(11px,1vw,13.5px)] tracking-[0.26em] text-paper/65">
              کارآفرین · مربی · رهبر سازمان
            </p>
          </div>

          <div>
            <p className="text-[clamp(15px,1.5vw,20px)] leading-[1.95] text-paper/90 [text-shadow:0_1px_20px_rgba(0,0,0,0.75)]">
              <span className="block">انضباط را از ورزش آوردم.</span>
              <span className="block">به کسب‌وکار سپردم.</span>
              <span className="block">
                حالا به{" "}
                <em className="font-bold not-italic text-paper">آدم‌ها</em>{" "}
                می‌سپارم.
              </span>
            </p>

            <a
              href="#contact"
              className="group mt-[clamp(22px,3.6vh,40px)] inline-flex items-center gap-3 rounded-full bg-paper px-6 py-3
                         text-[13px] font-bold text-crimson-deep transition-transform duration-300
                         hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              شروع گفت‌وگو
              {/* فلش به چپ، چون مسیر خواندن RTL به چپ می‌رود */}
              <svg
                aria-hidden="true"
                className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M19 12H5m0 0 6-6m-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* ستون چپ — عمداً خالی: این‌جا صورت است */}
        <div aria-hidden="true" className="hidden lg:block" />
      </motion.div>

    </section>
  );
}
