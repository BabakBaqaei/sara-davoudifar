"use client";

import { HEROES } from "@/components/heroes/registry";

/**
 * سوییچر زنده‌ی هیرو — نوار کوچکِ پایین صفحه برای رفتن بین نسخه‌ها بدون
 * دست‌زدن به آدرس. ابزار ارزیابی است؛ در سایت نهایی این کامپوننت و
 * فراخوانی‌اش در page حذف می‌شوند.
 *
 * ناوبری با پیوندِ کامل (`<a>`) انجام می‌شود، نه پوش کلاینتی: انتخاب
 * هیرو سمت سرور از روی searchParams خوانده می‌شود، پس صفحه باید واقعاً
 * دوباره درخواست شود تا هیروی تازه رندر گردد.
 */
export default function HeroSwitcher({ active }: { active: string }) {
  const keys = Object.keys(HEROES);
  if (keys.length < 2) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/12 bg-black/60 p-1 backdrop-blur-md">
        <span className="px-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/40">
          Hero
        </span>
        {keys.map((k) => {
          const on = k === active;
          return (
            <a
              key={k}
              href={`/?hero=${k}`}
              aria-current={on ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
                on
                  ? "bg-paper text-[#141014]"
                  : "text-paper/70 hover:bg-white/10 hover:text-paper"
              }`}
            >
              {k}. {HEROES[k].label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
