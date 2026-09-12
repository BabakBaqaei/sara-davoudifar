import type { NextConfig } from "next";

/**
 * ── خروجیِ ایستا برای انتشار روی GitHub Pages ──
 *
 * `output: "export"` کلِ سایت را به HTML و دارایی‌های ثابت تبدیل می‌کند،
 * پس هیچ سروری لازم نیست. سه پیامد دارد که هر سه در کد لحاظ شده‌اند:
 *
 *   ۱. **هیچ روتی نمی‌تواند داینامیک باشد.** `page.tsx` قبلاً `searchParams`
 *      می‌گرفت (برای سوییچرِ هیرو) و همین صفحه را داینامیک می‌کرد. آن
 *      برداشته شد؛ هیرو از `DEFAULT_HERO` در رجیستری می‌آید.
 *   ۲. **بهینه‌سازِ تصویر کار نمی‌کند** (`unoptimized: true`)، یعنی فایل‌ها
 *      عیناً سرو می‌شوند. به همین دلیل عکس‌های سنگین به webp رفتند.
 *   ۳. **زیرمسیر.** روی `USERNAME.github.io/REPO/` همه‌ی دارایی‌ها باید با
 *      `/REPO` پیشوند بگیرند. این از متغیرِ محیطی خوانده می‌شود تا هم
 *      روی Pages کار کند و هم روی هاستی که سایت را در ریشه می‌گذارد
 *      (Vercel، Netlify، Cloudflare): آن‌جا متغیر را خالی بگذار.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  /** بی این، لینک‌های داخلی روی Pages به ۴۰۴ می‌خورند: هر صفحه پوشه‌ی
   *  خودش با `index.html` می‌شود. */
  trailingSlash: true,
  images: {
    unoptimized: true,
    /**
     * از Next.js 16 پیش‌فرض qualities برابر [75] است و هر مقدار دیگری
     * بی‌صدا به نزدیک‌ترین عضو مجاز تنزل می‌کند. با `unoptimized` بی‌اثر
     * است ولی می‌مانَد تا اگر روزی به هاستِ داینامیک رفتیم دوباره کار کند.
     */
    qualities: [75, 88],
  },
};

export default nextConfig;
