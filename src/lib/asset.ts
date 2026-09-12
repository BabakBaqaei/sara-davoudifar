/**
 * مسیرِ دارایی‌های داخلِ `public/`، با احتسابِ زیرمسیرِ انتشار.
 *
 * ── چرا لازم است ──
 * `basePath` در `next.config.ts` فقط چیزهایی را پیشوند می‌دهد که خودِ
 * Next تولید می‌کند: چانک‌ها، CSS، فونت‌های `next/font`، و `next/link`.
 * هر مسیری که **ما** در JSX نوشته‌ایم دست‌نخورده می‌مانَد — `<source
 * src="/video/…">` و، چون خروجی ایستا است و بهینه‌ساز خاموش،
 * `<Image src="/images/…">` هم همین‌طور.
 *
 * با اندازه‌گیری تأیید شد: در بیلدِ آزمایشی با
 * `NEXT_PUBLIC_BASE_PATH=/sara-preview`، فونت‌ها و چانک‌ها پیشوند گرفتند
 * ولی `/video/sara-hero-red.webm` و `/images/*` بی‌پیشوند ماندند — یعنی
 * روی `USERNAME.github.io/REPO/` هیرو و همه‌ی عکس‌ها ۴۰۴ می‌شدند و سایت
 * بی ویدیو و بی عکس بالا می‌آمد.
 *
 * `NEXT_PUBLIC_*` در زمانِ بیلد جایگزین می‌شود، پس این هم در کامپوننتِ
 * سرور کار می‌کند و هم در کلاینت. اگر سایت در ریشه‌ی دامنه باشد (Vercel،
 * Netlify، دامنه‌ی اختصاصی) متغیر خالی است و این تابع چیزی عوض نمی‌کند.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return BASE + path;
}
