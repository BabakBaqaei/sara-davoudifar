"use client";

import { useEffect, useState } from "react";

const EMAIL = "hello@saradavoudifar.com";

/* قرص‌ها حالا داخلِ خودِ فوترند، پس لینک‌شان به `#contact` یعنی لینک به
   خودشان. سه‌تای اول `mailto` با موضوعِ آماده شدند تا واقعاً کاری بکنند،
   و چهارمی به بالای روایت برمی‌گردد. */
const SUBJECT = (s: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(s)}`;

const PILLS = [
  { label: "پیشنهاد همکاری", href: SUBJECT("پیشنهاد همکاری") },
  { label: "دعوت برای سخنرانی", href: SUBJECT("دعوت برای سخنرانی") },
  { label: "مشاوره‌ی فردی", href: SUBJECT("درخواست مشاوره‌ی فردی") },
  { label: "مسیری که آمده‌ام", href: "#story" },
];

/**
 * ردیفِ قرص‌های کنش — الگو از سایتِ نمونه‌ی Mainframe.
 *
 * در نمونه این‌ها داخلِ هیرو بودند. هیروی سارا ویدیوی خودش است و دست
 * نمی‌خورد، پس این ردیف به فوترِ پایانی آمد، جایی که تصمیم گرفته می‌شود.
 *
 * ورودشان یک انیمیشنِ CSS است، نه استیتِ React. دلیلش قاعده‌ی پروژه است:
 * خوانایی نباید به انیمیشن گره بخورد. نسخه‌ی اول با `useState` و
 * `setTimeout` نوشته شد و در پنلِ مرورگر — که ترنزیشن را جلو نمی‌برد —
 * قرص‌ها با `opacity: 0` گیر کردند، در حالی که استایلِ درون‌خطی درست
 * `opacity: 1` بود. کی‌فریمِ `rise-in` فقط `from` دارد، پس حالتِ سکون
 * همیشه دیده‌شدن است. جزئیات در `globals.css`.
 */
export default function ActionPills() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      // کلیپ‌بورد در زمینه‌ی ناامن یا بی‌اجازه رد می‌شود. لینک mailto
      // پایین‌تر همیشه کار می‌کند، پس این‌جا کاری لازم نیست.
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-y-1 animate-[rise-in_0.45s_ease-out]">
      {PILLS.map((p) => (
        <a
          className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap
                     min-h-11 rounded-full border border-black/10 bg-white px-4 text-[13px]
                     text-black transition-colors duration-200 hover:bg-black hover:text-white
                     sm:px-5 sm:text-[15px] lg:min-h-0 lg:py-[0.3em]"
          href={p.href}
          key={p.label}
        >
          {p.label}
        </a>
      ))}

      <button
        aria-label={`رونوشتِ نشانی ${EMAIL}`}
        className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2
                   min-h-11 whitespace-nowrap rounded-full border border-white bg-transparent px-4
                   text-[13px] text-paper transition-colors duration-200
                   hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px] lg:min-h-0 lg:py-[0.3em]"
        onClick={copy}
        type="button"
      >
        {/* نشانی لاتین است و در متنِ RTL باید جهتش قفل شود، وگرنه نقطه و
            @ جابه‌جا رندر می‌شوند. */}
        <span>
          تماس:{" "}
          <span className="underline underline-offset-1" dir="ltr">
            {EMAIL}
          </span>
        </span>
        <span aria-hidden="true" className="relative size-3 shrink-0">
          {copied ? (
            <svg fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect height="13" rx="2" width="13" x="9" y="9" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </span>
      </button>

      {/* اعلانِ رونوشت برای صفحه‌خوان — بی این، کلیک هیچ بازخوردی ندارد */}
      <span aria-live="polite" className="sr-only">
        {copied ? "نشانی رونوشت شد" : ""}
      </span>
    </div>
  );
}
