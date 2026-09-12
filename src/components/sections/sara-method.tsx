import SectionShell from "@/components/site/section-shell";
import MethodRail from "@/components/ui/method-rail";

/**
 * ۱۰ — روشِ سارا.
 *
 * این بخش سایت را از «وب‌سایتِ شخصی» به «پلتفرمِ برندِ شخصی» می‌برد: یک
 * چارچوبِ نام‌دار که بعدها می‌تواند دوره، کارگاه، کتاب یا برنامه‌ی
 * مربی‌گری شود.
 *
 * پنج گام، و ترتیبشان خودِ ادعای روش است: نتیجه **آخر** می‌آید، نه اول.
 *
 * چیدمان از پنج کارتِ جدا به یک ریلِ پیوسته تغییر کرد. دلیلش معنایی است،
 * نه تزئینی: کارت‌های جدا پنج چیزِ مستقل را نشان می‌دادند و فلش‌های بینشان
 * تنها چیزی بودند که می‌گفتند ترتیبی در کار است. ریل خودِ پیوستگی است.
 */

const STEPS = [
  {
    en: "MINDSET",
    fa: "ذهنیت",
    body: "پذیرفتنِ مسئولیتِ نتیجه. بی این، بقیه‌ی گام‌ها نمی‌مانند.",
  },
  { en: "SKILLS", fa: "مهارت", body: "یادگیریِ هدفمند و سرمایه‌گذاری روی خود." },
  { en: "ACTION", fa: "عمل", body: "اجرا در دنیای واقعی، با ریسکِ حساب‌شده." },
  {
    en: "LEADERSHIP",
    fa: "رهبری",
    body: "ساختنِ آدم‌هایی که خودشان رهبر می‌شوند.",
  },
  {
    en: "RESULTS",
    fa: "نتیجه",
    body: "نتیجه پیامدِ چهار گامِ قبل است، نه نقطه‌ی شروع.",
  },
];

export default function SaraMethod() {
  return (
    <SectionShell id="method" eyebrow="روش" tone="dark">
      <h2 className="reveal mb-4 max-w-[24ch] font-display text-[clamp(25px,4vw,48px)] font-extrabold leading-[1.38] tracking-tight text-chalk">
        روشِ <em className="not-italic text-rose-lit">رشدِ سارا</em>
      </h2>
      <p className="reveal mb-[clamp(40px,6vh,80px)] font-mono text-[11px] uppercase tracking-[0.28em] md:text-[10px] text-dust">
        The Sara Growth Method
      </p>

      <MethodRail>
        <ol>
          {STEPS.map((s, i) => (
            <li
              className="reveal group relative ps-[clamp(28px,4.5vw,60px)] pb-[clamp(30px,4.5vh,58px)] last:pb-0"
              key={s.en}
            >
              {/* نقطه روی ریل. مرکزش ۷ پیکسل از لبه است، هم‌راستا با
                  خطِ دو‌پیکسلیِ ریل که از ۶ شروع می‌شود. */}
              <span
                aria-hidden="true"
                className="absolute start-0 top-[7px] size-3.5 rounded-full border-2 border-rose-lit/70 bg-char
                           transition-colors duration-300 group-hover:bg-rose-lit"
              />

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {/* شماره اطلاع است نه تزئین: پنج گام ترتیب دارند و ادعای
                    روش همین ترتیب است. پس باید خوانا باشد. */}
                <span className="font-display text-[clamp(20px,2.6vw,30px)] font-extrabold leading-none tracking-tight text-rose-lit/75">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[clamp(17px,2vw,22px)] font-bold leading-tight tracking-tight text-chalk">
                  {s.fa}
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] md:text-[9.5px] text-dust">
                  {s.en}
                </span>
              </div>
              <p className="mt-2.5 max-w-[52ch] text-[13.5px] leading-[2] text-dust">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </MethodRail>
    </SectionShell>
  );
}
