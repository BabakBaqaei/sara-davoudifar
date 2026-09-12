import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO4_SCROLL_LENGTH } from "./layers";

gsap.registerPlugin(ScrollTrigger);

/**
 * تایم‌لاینِ اسکرول — پیشرفتش **فقط** با اسکرول تعیین می‌شود، خودش پخش
 * نمی‌شود (`scrub`). حسِ کار باید «دوربینی که در ترکیب‌بندی جلو می‌رود»
 * باشد، نه یک انیمیشنِ رابط کاربری.
 *
 * همه‌ی حرکت‌ها روی `.l-scr` می‌نشیند تا با پارالاکسِ ماوس (روی `.l-par`)
 * و ورود (روی `.l-in`) تصادم نکند.
 *
 * دامنه‌ها عمداً کوچک‌اند. هیچ لایه‌ای ناپدید نمی‌شود: کم‌ترین شفافیت ۰.۵
 * است، پس تا لحظه‌ی آزادشدنِ هیرو همه‌ی اجزای طراحی سرِ جایشان دیده
 * می‌شوند.
 */
export function initHeroScroll(root: HTMLElement) {
  const q = (key: string) => root.querySelector<HTMLElement>(`[data-scr="${key}"]`);

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: `+=${HERO4_SCROLL_LENGTH}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // «ABOUT ME» عقب می‌نشیند — کم‌رنگ می‌شود ولی نمی‌رود.
  const about = q("about");
  if (about) tl.to(about, { scale: 0.94, y: -10, opacity: 0.85 }, 0);

  // سارا کمی جلو می‌آید. سقفِ ۱.۰۶ عمدی است: بیشتر از این صورتش به لبه‌ی
  // کادر می‌رسد و برش می‌خورد.
  const sara = q("sara");
  if (sara) tl.to(sara, { scale: 1.06, y: -10 }, 0);

  const signature = q("signature");
  if (signature) tl.to(signature, { y: -25, scale: 1.02, opacity: 0.95 }, 0);

  // پاراگراف بالا می‌رود و کم‌رنگ می‌شود، ولی تا آخر خوانا می‌مانَد.
  const bio = q("bio");
  if (bio) tl.to(bio, { y: -35, opacity: 0.8 }, 0);

  const left = q("label-left");
  if (left) tl.to(left, { x: -25, opacity: 0.6 }, 0);
  const right = q("label-right");
  if (right) tl.to(right, { x: 25, opacity: 0.6 }, 0);

  const stars = q("stars");
  if (stars) tl.to(stars, { y: -20, opacity: 0.5 }, 0);

  return tl;
}
