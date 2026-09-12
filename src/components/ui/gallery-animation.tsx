"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryImage = {
  src: string;
  alt: string;
  title?: string;
  /**
   * نقطه‌ی کانونی افقی، درصدی از عرض تصویر.
   *
   * لازم است چون در این گالری هر قاب در حالت عادی باریک است و
   * object-position: center از یک عکس افقی فقط نوار میانی را نشان می‌دهد.
   * در بیش‌تر عکس‌های سارا او وسط کادر نیست و آن نوار به بنر یا صندلی
   * خالی می‌افتد. با این عدد، هر قاب روی خودِ او قفل می‌شود.
   */
  focus?: number;
};

type Props = { images: GalleryImage[]; className?: string };

/**
 * گالری کشسان — قاب زیر نشانگر باز می‌شود و بقیه جمع می‌شوند.
 * کلیک، نمای کامل را در یک مودال باز می‌کند.
 */
export default function ExpandableGallery({ images, className }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);

  /**
   * بستن مودال.
   *
   * pointer-events همان لحظه و مستقیم روی DOM خاموش می‌شود، نه با variant
   * انیمیشن: تا انیمیشن خروج تمام نشود AnimatePresence عنصر را نگه می‌دارد
   * و این پوشش تمام‌صفحه با opacity صفر ولی کلیک‌گیر می‌ماند — یک مانع
   * نامرئی روی کل صفحه. اگر rAF معلق شود (تبِ پس‌زمینه، بعضی webview‌ها)
   * آن انیمیشن هرگز تمام نمی‌شود؛ و چون `exit` هم از همان خط لوله می‌گذرد،
   * گذاشتن pointerEvents داخلش مشکل را حل نمی‌کند.
   */
  const close = useCallback(() => {
    overlayRef.current?.style.setProperty("pointer-events", "none");
    setSelected(null);
  }, []);
  const step = useCallback(
    (d: number) =>
      setSelected((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  // ناوبری با کیبورد. در RTL جهت خواندن برعکس است، پس فلش راست «قبلی»
  // است و فلش چپ «بعدی» — همان‌طور که دکمه‌ها هم چیده شده‌اند.
  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(-1);
      else if (e.key === "ArrowLeft") step(1);
    };
    window.addEventListener("keydown", onKey);
    // قفل اسکرول پشت مودال
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected, close, step]);

  const flex = (i: number) => (hovered === null ? 1 : hovered === i ? 2 : 0.5);
  const fa = (n: number) => n.toLocaleString("fa-IR");

  return (
    <div className={className}>
      {/* موبایل — شبکه. ردیف کشسان در عرض کم به نوارهای ۴۰ پیکسلی
          تبدیل می‌شود و hover هم روی لمس معنا ندارد. */}
      <div className="grid grid-cols-2 gap-2 lg:hidden">
        {images.map((im, i) => (
          <button
            key={im.src}
            aria-label={`بازکردن ${im.title ?? im.alt}`}
            className="relative aspect-[4/5] overflow-hidden rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            onClick={() => setSelected(i)}
            type="button"
          >
            <Image
              alt={im.alt}
              className="object-cover"
              fill
              sizes="50vw"
              src={im.src}
              style={{ objectPosition: `${im.focus ?? 50}% center` }}
            />
          </button>
        ))}
      </div>

      {/* دسکتاپ — ردیف کشسان */}
      <div className="hidden h-[clamp(320px,44vh,440px)] w-full gap-2 lg:flex">
        {images.map((im, i) => (
          <motion.button
            key={im.src}
            animate={{ flex: flex(i) }}
            aria-label={`بازکردن ${im.title ?? im.alt}`}
            className="group relative cursor-pointer overflow-hidden rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            onClick={() => setSelected(i)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ flex: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            type="button"
          >
            <Image
              alt={im.alt}
              className="object-cover"
              fill
              sizes="(max-width: 1200px) 50vw, 40vw"
              src={im.src}
              style={{ objectPosition: `${im.focus ?? 50}% center` }}
            />

            <motion.span
              animate={{ opacity: hovered === i ? 0 : 0.42 }}
              className="pointer-events-none absolute inset-0 bg-black"
              initial={{ opacity: 0.42 }}
              transition={{ duration: 0.3 }}
            />

            {im.title && (
              <motion.span
                animate={{ opacity: hovered === i ? 1 : 0, y: hovered === i ? 0 : 8 }}
                className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4 text-right text-[13px] font-bold text-paper"
                initial={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
              >
                {im.title}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            ref={overlayRef}
            animate={{ opacity: 1 }}
            aria-label="نمای کامل تصویر"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={close}
            role="dialog"
          >
            <button
              aria-label="بستن"
              className="absolute left-4 top-4 z-10 rounded-full p-2 text-paper/80 transition-colors hover:bg-white/10 hover:text-paper"
              onClick={close}
              type="button"
            >
              <svg className="size-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {images.length > 1 && (
              <>
                {/* «قبلی» سمت راستِ فیزیکی است، چون مسیر خواندن RTL از
                    راست شروع می‌شود. */}
                <button
                  aria-label="تصویر قبلی"
                  className="absolute right-4 z-10 rounded-full p-2 text-paper/80 transition-colors hover:bg-white/10 hover:text-paper"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  type="button"
                >
                  <svg className="size-9" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  aria-label="تصویر بعدی"
                  className="absolute left-4 z-10 rounded-full p-2 text-paper/80 transition-colors hover:bg-white/10 hover:text-paper"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  type="button"
                >
                  <svg className="size-9" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}

            <motion.div
              className="relative h-[82svh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                alt={images[selected].alt}
                className="object-contain"
                fill
                preload
                sizes="(max-width: 1024px) 92vw, 1024px"
                src={images[selected].src}
              />
            </motion.div>

            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/55 px-4 py-2 text-[12px] text-paper/85 backdrop-blur-sm">
              {images[selected].title && <span>{images[selected].title}</span>}
              <span className="font-mono tabular-nums">
                {fa(selected + 1)} / {fa(images.length)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
