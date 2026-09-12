import BrandStatement from "@/components/sections/brand-statement";
import TheStory from "@/components/sections/the-story";
import TheJourney from "@/components/sections/the-journey";
import Coaching from "@/components/sections/coaching";
import SaraMethod from "@/components/sections/sara-method";
import Speaking from "@/components/sections/speaking";
import Collaborate from "@/components/sections/collaborate";
import AboutSara from "@/components/sections/about-sara";
import FinalCta from "@/components/sections/final-cta";
import SiteNav from "@/components/ui/site-nav";
import { resolveHero } from "@/components/heroes/registry";

/**
 * سایت یک روایتِ پیوسته است، نه فهرستی از بخش‌ها. ترتیب زیر خودِ قصه
 * است و جابه‌جا کردنش قصه را می‌شکند:
 *
 *   هیرو ← جمله‌ی برند ← درباره ← داستان ← مسیر ← مربی‌گری ← روش ←
 *   صحنه ← همکاری ← پایان
 *
 * ── ورزش، فقط یک‌جا ──
 * سارا گفت اولویتش با انتخابِ عمل‌کردن، توسعه‌ی فردی، ورود به کسب‌وکار،
 * بازاریابی شبکه‌ای و رهبریِ سازمان است و ورزش در یک بخش کافی است. پس
 * `SportNext` از فلو بیرون رفت و ایستگاهِ ورزشِ «مسیر» هم برداشته شد؛
 * ورزش فقط در «داستان» مانده، جایی که کارِ روایی می‌کند (ریشه‌ی انضباط).
 * فایلش دست‌نخورده است.
 *
 * «پایان» خودش فوتر است: سایت دو فوتر داشت و به‌خواستِ بابک آن یکی
 * (`sections/contact.tsx`) از فلو بیرون رفت و ویدیو و آیکون‌ها و
 * کپی‌رایتش به `final-cta.tsx` منتقل شد.
 *
 * ── سه بخشِ دیگر که بابک خواست برداشته شوند ──
 *   • `Impact` («شاهد») — عددهای ۱۲ سال، چندصد، ۵۰۰ نفر و ۱۵٬۰۰۰ دلار
 *     با آن رفتند. «۱۲ سال» هنوز در جدولِ «درباره» هست؛ بقیه دیگر
 *     هیچ‌جای سایت نیستند.
 *   • `NetworkMarketing` («سازمان»).
 *   • `ChoiceMoment` («لحظه‌ی انتخاب») — از داخلِ «داستان»، که تنها
 *     بخشِ پین‌شده‌ی سایت بود. حرفش در یک بند همان‌جا ماند.
 * هر سه فایل دست‌نخورده‌اند: برای برگرداندن، فقط import و تگ.
 *
 * «درباره» تا امروز آخر بود، با این استدلال که معرفی در بالا سایت را
 * رزومه می‌کند. بابک خواست بیاید بالا و حق داشت: چیزی که سایت را رزومه
 * می‌کند جای معرفی نیست، جنسِ آن است. پس بالا آمد و جنسش عوض شد —
 * توضیحش در خودِ `about-sara.tsx`. دو «درباره» نساختیم؛ همان یکی بالا
 * آمد.
 *
 * ── سه بخشی که از فلو برداشته شد ──
 * اندازه‌گیری نشان داد سایت ۱۱۵۰ کلمه در ۱۶ بخش بود و بخشی از آن، همان
 * حرف با لباسِ دیگر:
 *   • `FourWorlds` (۱۳۱ کلمه، دومین بخشِ بزرگ) — هر چهار قلمرواش جای
 *     دیگری هست: کسب‌وکار و رهبری در «مسیر» و «سازمان»، توسعه‌ی فردی در
 *     «مربی‌گری» و «روش»، ورزش در «داستان» و «فصل بعد».
 *   • `Media` — سه دسته‌اش با سه مسیرِ «مربی‌گری» یکی بود، و محتوایی را
 *     وعده می‌داد که هنوز وجود ندارد.
 *   • `PeopleGrown` — به بازدیدکننده «در انتظارِ محتوای واقعی» نشان
 *     می‌داد. آن پیام برای بابک است نه برای مخاطبِ سارا؛ تا رسیدنِ
 *     نمونه‌های واقعی از فلو بیرون است.
 * هر سه فایل دست‌نخورده‌اند: برای برگرداندن، فقط import و تگ را بگذار.
 *
 * ── سوییچرِ هیرو برداشته شد ──
 * تا امروز هیرو با `?hero=<کلید>` انتخاب می‌شد و یک نوارِ شناور پایینِ
 * صفحه چهار نسخه را نشان می‌داد. آن ابزارِ کارِ ما بود، نه چیزی که سارا
 * باید ببیند — و `searchParams` صفحه را داینامیک می‌کرد و مانعِ
 * `output: "export"` بود.
 *
 * حالا هیرو از `DEFAULT_HERO` در رجیستری می‌آید. برای عوض‌کردنش همان یک
 * خط در `heroes/registry.ts` کافی است؛ هر چهار هیرو و خودِ سوییچر
 * دست‌نخورده سرِ جایشان‌اند.
 */
export default function Home() {
  const { Component: Hero, navTone } = resolveHero(undefined);

  return (
    <>
      <SiteNav tone={navTone} />
      <main id="top">
        <Hero />
        <BrandStatement />
        <AboutSara />
        <TheStory />
        <TheJourney />
        <Coaching />
        <SaraMethod />
        <Speaking />
        <Collaborate />
        <FinalCta />
      </main>
    </>
  );
}
