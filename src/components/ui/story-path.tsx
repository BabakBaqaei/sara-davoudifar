/**
 * کارت‌های پراکنده روی یک خطِ چین‌دار.
 *
 * منبع: کامپوننتِ «How it works» از 21st.dev که بابک فرستاد. سازوکارش
 * خوب است — کارت‌ها روی یک مسیرِ مارپیچ پخش می‌شوند و خطِ چین‌دار بینشان
 * آرام جلو می‌رود — ولی سطحش برای این سایت غلط بود و عوض شد:
 *
 *   ۱. **Comic Sans** برای شماره‌ها. این‌جا شماره‌ها فارسی‌اند و با پیدا
 *      ست می‌شوند.
 *   ۲. **نارنجی/آبی/بنفشِ پاستلی** با کارتِ سفید و سایه‌ی خاکستری —
 *      همان ظاهرِ پیش‌فرضی که کلِ پروژه صرفِ پاک‌کردنش شد.
 *   ۳. **سنجاقِ کاغذ** و استعاره‌ی «کاغذِ یادداشت». این بخش روایتِ
 *      ورشکستگیِ خانواده است؛ کاغذِ رنگیِ سنجاق‌شده کوچکش می‌کند.
 *   ۴. **`left-[15%]`/`right-[15%]`** فیزیکی و فقط برای LTR. این‌جا
 *      آینه شد: مسیر از راست شروع می‌شود، چون خواندن از راست شروع می‌شود.
 *   ۵. **`m.path` و rAF** برای خطِ چین‌دار. با CSS شد تا بخش سرور بماند
 *      (`globals.css`، `story-dash`) و بلوکِ سراسریِ
 *      `prefers-reduced-motion` خودش خاموشش کند.
 *
 * چرخشِ کارت‌ها از ۸ درجه به ۱.۶ آمد. هشت درجه «تخته‌ی اعلاناتِ مدرسه»
 * است؛ یک‌ونیم درجه فقط می‌گوید این‌ها دستی چیده شده‌اند.
 *
 * ── هندسه: یک دستگاه، نه دو تا ──
 * `viewBox` ارتفاعش دقیقاً برابرِ ارتفاعِ ظرف است و
 * `preserveAspectRatio="none"`، پس واحدِ عمودی یک‌به‌یک پیکسل است.
 * کارت‌ها ۲۸۰ پیکسل عرض دارند و در ۸٪ از هر لبه می‌نشینند، یعنی مرکزشان
 * در ظرفِ ۱۰۰۰ پیکسلی روی ۷۸۰ و ۲۲۰ می‌افتد — همان عددهایی که خط با
 * آن‌ها رسم می‌شود. فاصله‌ی عمودیِ کارت‌ها (۴۰۰) از ارتفاعِ واقعیِ
 * اندازه‌گیری‌شده‌ی کارت (۳۲۰) به‌علاوه‌ی ۸۰ پیکسل دهانه می‌آید.
 *
 * چیدمانِ مطلق از `lg` شروع می‌شود نه `md`: در ۷۶۸ پیکسل دو کارتِ
 * ۲۸۰ پیکسلی تقریباً به هم می‌چسبند و دهانه‌ای برای خط نمی‌مانَد.
 *
 * عددهای `md:top-*` و `md:h-*` باید با `TOPS` و `HEIGHT` یکی بمانند.
 * به‌صورتِ رشته‌ی کامل نوشته شده‌اند چون Tailwind v4 متنِ سورس را اسکن
 * می‌کند و کلاسِ ساخته‌شده در زمانِ اجرا را نمی‌بیند.
 *
 * خط از **پشتِ** کارت‌ها رد می‌شود (z-0 در برابر z-10)، پس لازم نیست به
 * لبه‌ی دقیقِ کارت بچسبد؛ فقط فاصله‌ها را پر می‌کند.
 */

export type PathCard = {
  id: string;
  /** شماره‌ی بالای کارت — برای کارتی که از ریتم بیرون می‌زند خالی بماند */
  lead?: string;
  leadNote?: string;
  /** برچسبِ جایگزینِ شماره، برای همان کارتِ بیرون‌زده */
  label?: string;
  title: string;
  sub?: string;
  body: string;
  items?: string[];
  /**
   * کارت‌هایی که از الگو بیرون می‌زنند.
   *   `fall`   — سقوط: قابِ رُزِ تیره.
   *   `choice` — انتخاب: قابِ رُزِ روشن. عمداً روشن‌تر از سقوط است، چون
   *              نقطه‌ی برگشت است نه ادامه‌ی آن.
   */
  tone?: "fall" | "choice";
};

const HEIGHT = 1880;
const TOPS = [0, 400, 800, 1200, 1600];
const TOP_CLASS = [
  "lg:top-[0px]",
  "lg:top-[400px]",
  "lg:top-[800px]",
  "lg:top-[1200px]",
  "lg:top-[1600px]",
];
const SIDE = ["lg:right-[8%]", "lg:left-[8%]"];
const ROTATE = ["lg:rotate-[1.6deg]", "lg:-rotate-[1.6deg]"];

/** مرکزِ افقیِ کارت‌ها در دستگاهِ هزارتاییِ `viewBox` (اندازه‌گیری‌شده). */
const CX = [780, 220];

/* خط از داخلِ کارتِ قبلی درمی‌آید و داخلِ کارتِ بعدی می‌رود، پس دو سرش
   پشتِ کارت پنهان است و فقط دهانه‌ی بینشان دیده می‌شود. همین باعث شد
   هندسه‌ی اول کار نکند: کارت‌ها ۶۱ پیکسل روی هم می‌افتادند و دهانه‌ای
   نمی‌ماند که خط در آن دیده شود. */
const STROKE = [
  "rgba(230,225,220,0.26)",
  "rgba(230,225,220,0.26)",
  "rgba(158,31,51,0.55)",
  "rgba(224,107,125,0.75)",
];

const LINK = TOPS.slice(0, -1).map((t, i) => {
  const x0 = CX[i % 2];
  const x1 = CX[(i + 1) % 2];
  const y0 = t + 270;
  const y1 = TOPS[i + 1] + 50;
  /* کششِ عمودیِ نقاطِ کنترل ۱۲۰ است و نه ۷۰: با ۷۰، چون فاصله‌ی افقی
     (۵۶۰ واحد) خیلی بیشتر از عمودی (۱۸۰) است، منحنی عملاً یک خطِ
     مورب می‌شد. با ۱۲۰ خط از کارت به‌صورت عمودی درمی‌آید و عمودی هم
     وارد کارتِ بعدی می‌شود. */
  return `M ${x0} ${y0} C ${x0} ${y0 + 120}, ${x1} ${y1 - 120}, ${x1} ${y1}`;
});

export default function StoryPath({ cards }: { cards: PathCard[] }) {
  return (
    <div className="relative mx-auto flex w-full max-w-[1000px] flex-col gap-7 lg:block lg:h-[1880px]">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
        preserveAspectRatio="none"
        viewBox={`0 0 1000 ${HEIGHT}`}
      >
        {LINK.map((d, i) => (
          <path
            className="story-path"
            d={d}
            fill="none"
            key={d}
            /* رنگِ خط خودش روایت است: تا «سقوط» خنثی است، ورودی‌اش به
               سقوط محو و رُزِ تیره می‌شود، و خروجی‌اش از سقوط به سمتِ
               «انتخاب» رُزِ روشن و پررنگ است — مسیر برمی‌گردد. */
            stroke={STROKE[i] ?? "rgba(230,225,220,0.26)"}
            strokeDasharray="8 6"
            strokeLinecap="round"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {cards.map((c, i) => (
        <article
          className={`reveal relative z-10 w-full rounded-2xl border p-[clamp(20px,2.2vw,26px)]
                      transition-transform duration-300 hover:z-30 lg:absolute lg:w-[280px] lg:hover:scale-[1.02]
                      ${SIDE[i % 2]} ${TOP_CLASS[i]} ${ROTATE[i % 2]}
                      ${
                        c.tone === "fall"
                          ? "border-rose/40 bg-[#2a1417]"
                          : c.tone === "choice"
                            ? "border-rose-lit/45 bg-[#241c1e]"
                            : "border-white/10 bg-char-2"
                      }`}
          key={c.id}
        >
          {c.lead ? (
            <div className="flex items-baseline gap-2.5">
              <span className="font-display text-[clamp(30px,4vw,46px)] font-extrabold leading-none tracking-tight text-chalk">
                {c.lead}
              </span>
              {c.leadNote && (
                <span className="text-[11px] tracking-[0.18em] text-dust">{c.leadNote}</span>
              )}
            </div>
          ) : (
            <div className="font-mono text-[11px] uppercase tracking-[0.26em] md:text-[9.5px] text-rose-lit">
              {c.label}
            </div>
          )}

          <h3 className="mt-4 text-[clamp(18px,2.1vw,23px)] font-bold leading-[1.35] tracking-tight text-chalk">
            {c.title}
          </h3>
          {c.sub && <p className="mt-1.5 text-[13px] leading-[1.9] text-dust">{c.sub}</p>}
          <p className="mt-3.5 text-[13.5px] leading-[2] text-dust">{c.body}</p>

          {c.items && (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] tracking-[0.08em] text-dust">
              {c.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
}
