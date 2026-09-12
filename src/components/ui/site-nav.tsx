"use client";

import { useEffect, useRef, useState } from "react";

/**
 * چهار لنگر از شانزده بخش. نوار فهرستِ سایت نیست، مسیرِ میان‌بر است:
 * داستان (قلبِ روایت)، مسیر (وسعتِ کار)، تأثیر (شاهد)، همکاری (کنش).
 * بیشتر از این، در فارسی نوار را شلوغ می‌کند.
 */
const LINKS = [
  { label: "داستان", href: "#story" },
  { label: "مسیر", href: "#journey" },
  /* «تأثیر» رفت چون بخشِ «شاهد» از سایت برداشته شد و لینک به لنگرِ
     ناموجود، کاربر را به ته صفحه می‌پراند. */
  { label: "روش", href: "#method" },
  { label: "همکاری", href: "#collaborate" },
];

const CTA = { label: "شروع مسیر", href: "#contact" };

type Props = {
  /**
   * رنگِ بالای هیرو. هیروی ویدیویی زمینه‌ی کرِم دارد و متنِ سفید روی آن
   * ناپدید می‌شود؛ بقیه‌ی هیروها تیره‌اند. این را رجیستری تعیین می‌کند،
   * حدس زده نمی‌شود.
   */
  tone?: "onLight" | "onDark";
};

/**
 * نوارِ بالای سایت — ثابت، روی همه‌ی بخش‌ها.
 *
 * ساختار و تعاملش از سایتِ نمونه‌ی Mainframe آمده: نشانِ برند در ابتدای
 * خط، لینک‌های میانی با ویرگول، دعوتِ زیرخط‌دار در انتها، و در موبایل
 * همبرگری که به ضربدر تبدیل می‌شود و یک پرده‌ی تمام‌صفحه‌ی تار می‌آورد.
 *
 * سه چیز عمداً مثل نمونه نشد:
 *
 * ۱) **فونت.** نمونه دو فونتِ Helvetica Now را از CDN می‌آورد. این سایت
 *    فارسی است و قاعده‌ی پروژه «همه‌جا پیدا» است — پیدا نیم‌فاصله دارد و
 *    Helvetica هیچ گلیفِ فارسی ندارد. پس فونت عوض نشد.
 *
 * ۲) **آینه‌ی RTL.** در نمونه نشان چپ است و دعوت راست. این‌جا محورِ
 *    منطقی برعکس می‌شود: نشان اولین فرزند است و در RTL به راست می‌رود،
 *    دعوت آخرین است و به چپ. `justify-between` خودش این را درست می‌کند —
 *    ولی `items-start` در پرده‌ی موبایل «راست» است، نه چپ.
 *
 * ۳) **اندازه‌ی قلم.** نمونه لینک‌ها را ۲۳px و نشان را ۲۶px می‌گذارد.
 *    گلیف‌های فارسیِ پیدا در همان اندازه بزرگ‌تر دیده می‌شوند و نوار
 *    شلوغ می‌شد، پس نسبت حفظ شد و مقیاس کمی پایین آمد.
 */
export default function SiteNav({ tone = "onDark" }: Props) {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // بالای هیرو رنگ از `tone` می‌آید؛ پایین‌ترش همه‌ی بخش‌ها تیره‌اند پس
  // نوار همیشه روشن می‌شود.
  const onLight = tone === "onLight" && !pastHero;

  useEffect(() => {
    // اندازه‌گیریِ مستقیمِ لبه‌ی پایینِ هیرو در هر اسکرول.
    // نسخه‌ی اول IntersectionObserver بود و در پنلِ مرورگرِ ابزار **هیچ‌وقت**
    // شلیک نکرد (آزموده شد: یک ناظرِ تازه هم چیزی نداد، چون پنل کامپوزیت
    // نمی‌کند). نتیجه‌اش این بود که نوار روی فوترِ سیاه هم مرکبِ تیره
    // می‌مانْد و ناپدید می‌شد. `getBoundingClientRect` روی رویدادِ اسکرول
    // هم قطعی است و هم آزمون‌پذیر، و هزینه‌اش ناچیز.
    const hero = document.querySelector("main")?.firstElementChild;
    const NAV_H = 80;
    const read = () => {
      if (hero) {
        setPastHero(hero.getBoundingClientRect().bottom <= NAV_H);
      } else {
        setPastHero(window.scrollY > window.innerHeight * 0.85);
      }
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  // پرده که باز است: Escape ببندد، صفحه اسکرول نشود، فوکوس داخل بیاید
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    firstLinkRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const ink = onLight ? "text-[#241c17]" : "text-paper";
  const bar = onLight ? "bg-[#241c17]" : "bg-paper";

  return (
    <>
      <nav
        aria-label="ناوبری اصلی"
        className={`fixed inset-x-0 top-0 z-30 flex items-center justify-between
                    px-5 py-4 transition-colors duration-500 sm:px-8 sm:py-5
                    ${pastHero ? "bg-ink/70 backdrop-blur-md" : ""}`}
      >
        {/* نشانِ برند — در RTL اولین فرزند، یعنی راست */}
        <a
          className={`flex min-h-11 items-center gap-3 tracking-tight transition-opacity hover:opacity-60 ${ink}`}
          href="#top"
        >
          <span className="font-display text-[19px] font-extrabold sm:text-[23px]">
            سارا داودی‌فر
          </span>
          <span
            aria-hidden="true"
            className="select-none text-[22px] leading-none sm:text-[26px]"
            style={{ letterSpacing: "-0.02em" }}
          >
            ✳︎
          </span>
        </a>

        {/* لینک‌های دسکتاپ */}
        <div className={`hidden items-center text-[17px] md:flex lg:text-[19px] ${ink}`}>
          {LINKS.map((l, i) => (
            <span key={l.href}>
              {/* `-my-2.5 py-2.5` ناحیه‌ی لمس را به ۴۶ پیکسل می‌رساند بی
                  آنکه ارتفاعِ نوار عوض شود — این نوار از `md` پیداست و
                  تبلت هم لمسی است. */}
              <a
                className="-my-2.5 inline-block py-2.5 transition-opacity hover:opacity-60"
                href={l.href}
              >
                {l.label}
              </a>
              {i < LINKS.length - 1 && <span aria-hidden="true">{"، "}</span>}
            </span>
          ))}
        </div>

        {/* دعوت — در RTL آخرین فرزند، یعنی چپ */}
        <a
          className={`-my-2.5 hidden py-2.5 text-[17px] underline underline-offset-2 transition-opacity hover:opacity-60 md:block lg:text-[19px] ${ink}`}
          href={CTA.href}
        >
          {CTA.label}
        </a>

        {/* همبرگری — فقط موبایل */}
        <button
          aria-controls="site-menu"
          aria-expanded={open}
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          className="-m-2 flex min-h-11 min-w-11 flex-col items-center justify-center gap-[5px] p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <span
            className={`h-[2px] w-6 transition-all duration-300 ${bar} ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 transition-all duration-300 ${bar} ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 transition-all duration-300 ${bar} ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* نوارِ پیشرفتِ قصه — یک خطِ مویی زیرِ نوار.
          بی JS است (`animation-timeline: scroll()`)، پس نه لیسنری اضافه
          می‌کند و نه در سرور مشکلی دارد. `aria-hidden` است چون اطلاعِ
          تازه‌ای نمی‌دهد؛ فقط جای خواننده در قصه را نشان می‌دهد. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-px"
      >
        <div className="scroll-rail h-px w-full origin-right bg-gradient-to-l from-rose-lit via-rose to-transparent" />
      </div>

      {/* پرده‌ی موبایل — یک پله زیرِ نوار می‌مانَد تا همبرگری کلیک‌پذیر بماند */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-20 flex flex-col items-start justify-center gap-8
                    bg-black/90 px-8 backdrop-blur-md transition-opacity duration-300 md:hidden
                    ${open ? "opacity-100" : "opacity-0"}`}
        id="site-menu"
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        {LINKS.map((l, i) => (
          <a
            className="text-[32px] font-medium text-paper"
            href={l.href}
            key={l.href}
            onClick={() => setOpen(false)}
            ref={i === 0 ? firstLinkRef : undefined}
            tabIndex={open ? 0 : -1}
          >
            {l.label}
          </a>
        ))}
        <a
          className="text-[32px] font-medium text-paper underline underline-offset-4"
          href={CTA.href}
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
        >
          {CTA.label}
        </a>
      </div>
    </>
  );
}
