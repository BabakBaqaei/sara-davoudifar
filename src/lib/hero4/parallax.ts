import gsap from "gsap";
import { HERO4_LAYERS } from "./layers";

/**
 * پارالاکسِ نشانگر — فقط دسکتاپ، و فقط چند پیکسل.
 *
 * ── چرا سه لایه‌ی تودرتو ──
 * سه سیستمِ انیمیشن روی هر لایه کار می‌کند: ورود، اسکرول، ماوس. اگر دو
 * تا از این‌ها روی یک عنصر بنشینند، `transform` یکی، دیگری را پاک
 * می‌کند — GSAP هر دو را روی همان یک ویژگی می‌نویسد. پس:
 *
 *     .l-par   ← ماوس   (این فایل)
 *       .l-scr ← اسکرول (scroll.ts)
 *         .l-in ← ورود  (intro.ts)
 *
 * هر کدام `transform` خودش را دارد و مرورگر حاصلشان را ترکیب می‌کند.
 *
 * `quickTo` استفاده شده نه `to`: برای هر حرکتِ ماوس یک تویینِ نو ساختن،
 * در هر فریم چند ده شیء دور می‌ریزد. `quickTo` یک توییِن را نگه می‌دارد و
 * فقط مقدارِ هدف را عوض می‌کند، و خودش هم نرم‌کننده دارد پس حلقه‌ی
 * `requestAnimationFrame` جدا لازم نیست.
 */
export function initMouseParallax(root: HTMLElement, intensity = 1) {
  const setters = HERO4_LAYERS.map((l) => {
    const el = root.querySelector<HTMLElement>(`[data-par="${l.key}"]`);
    if (!el) return null;
    const d = l.depth * intensity;
    return {
      d,
      x: gsap.quickTo(el, "x", { duration: 0.7, ease: "power2.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.7, ease: "power2.out" }),
    };
  });

  const onMove = (e: PointerEvent) => {
    // نرمال‌شده به بازه‌ی ‎−۱..۱ نسبت به مرکزِ پنجره
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    for (const s of setters) {
      if (!s) continue;
      s.x(-nx * s.d);
      s.y(-ny * s.d);
    }
  };

  const onLeave = () => {
    for (const s of setters) {
      if (!s) continue;
      s.x(0);
      s.y(0);
    }
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);

  return () => {
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", onLeave);
    onLeave();
  };
}
