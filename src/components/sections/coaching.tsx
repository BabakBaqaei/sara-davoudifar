import SectionShell from "@/components/site/section-shell";

/**
 * ۰۷ — مربی‌گری. این‌جا سارا از «فعالِ حوزه‌ی نتورک» به مربی تبدیل می‌شود.
 *
 * دعوتِ «شروعِ مسیرِ مربی‌گری» به‌خواستِ بابک برداشته شد. دو بخش بعد،
 * «همکاری» همان دعوت را می‌کند و تکرارش این‌جا چیزی اضافه نمی‌کرد.
 *
 * سه مسیر، و ترتیبشان معنا دارد: ذهنیت اول می‌آید چون بی آن دو تای بعدی
 * نمی‌مانند — همان چیزی که در روایتش هست، «رشد با مسئولیت‌پذیری شروع
 * می‌شود».
 */

const PATHS = [
  {
    en: "PERSONAL GROWTH",
    fa: "رشدِ فردی",
    items: ["ذهنیت", "اعتماد‌به‌نفس", "مسئولیت‌پذیری", "رشدِ شخصی"],
  },
  {
    en: "FINANCIAL GROWTH",
    fa: "رشدِ مالی",
    items: ["تفکرِ مالی", "استقلالِ اقتصادی", "ساختِ مسیرِ درآمدی"],
  },
  {
    en: "PROFESSIONAL GROWTH",
    fa: "رشدِ حرفه‌ای",
    items: ["مهارت", "رهبری", "کسب‌وکار", "مسیرِ حرفه‌ای"],
  },
];

export default function Coaching() {
  return (
    <SectionShell id="coaching" eyebrow="مربی‌گری" tone="dark">
      <div className="reveal max-w-[24ch] font-display text-[clamp(26px,4.6vw,56px)] font-extrabold leading-[1.28] tracking-tight text-chalk">
        <span className="block">خودت را رشد بده.</span>
        <span className="block">کسب‌وکارت را رشد بده.</span>
        <span className="block text-rose-lit">زندگی‌ات را رشد بده.</span>
      </div>
      <p className="reveal mt-5 font-mono text-[11px] uppercase tracking-[0.28em] md:text-[10px] text-dust">
        Grow yourself. Grow your business. Grow your life.
      </p>

      <div className="mt-[clamp(44px,7vh,88px)] grid gap-px overflow-hidden rounded-xl bg-white/10 md:grid-cols-3">
        {PATHS.map((p) => (
          <div
            className="reveal group bg-char-2 p-8 transition-colors duration-300 hover:bg-[#2b2528]"
            key={p.en}
          >
            <h3 className="mt-6 text-[clamp(18px,2.1vw,23px)] font-bold leading-tight tracking-tight text-chalk">
              {p.fa}
            </h3>
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.2em] md:text-[9.5px] text-dust">
              {p.en}
            </p>
            <ul className="mt-5 space-y-1.5 text-[13.5px] leading-[1.9] text-dust">
              {p.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </SectionShell>
  );
}
