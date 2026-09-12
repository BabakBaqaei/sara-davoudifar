import type { ComponentType } from "react";
import HeroSplit from "@/components/sections/hero-split";
import HeroAbout from "@/components/sections/hero-v2-editorial";
import HeroVideo from "@/components/sections/hero-v3-video";
import HeroLayered from "@/components/sections/hero-v4-layered";

/**
 * رجیستری هیروها.
 *
 * هر ایده‌ی هیرو یک ورودی این‌جاست و با `?hero=<کلید>` در آدرس انتخاب
 * می‌شود. افزودن هیروی بعدی یعنی یک فایل جدید در `sections/` و یک خط
 * این‌جا — هیچ هیروی موجودی دست نمی‌خورد.
 *
 * `label` فقط برای سوییچرِ زنده است تا بابک/سارا بتوانند بین نسخه‌ها
 * بروند؛ در سایت نهایی برداشته می‌شود.
 */
export type HeroEntry = {
  label: string;
  Component: ComponentType;
  /**
   * روشناییِ بالای هیرو، برای نوارِ ناوبری. حدس زدنی نیست: هیروی ویدیویی
   * زمینه‌ی کرِم دارد و متنِ سفیدِ نوار روی آن ناپدید می‌شود.
   */
  navTone: "onLight" | "onDark";
};

export const HEROES: Record<string, HeroEntry> = {
  "1": { label: "سینماتیک", Component: HeroSplit, navTone: "onDark" },
  "2": { label: "درباره", Component: HeroAbout, navTone: "onDark" },
  "3": { label: "ویدیو", Component: HeroVideo, navTone: "onDark" },
  "4": { label: "لایه‌ای", Component: HeroLayered, navTone: "onDark" },
};

/** پیش‌فرض روی هیروی ویدیویی است — درخواستِ بابک بود که ویدیو
 *  «هیروِ سایت» باشد. برای برگشت، این را به "1" تغییر بده. */
export const DEFAULT_HERO = "3";

export function resolveHero(key: string | undefined): HeroEntry {
  return (key && HEROES[key]) || HEROES[DEFAULT_HERO];
}
