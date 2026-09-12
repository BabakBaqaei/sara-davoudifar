import ExpandableGallery from "@/components/ui/gallery-animation";
import { LogoMarquee } from "@/components/ui/logo-marquee";
import SectionShell from "@/components/site/section-shell";
import { STAGE_IMAGES } from "@/lib/stage-images";

/**
 * ۱۱ — سارا روی صحنه.
 *
 * گالریِ نُه‌عکسیِ سایت این‌جا آمد و نه در یک بخشِ جدا. دلیلش محتواست:
 * آن عکس‌ها خودشان عکسِ همایش و صحنه‌اند (PMM، مسترمایند، دانشگاه)، پس
 * این‌جا شاهدِ همین بخش‌اند. یک «گالری» بی‌عنوان در روایتِ سایت جایی
 * نداشت.
 *
 * فهرستِ تصاویر از `lib/stage-images.ts` می‌آید تا یک منبعِ حقیقت بماند و
 * نقطه‌های کانونیِ اندازه‌گیری‌شده‌ی هر عکس دوباره حساب نشوند.
 *
 * فهرستِ «موضوع‌ها» و دعوتِ «سارا را برای سخنرانی دعوت کنید» به‌خواستِ بابک
 * برداشته شد. بخش حالا فقط شاهد است: عکس‌های واقعیِ صحنه و نوارِ نام‌های
 * رویدادها. دعوت یک‌بار در «همکاری» می‌آید و همان کافی است.
 */

/**
 * جاهایی که سارا واقعاً روی صحنه بوده. این فهرست پیش‌تر در نسخه‌ی قدیمیِ
 * «داستان» بود و در بازطراحی جا ماند؛ این‌جا جای درستش است، کنارِ خودِ
 * عکس‌های همان رویدادها.
 *
 * هیچ‌کدام ادعا نیست: هر پنج مورد پشتوانه‌ی عکس دارد.
 */
const PRESENCE = [
  { id: "pmm-2023", label: "PMM First Leadership ۲۰۲۳" },
  { id: "pmm-13", label: "PMM 13th Anniversary" },
  { id: "mastermind", label: "Mastermind Event" },
  { id: "razavi", label: "دانشگاه رضوی مشهد" },
  { id: "robbins", label: "همایش تونی رابینز" },
];


export default function Speaking() {
  return (
    <SectionShell id="speaking" eyebrow="صحنه" tone="dark">
      <h2 className="reveal mb-4 max-w-[24ch] font-display text-[clamp(25px,4vw,48px)] font-extrabold leading-[1.38] tracking-tight text-chalk">
        سارا <em className="not-italic text-rose-lit">روی صحنه</em>
      </h2>
      <p className="reveal mb-[clamp(36px,5.5vh,70px)] max-w-[50ch] text-[clamp(14.5px,1.45vw,16.5px)] leading-[2.15] text-dust">
        سخنرانیِ کلیدی، کارگاه و آموزش در همایش‌ها، سازمان‌ها و دانشگاه.
      </p>

      <ExpandableGallery images={STAGE_IMAGES} />

      <div className="reveal mt-[clamp(28px,4vh,52px)] border-y border-white/10 py-3">
        <LogoMarquee
          items={PRESENCE}
          label="حضور سارا در همایش‌ها و رویدادها"
        />
      </div>

    </SectionShell>
  );
}
