import SectionShell from "@/components/site/section-shell";

/**
 * ۰۴ — چهار جهانِ سارا.
 *
 * چهار کارتِ بزرگ که با نشانگر باز می‌شوند. باز‌شدن با `grid-template-rows`
 * از `0fr` به `1fr` انجام می‌شود، نه با `max-height` حدسی: ارتفاعِ واقعیِ
 * متن هرچه باشد، انیمیشن درست کار می‌کند و عددِ جادویی لازم نیست.
 *
 * جزئیات با `group-hover` **و** `group-focus-within` باز می‌شوند تا با
 * کیبورد هم برسند؛ و در لمسی که hover نیست، `open` روی جزئیات همیشه
 * دیده می‌شود چون کارت خودش `focus-within` می‌گیرد.
 *
 * قاعده‌ی پروژه: متنِ جزئیات در DOM هست و برای صفحه‌خوان همیشه خواندنی
 * است — پنهان‌شدن فقط بصری است.
 */

const WORLDS = [
  {
    en: "BUSINESS",
    fa: "کسب‌وکار",
    lead: "کارآفرینی و توسعه‌ی کسب‌وکار",
    detail:
      "از شروع با دستِ خالی تا ساختنِ چند کسب‌وکار در حوزه‌های متفاوت. تمرکزم روی ساختنِ چیزی است که بدونِ حضورِ دائمِ من هم کار کند.",
  },
  {
    en: "LEADERSHIP",
    fa: "رهبری",
    lead: "رهبری و رشدِ افراد",
    detail:
      "رهبری برای من یعنی ساختنِ آدم‌هایی که خودشان رهبر شوند. سازمانی چندصدنفره از همین نگاه بیرون آمد.",
  },
  {
    en: "PERSONAL GROWTH",
    fa: "توسعه‌ی فردی",
    lead: "ذهنیت و رشدِ شخصی",
    detail:
      "بیش از پانزده هزار دلار روی یادگیریِ خودم سرمایه‌گذاری کرده‌ام. باور دارم رشد با مسئولیت‌پذیری شروع می‌شود، نه با انگیزه.",
  },
  {
    en: "SPORT",
    fa: "ورزش",
    lead: "ورزش و سبکِ زندگی",
    detail:
      "نقطه‌ی شروعِ همه‌چیز. انضباط، تحملِ فشار و پذیرفتنِ نتیجه را این‌جا یاد گرفتم — و هنوز همان‌جا برمی‌گردم.",
  },
];

export default function FourWorlds() {
  return (
    <SectionShell id="worlds" eyebrow="قلمروها" tone="dark">
      <h2 className="reveal mb-[clamp(40px,6vh,80px)] max-w-[24ch] font-display text-[clamp(25px,4vw,48px)] font-extrabold leading-[1.38] tracking-tight text-chalk">
        چهار جهانی که <em className="not-italic text-rose-lit">در آن‌ها کار می‌کنم</em>
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {WORLDS.map((w) => (
          <article
            className="reveal group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]
                       p-[clamp(24px,3vw,40px)] transition-colors duration-500
                       hover:border-rose/45 hover:bg-rose/[0.07]
                       focus-within:border-rose/45 focus-within:bg-rose/[0.07]"
            key={w.en}
            tabIndex={0}
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-dust">
                {w.en}
              </span>
            </div>

            <h3 className="mt-6 text-[clamp(20px,2.6vw,30px)] font-bold leading-tight tracking-tight text-chalk">
              {w.fa}
            </h3>
            <p className="mt-2.5 text-[clamp(13.5px,1.4vw,15.5px)] leading-[1.95] text-dust">
              {w.lead}
            </p>

            {/* جزئیات — با گرید باز می‌شود، پس عددِ ارتفاعِ حدسی لازم نیست */}
            <div
              className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out
                         group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]"
            >
              <div className="overflow-hidden">
                <p className="pt-5 text-[clamp(13.5px,1.4vw,15.5px)] leading-[2.05] text-dust">
                  {w.detail}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
