import gsap from "gsap";

/**
 * تایم‌لاینِ ورود — فقط یک‌بار، هنگام لود.
 *
 * از تایم‌لاینِ اسکرول **کامل جداست** و روی عنصرِ دیگری کار می‌کند
 * (`.l-in` در برابر `.l-scr`). دلیلش در `parallax.ts` توضیح داده شده:
 * سه سیستمِ انیمیشن نباید روی یک عنصر بنشینند.
 *
 * در پایانِ این تایم‌لاین همه‌ی لایه‌ها روی `opacity:1, scale:1, y:0`
 * می‌ایستند — یعنی دقیقاً همان ترکیب‌بندیِ گرافیکِ مرجع. تایم‌لاینِ اسکرول
 * از همین نقطه شروع می‌کند.
 */
export function initHeroIntro(root: HTMLElement): gsap.core.Timeline {
  const q = (key: string) => root.querySelector<HTMLElement>(`[data-in="${key}"]`);

  const bg = q("bg");
  const about = q("about");
  const sara = q("sara");
  const signature = q("signature");
  const bio = q("bio");
  const stars = q("stars");
  const left = q("label-left");
  const right = q("label-right");

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // ۱ — زمینه. تغییرِ رنگ نداریم، فقط از تاریکیِ کامل بیرون می‌آید.
  if (bg) tl.to(bg, { opacity: 1, duration: 0.9, ease: "power2.out" }, 0);

  // ۲ — «ABOUT ME». کمی از عقب می‌آید؛ پشتِ سارا می‌مانَد چون z آن کم‌تر است.
  if (about)
    tl.to(about, { opacity: 1, scale: 1, y: 0, duration: 1.25 }, 0.25);

  // ۳ — سارا. همان تصویرِ منبع؛ حرکت از جای‌گذاری می‌آید نه از تغییرِ شکلِ او.
  if (sara) tl.to(sara, { opacity: 1, scale: 1, y: 0, duration: 1.15 }, 0.75);

  // ۴ — امضا، با پرده‌ی چپ‌به‌راست روی خودِ دست‌خط.
  if (signature) {
    tl.to(signature, { opacity: 1, scale: 1, y: 0, duration: 0.9 }, 1.5);
    const pen = signature.querySelector<HTMLElement>("[data-pen]");
    if (pen)
      tl.to(
        pen,
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power2.inOut" },
        1.5,
      );
  }

  // ۵ — پاراگراف. بدون تایپ‌رایتر: متن باید خوانا بمانَد.
  if (bio) tl.to(bio, { opacity: 1, y: 0, duration: 0.9 }, 1.95);

  // ۶ — برچسب‌های پایین، در دو جهتِ مخالف.
  if (left) tl.to(left, { opacity: 1, x: 0, duration: 0.8 }, 2.2);
  if (right) tl.to(right, { opacity: 1, x: 0, duration: 0.8 }, 2.2);

  // ۷ — ستاره‌ها، بی سر و صدا.
  if (stars) tl.to(stars, { opacity: 1, scale: 1, duration: 0.7 }, 2.45);

  return tl;
}

/** حالتِ آغازینِ ورود. جدا نوشته شده تا حالتِ «بی‌حرکت» بتواند ردش کند. */
export function setHeroIntroStart(root: HTMLElement) {
  const q = (key: string) => root.querySelector<HTMLElement>(`[data-in="${key}"]`);
  gsap.set(q("bg"), { opacity: 0 });
  gsap.set(q("about"), { opacity: 0, scale: 0.96, y: 18 });
  gsap.set(q("sara"), { opacity: 0, scale: 0.96, y: 26 });
  gsap.set(q("signature"), { opacity: 0, scale: 0.98, y: 20 });
  gsap.set(q("bio"), { opacity: 0, y: 20 });
  gsap.set(q("stars"), { opacity: 0, scale: 0.94 });
  gsap.set(q("label-left"), { opacity: 0, x: -15 });
  gsap.set(q("label-right"), { opacity: 0, x: 15 });
  const pen = root.querySelector<HTMLElement>("[data-pen]");
  if (pen) gsap.set(pen, { clipPath: "inset(0% 100% 0% 0%)" });
}
