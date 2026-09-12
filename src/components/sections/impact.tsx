import SectionShell from "@/components/site/section-shell";

/**
 * شاهد — پرده‌ی روشن.
 *
 * نسخه‌ی اول چهار کارتِ هم‌عرض در یک قابِ درخشان بود؛ همان چیزی که هر
 * سایتی دارد و عدد را به یک ویجت تبدیل می‌کند. حالا عدد **خودش تایپِ
 * اصلی** است: بزرگ، روی کرِم، مثل صفحه‌ی رکورد.
 *
 * چرا پرده روشن است: بدنه تیره است و این‌جا اولین نفسِ روشن بعد از
 * سقوط و برخاستن است. شاهد باید در روشنایی خوانده شود.
 *
 * وزنِ عددها یکسان نیست — «۱۲ سال» و «چندصد نفره» ادعای اصلی‌اند و
 * بزرگ‌ترند؛ ردیفِ دوم پشتیبان است. گریدِ یک‌دست همه را هم‌ارزش نشان
 * می‌داد، که غلط است.
 *
 * اعداد همان اعدادِ خودِ بابک‌اند. هیچ عددِ تازه‌ای ساخته نشد.
 */

const LEAD = [
  { v: "۱۲", u: "سال", l: "فعالیتِ حرفه‌ای و ساختنِ تیم" },
  { v: "چندصد", u: "نفره", l: "سازمانی که رهبری‌اش می‌کنم" },
];

const SUPPORT = [
  { v: "۵۰۰", u: "نفر", l: "آموزش‌دیده و همراهی‌شده" },
  { v: "۱۵٬۰۰۰", u: "+ دلار", l: "سرمایه‌گذاری بر توسعه‌ی خود" },
];

export default function Impact() {
  return (
    <SectionShell eyebrow="شاهد" id="impact" tone="light">
      <h2 className="reveal max-w-[26ch] font-display text-[clamp(28px,5vw,64px)] font-extrabold leading-[1.22] tracking-tight text-[#1f1a16]">
        نه ادعا، <em className="not-italic text-rose-deep">شاهد</em>
      </h2>

      {/* ردیفِ اصلی — دو عددِ بزرگ */}
      <div className="mt-[clamp(44px,7vh,96px)] grid gap-[clamp(28px,5vw,64px)] sm:grid-cols-2">
        {LEAD.map((n) => (
          <div className="reveal" key={n.l}>
            <div className="flex items-baseline gap-3 border-b border-[#1f1a16]/15 pb-5">
              <span className="font-display text-[clamp(52px,10vw,132px)] font-extrabold leading-[0.85] tracking-tighter text-[#1f1a16]">
                {n.v}
              </span>
              <span className="font-display text-[clamp(16px,2.2vw,26px)] font-extrabold text-rose-deep">
                {n.u}
              </span>
            </div>
            <p className="mt-4 max-w-[26ch] text-[clamp(14px,1.45vw,16.5px)] leading-[1.95] text-graphite">
              {n.l}
            </p>
          </div>
        ))}
      </div>

      {/* ردیفِ پشتیبان — کوچک‌تر، در یک خط */}
      <div className="mt-[clamp(36px,6vh,72px)] grid gap-[clamp(20px,4vw,56px)] sm:grid-cols-2">
        {SUPPORT.map((n) => (
          <div className="reveal flex flex-wrap items-baseline gap-x-3 gap-y-1" key={n.l}>
            <span className="font-display text-[clamp(26px,3.4vw,42px)] font-extrabold leading-none tracking-tight text-[#1f1a16]">
              {n.v}
            </span>
            <span className="text-[clamp(13px,1.4vw,15px)] font-bold text-rose-deep">{n.u}</span>
            <span className="text-[clamp(13px,1.35vw,15px)] leading-[1.8] text-graphite">
              {n.l}
            </span>
          </div>
        ))}
      </div>

      <blockquote className="reveal mt-[clamp(52px,9vh,112px)] max-w-[34ch]">
        <p className="font-display text-[clamp(21px,3.4vw,44px)] font-extrabold leading-[1.42] tracking-tight text-[#1f1a16]">
          موفقیتِ من فقط چیزی نیست که به دست آورده‌ام؛ چیزی است که{" "}
          <em className="not-italic text-rose-deep">در دیگران ایجاد کرده‌ام.</em>
        </p>
      </blockquote>
    </SectionShell>
  );
}
