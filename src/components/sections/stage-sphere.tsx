import ExpandableGallery, { type GalleryImage } from "@/components/ui/gallery-animation";

/**
 * بخش «صحنه» — گالری کشسان از عکس‌های واقعی سارا.
 *
 * `focus` نقطه‌ی `object-position` افقی است، و **با موقعیت سوژه در عکس
 * یکی نیست**. `object-position: X%` نقطه‌ی X٪ تصویر را با نقطه‌ی X٪ کادر
 * هم‌تراز می‌کند؛ چون پنجره‌ی دید در قابِ باریک حدود نصف عرض تصویر است،
 * گذاشتن مستقیمِ درصدِ سوژه سوژه را به لبه می‌راند. رابطه‌ی درست:
 *
 *   X = 100 × (S·nw − tw/2) / (nw − tw)
 *
 * که S موقعیت سوژه (کسری از عرض)، nw عرضِ مقیاس‌خورده‌ی تصویر و tw عرض
 * کادر است. اعداد زیر با همین رابطه برای قابِ ۱۲۲×۳۸۰ (۹ قاب در ۱۱۶۰px)
 * حساب و بعد چشمی تأیید شده‌اند. اگر تعداد عکس‌ها را عوض کردی، عرض قاب
 * و در نتیجه این اعداد هم عوض می‌شوند.
 */
const IMAGES: GalleryImage[] = [
  { src: "/images/g-stage-forward.webp", alt: "سارا روی صحنه", title: "روی صحنه", focus: 52 },
  { src: "/images/g-stage-wings.webp", alt: "سارا در حال سخنرانی", title: "سخنرانی", focus: 58 },
  { src: "/images/g-pmm-16th.webp", alt: "سارا در شانزدهمین سالگرد PMM", title: "شانزدهمین سالگرد PMM", focus: 36 },
  { src: "/images/g-pmm-14th.webp", alt: "سارا در چهاردهمین سالگرد PMM", title: "چهاردهمین سالگرد PMM", focus: 67 },
  { src: "/images/g-pmm-13th.webp", alt: "سارا در سیزدهمین سالگرد PMM", title: "سیزدهمین سالگرد PMM", focus: 49 },
  { src: "/images/g-first-leadership.webp", alt: "سارا در رویداد First Leadership 2023", title: "First Leadership ۲۰۲۳", focus: 6 },
  { src: "/images/g-mastermind-stage.webp", alt: "سارا در رویداد Mastermind", title: "Mastermind", focus: 51 },
  { src: "/images/g-mastermind-atorina.webp", alt: "سارا در رویداد Mastermind — Atorina", title: "Mastermind × Atorina", focus: 50 },
  { src: "/images/g-mastermind-turkey.webp", alt: "سارا در رویداد Mastermind، ترکیه", title: "Mastermind — ترکیه", focus: 16 },
];

export default function StageSphere() {
  return (
    <section id="stage" className="relative overflow-hidden bg-ink py-[clamp(84px,14vh,180px)]">
      <div className="mx-auto max-w-[1160px] px-[clamp(20px,5vw,64px)]">
        <div className="mb-8 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.26em] text-violet-400">
          ۰۲ — صحنه
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
        </div>

        <h2 className="mb-4 max-w-[24ch] text-[clamp(20px,2.9vw,34px)] leading-[1.6] tracking-tight">
          جایی که آموزش{" "}
          <em className="font-bold not-italic text-violet-400">اتفاق می‌افتد.</em>
        </h2>

        <p className="mb-[clamp(24px,4vh,48px)] text-[13.5px] text-neutral-500">
          نشانگر را روی هر قاب ببرید تا باز شود. برای نمای کامل، کلیک کنید.
        </p>

        <ExpandableGallery images={IMAGES} />
      </div>
    </section>
  );
}
