import SectionShell from "@/components/site/section-shell";

/**
 * ۰۹ — ورزش، فصلِ بعد.
 *
 * دامِ این بخش این است که مثل یک فعالیتِ جاری نشانش بدهیم. نیست: سارا
 * گفته می‌خواهد **در آینده** ورزش را دوباره جدی کند. پس همه‌چیزِ این بخش
 * زمانِ آینده دارد و برچسبش «فصلِ بعد» است، نه یکی از خدمات.
 *
 * تصویرِ ورزشیِ سارا هنوز نرسیده. جای‌نگهدارِ صریح گذاشته شد و عکسِ
 * نامربوط جایش نیامد — همان قاعده‌ای که برای بخشِ توصیه‌نامه‌ها هم داشتیم.
 */
export default function SportNext() {
  return (
    <SectionShell id="sport" eyebrow="فصل بعد" tone="dark">
      <div className="grid items-center gap-[clamp(28px,5vw,72px)] lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h2 className="reveal max-w-[20ch] font-display text-[clamp(26px,4.4vw,54px)] font-extrabold leading-[1.3] tracking-tight text-chalk">
            ورزش <em className="not-italic text-rose-lit">برمی‌گردد.</em>
          </h2>
          <p className="reveal mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-dust">
            Sport is coming back.
          </p>

          <p className="reveal mt-[clamp(26px,4vh,48px)] max-w-[52ch] text-[clamp(14.5px,1.45vw,16.5px)] leading-[2.15] text-dust">
            ورزش بخشِ بزرگی از هویتِ من بوده، و حالا می‌خواهم تجربه‌ی ورزشی، دانشِ
            دانشگاهی، کسب‌وکار و توسعه‌ی فردی را در یک مسیرِ تازه ترکیب کنم.
          </p>

          <div className="reveal mt-[clamp(28px,4.5vh,56px)] inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-2.5">
            <span className="size-1.5 rounded-full bg-rose-lit" />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-dust">
              در حالِ شکل‌گرفتن
            </span>
          </div>
        </div>

        {/* جای تصویرِ ورزشی — عمداً خالی و برچسب‌دار */}
        <div className="reveal relative aspect-[4/5] overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.015]">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <svg
              className="size-8 text-dust/40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              viewBox="0 0 24 24"
            >
              <rect height="15" rx="2" width="18" x="3" y="4.5" />
              <circle cx="8.5" cy="10" r="1.6" />
              <path d="m3 16.5 5-4 4 3 3.5-3 5.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-mono text-[9.5px] uppercase leading-[1.9] tracking-[0.2em] text-dust">
              تصویرِ ورزشیِ سارا
              <br />
              در انتظارِ عکس
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
