import { type GalleryImage } from "@/components/ui/gallery-animation";
import { asset } from "@/lib/asset";

/**
 * فهرستِ عکس‌های صحنه — تنها منبعِ حقیقت.
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
export const STAGE_IMAGES: GalleryImage[] = [
  { src: asset("/images/g-stage-forward.webp"), alt: "سارا روی صحنه", title: "روی صحنه", focus: 52 },
  { src: asset("/images/g-stage-wings.webp"), alt: "سارا در حال سخنرانی", title: "سخنرانی", focus: 58 },
  { src: asset("/images/g-pmm-16th.webp"), alt: "سارا در شانزدهمین سالگرد PMM", title: "شانزدهمین سالگرد PMM", focus: 36 },
  { src: asset("/images/g-pmm-14th.webp"), alt: "سارا در چهاردهمین سالگرد PMM", title: "چهاردهمین سالگرد PMM", focus: 67 },
  { src: asset("/images/g-pmm-13th.webp"), alt: "سارا در سیزدهمین سالگرد PMM", title: "سیزدهمین سالگرد PMM", focus: 49 },
  { src: asset("/images/g-first-leadership.webp"), alt: "سارا در رویداد First Leadership 2023", title: "First Leadership ۲۰۲۳", focus: 6 },
  { src: asset("/images/g-mastermind-stage.webp"), alt: "سارا در رویداد Mastermind", title: "Mastermind", focus: 51 },
  { src: asset("/images/g-mastermind-atorina.webp"), alt: "سارا در رویداد Mastermind Atorina", title: "Mastermind × Atorina", focus: 50 },
  { src: asset("/images/g-mastermind-turkey.webp"), alt: "سارا در رویداد Mastermind، ترکیه", title: "Mastermind ترکیه", focus: 16 },
];
