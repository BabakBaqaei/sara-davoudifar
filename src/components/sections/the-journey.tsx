"use client";

import Image from "next/image";
import { useState } from "react";
import SectionShell from "@/components/site/section-shell";
import { asset } from "@/lib/asset";

/**
 * مسیر حرفه‌ای — پنج ایستگاه، با عکس.
 *
 * چیدمان از سایتِ تونی رابینز که بابک فرستاد می‌آید: فهرستی از کلمه‌های
 * درشت در یک سو و یک قابِ عکسِ بزرگ در سوی دیگر. آینه شد برای فارسی —
 * تیترها سمتِ راست (جایی که خواندن شروع می‌شود) و عکس سمتِ چپ، دقیقاً
 * همان چیزی که بابک خواست.
 *
 * ── چرا فهرست تعاملی است و نه فقط تزئینی ──
 * نسخه‌ی مرجع یک عکسِ ثابت دارد. این‌جا پنج ایستگاه پنج عکس دارند، پس
 * تعامل یک کارِ واقعی می‌کند: با رفتن روی هر ایستگاه هم عکسش می‌آید و هم
 * اقلامِ زیرمجموعه‌اش باز می‌شود. بی این، تیترهای درشت جا برای اقلام
 * نمی‌گذاشتند و فهرست به همان کارت‌های قبلی برمی‌گشت.
 *
 * چون این یک «افشای اطلاعات» است و نه فقط عوض‌شدنِ یک عکس، هر ایستگاه
 * دکمه‌ی واقعی است با `aria-expanded`، نه یک `li` که فقط `hover` بفهمد:
 * با صفحه‌کلید و روی لمسی هم باید باز شود.
 *
 * دو قیدِ سنجیده:
 *   • **جا رزرو شده.** اقلام `min-h` دارند تا باز و بسته شدنشان کلِ ستون
 *     را بالا و پایین نپراند وقتی نشانگر از روی فهرست رد می‌شود.
 *   • **حالتِ سکون کار می‌کند.** ایستگاهِ اول از ابتدا باز است، پس بی هیچ
 *     تعاملی هم یک عکس و یک مجموعه اقلام دیده می‌شود.
 *
 * فرمت webp است و نه jpg: با خروجیِ ایستا بهینه‌سازِ تصویرِ Next از کار
 * می‌افتد و همین فایل‌ها عیناً سرو می‌شوند، پس خودشان باید سبک باشند.
 * ابعاد دست نخورد — نسبتِ برشِ ۴:۵ آن‌قدر از عرضِ منبع می‌خورَد که
 * کوچک‌کردن، قابِ دسکتاپ را نرم می‌کرد. فقط فرمت عوض شد: ۱۳۳۶KB → ۷۹۶KB.
 *
 * عکس‌ها `aria-hidden`اند و `alt=""` دارند: هر پنج‌تا همزمان در DOMاند و
 * اگر متنِ جایگزین داشتند، خواننده‌ی صفحه هر پنج توضیح را پشتِ سرِ هم
 * می‌خواند در حالی که فقط یکی دیده می‌شود. اطلاعات در خودِ تیترهاست.
 *
 * ── نقطه‌ی کانونیِ عکس‌ها ──
 * `object-position` هر عکس اندازه‌گیری شده، نه حدس: ماسکِ سوژه با rembg
 * گرفته شد و با رابطه‌ی X = 100(S·nw − tw/2)/(nw − tw) برای **کادرِ ۴:۵**
 * حساب شد. قابْ در همه‌ی بریک‌پوینت‌ها ۴:۵ می‌مانَد، چون این عددها فقط
 * برای همین نسبت درست‌اند؛ با کادرِ کشسان هر کدام تا ۲۰ واحد جابه‌جا
 * می‌شدند.
 *
 * ایستگاهِ «بازاریابی شبکه‌ای» عمداً وسط است و هیچ برجستگیِ بصری ندارد:
 * یکی از پنج، نه تیترِ مسیر. بندِ پایانی که همین را با کلمه هم می‌گفت
 * («تعریف‌کننده‌ی کلِ مسیر نیست») به‌خواستِ بابک برداشته شد — خودِ چیدمان
 * آن را می‌گوید. ایستگاهِ جداگانه‌ی «ورزش» هم نیست، چون ورزش فقط باید در
 * «داستان» بیاید.
 */

const STOPS = [
  {
    n: "۰۱",
    fa: "تحصیل و توسعه‌ی فردی",
    items: ["علوم ورزشی", "مدیریت ورزشی", "همایش و سمینار"],
    src: asset("/images/mastermind-hall-1900.webp"),
    pos: "25% 50%",
  },
  {
    n: "۰۲",
    fa: "ورود به کسب‌وکار",
    items: ["شروع با دستِ خالی", "چند حوزه‌ی متفاوت"],
    src: asset("/images/flags-corridor-1400.webp"),
    pos: "62% 50%",
  },
  {
    n: "۰۳",
    fa: "بازاریابی شبکه‌ای",
    items: ["فعالیت حرفه‌ای"],
    src: asset("/images/pmm-anniversary-1400.webp"),
    pos: "49% 50%",
  },
  {
    n: "۰۴",
    fa: "رهبری سازمان",
    items: ["ساخت و رهبری تیم"],
    src: asset("/images/pmm-first-leadership-900.webp"),
    pos: "50% 0%",
  },
  {
    n: "۰۵",
    fa: "مربی‌گری",
    items: ["رشد فردی", "مالی", "حرفه‌ای"],
    src: asset("/images/roundtable-laugh-1100.webp"),
    pos: "20% 50%",
  },
];

export default function TheJourney() {
  const [active, setActive] = useState(0);

  return (
    <SectionShell eyebrow="مسیر حرفه‌ای" id="journey" tone="dark">
      <h2 className="reveal max-w-[24ch] font-display text-[clamp(28px,5vw,64px)] font-extrabold leading-[1.22] tracking-tight text-chalk">
        یک مسیر، <em className="not-italic text-rose-lit">پنج ایستگاه</em>
      </h2>

      <div className="mt-[clamp(40px,7vh,88px)] grid items-start gap-[clamp(32px,5vw,72px)] lg:grid-cols-[1.05fr_0.95fr]">
        {/* در RTL ستونِ اول راست است — تیترها این‌جا، عکس آن‌سو. */}
        <ul className="reveal">
          {STOPS.map((s, i) => {
            const on = i === active;
            return (
              <li className="border-b border-white/10 last:border-b-0" key={s.n}>
                <button
                  aria-controls={`journey-items-${s.n}`}
                  aria-expanded={on}
                  className="group flex w-full items-baseline gap-[clamp(10px,1.6vw,20px)] py-[clamp(14px,2vh,22px)] text-right
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-lit"
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onPointerEnter={() => setActive(i)}
                  type="button"
                >
                  <span
                    className={`font-display text-[12px] font-extrabold tabular-nums transition-colors duration-300 ${
                      on ? "text-rose-lit" : "text-dust"
                    }`}
                  >
                    {s.n}
                  </span>
                  <span
                    className={`font-display text-[clamp(24px,3.4vw,46px)] font-extrabold leading-[1.2] tracking-tight
                                transition-colors duration-300 ${on ? "text-chalk" : "text-chalk/45"}`}
                  >
                    {s.fa}
                  </span>
                </button>

                {/* جا رزرو شده تا باز و بسته شدن ستون را نپراند. */}
                <div
                  className="min-h-[26px] pb-[clamp(10px,1.6vh,18px)] pr-[clamp(26px,3.6vw,48px)]"
                  id={`journey-items-${s.n}`}
                >
                  {on && (
                    <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] leading-[1.85] text-dust">
                      {s.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div
          aria-hidden="true"
          className="reveal relative order-first aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-char-2 lg:order-none lg:sticky lg:top-[96px]"
        >
          {STOPS.map((s, i) => (
            <Image
              alt=""
              className={`object-cover transition-opacity duration-500 ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
              fill
              key={s.src}
              quality={82}
              sizes="(min-width: 1024px) 45vw, 100vw"
              src={s.src}
              style={{ objectPosition: s.pos }}
            />
          ))}
        </div>
      </div>

    </SectionShell>
  );
}
