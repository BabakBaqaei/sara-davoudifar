import SectionShell from "@/components/site/section-shell";

/**
 * ۰۶ — آدم‌هایی که رشدشان را دیده‌ام.
 *
 * ⚠️ این بخش **عمداً بی محتوای واقعی** ساخته شده.
 *
 * بابک خودش نوشت: «این قسمت را فقط زمانی با عدد و ادعاهای مشخص پر کن که
 * سارا بتواند نمونه‌های واقعی و قابل‌اتکا ارائه دهد.» پس این‌جا نه اسمی
 * ساخته شد، نه عکسی، نه «از کارمند به کارآفرین»ی که پشتش آدمی نباشد.
 * روی سایتِ یک برندِ واقعی، توصیه‌نامه‌ی جعلی هم دروغ است و هم ریسکِ
 * حقوقی.
 *
 * آنچه ساخته شد: **قابِ آماده**. سه دگرگونیِ نمونه به‌عنوان *الگوی
 * ساختار* نوشته شده و صریح برچسبِ «نمونه‌ی ساختار» دارد، و جای عکس و
 * اسم خالی است. به‌محضِ رسیدنِ نمونه‌های واقعی، فقط آرایه‌ی `STORIES` پر
 * می‌شود و `PENDING` را `false` می‌کنی.
 *
 * برای انتشار: هر نمونه به رضایتِ کتبیِ همان شخص نیاز دارد — مثل همان
 * قیدی که برای نفرِ دومِ عکسِ ترکیه گذاشتیم.
 */

const PENDING = true;

/** الگوی ساختار — این‌ها آدمِ واقعی نیستند و روی سایت هم چنین ادعایی نمی‌شود */
const SHAPE = [
  { from: "کارمند", to: "کارآفرین", en: "From Employee → Entrepreneur" },
  { from: "تردید", to: "رهبری", en: "From Uncertainty → Leadership" },
  { from: "درآمدِ محدود", to: "رشدِ مالی", en: "From Low Income → Financial Growth" },
];

export default function PeopleGrown() {
  return (
    <SectionShell id="people" eyebrow="آدم‌ها" tone="dark">
      <h2 className="reveal mb-5 max-w-[26ch] font-display text-[clamp(25px,4vw,48px)] font-extrabold leading-[1.38] tracking-tight text-chalk">
        آدم‌هایی که <em className="not-italic text-rose-lit">رشدشان را دیده‌ام</em>
      </h2>

      <p className="reveal mb-[clamp(36px,5.5vh,72px)] max-w-[52ch] text-[clamp(14.5px,1.45vw,16.5px)] leading-[2.15] text-dust">
        مهم‌ترین بخشِ کارم همین است. این‌جا جای روایتِ خودِ آدم‌هاست — با اسم و
        تصویرِ خودشان، و با اجازه‌ی خودشان.
      </p>

      {PENDING ? (
        <div className="reveal rounded-2xl border border-dashed border-white/15 bg-white/[0.015] p-[clamp(24px,3vw,44px)]">
          <div className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-amber-400/80">
            در انتظارِ محتوای واقعی
          </div>
          <p className="mt-4 max-w-[54ch] text-[clamp(14px,1.4vw,16px)] leading-[2.1] text-dust">
            این بخش تا رسیدنِ نمونه‌های واقعی خالی می‌مانَد. کارت‌های زیر فقط{" "}
            <b className="font-bold text-chalk/85">شکلِ ساختار</b> را نشان
            می‌دهند و به کسی نسبت داده نشده‌اند.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {SHAPE.map((s) => (
              <div
                className="rounded-xl border border-white/10 bg-char-2 p-6"
                key={s.en}
              >
                <div className="flex size-11 items-center justify-center rounded-full border border-white/10 text-dust">
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="mt-5 text-[15px] leading-[1.8] text-dust">
                  از <b className="font-bold text-dust">{s.from}</b>
                  <br />
                  به <b className="font-bold text-dust">{s.to}</b>
                </div>
                <div className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dust">
                  {s.en}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-[54ch] text-[13px] leading-[2] text-dust">
            برای هر نمونه لازم است: نام، تصویر، وضعیتِ پیش و پس، روایتِ کوتاه، و
            نتیجه‌ی مشخص — همراهِ رضایتِ کتبیِ خودِ شخص برای انتشار.
          </p>
        </div>
      ) : null}
    </SectionShell>
  );
}
