import SectionShell from "@/components/site/section-shell";

/**
 * ۱۲ — محتوا.
 *
 * سه دسته که ستون‌فقراتِ محتوای آینده‌اند. عمداً هیچ مقاله یا ویدیوی
 * جعلی این‌جا نیست: به‌جای کارت‌های خالیِ «به‌زودی»، خودِ دسته‌ها با
 * توضیحشان می‌آیند تا بخش از همین حالا معنا داشته باشد و بعداً فقط
 * فهرستِ محتوا زیرش اضافه شود.
 */

const TRACKS = [
  {
    en: "MINDSET",
    fa: "ذهنیت",
    body: "مسئولیت‌پذیری، پذیرفتنِ چالش، و نگاهی که رشد را ممکن می‌کند.",
  },
  {
    en: "MONEY",
    fa: "پول",
    body: "تفکرِ مالی، استقلالِ اقتصادی و ساختنِ مسیرِ درآمدی.",
  },
  {
    en: "LEADERSHIP",
    fa: "رهبری",
    body: "ساختنِ تیم، رشد دادنِ آدم‌ها و رهبریِ سازمان.",
  },
];

const FORMATS = ["مقاله", "ویدیو", "پادکست", "محتوای اینستاگرام", "گفت‌وگو"];

export default function Media() {
  return (
    <SectionShell id="media" eyebrow="محتوا" tone="dark">
      <div className="reveal max-w-[20ch] font-display text-[clamp(26px,4.4vw,54px)] font-extrabold leading-[1.28] tracking-tight text-chalk">
        <span className="block">فکر کن.</span>
        <span className="block">رشد کن.</span>
        <span className="block text-rose-lit">رهبری کن.</span>
      </div>
      <p className="reveal mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-dust">
        Think. Grow. Lead.
      </p>

      <div className="mt-[clamp(40px,6.5vh,84px)] grid gap-4 md:grid-cols-3">
        {TRACKS.map((t) => (
          <div
            className="reveal group rounded-xl border border-white/10 bg-white/[0.02] p-7 transition-colors duration-300 hover:border-rose/45 hover:bg-rose/[0.07]"
            key={t.en}
          >
            <h3 className="mt-5 text-[clamp(17px,2vw,22px)] font-bold leading-tight tracking-tight text-chalk">
              {t.fa}
            </h3>
            <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-dust">
              {t.en}
            </p>
            <p className="mt-4 text-[13.5px] leading-[2] text-dust">{t.body}</p>
          </div>
        ))}
      </div>

      <div className="reveal mt-[clamp(32px,5vh,60px)] flex flex-wrap items-center gap-x-[clamp(16px,3vw,40px)] gap-y-3 border-t border-white/10 pt-7 text-[12.5px] tracking-[0.1em] text-dust">
        <b className="font-mono text-[9.5px] font-normal uppercase tracking-[0.24em] text-dust">
          قالب‌ها
        </b>
        {FORMATS.map((f) => (
          <span key={f}>{f}</span>
        ))}
      </div>
    </SectionShell>
  );
}
