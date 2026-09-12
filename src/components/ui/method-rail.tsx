"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * ریلِ عمودی با پرتوی اسکرول‌محور.
 *
 * ایده از کامپوننتِ «Timeline» در 21st.dev (@manuarora700, Aceternity) است:
 * یک خطِ کم‌رنگ در تمام ارتفاع، و رویش پرتویی که هم‌قدمِ اسکرول پر می‌شود.
 * سه چیزش برای این پروژه عوض شد:
 *
 *   ۱. **جهت.** نسخه‌ی اصلی ریل را با `left-8` می‌چسبانَد که در RTL
 *      سمتِ اشتباه است. این‌جا `start-*` است، یعنی در فارسی راست.
 *   ۲. **رنگ.** گرادیانِ بنفش-آبیِ پیش‌فرض رفت و رُزِ برند نشست.
 *   ۳. **اندازه‌گیری.** ارتفاع در نسخه‌ی اصلی یک‌بار در `useEffect` خوانده
 *      می‌شود؛ بعد از لودِ فونتِ پیدا یا بازشدنِ صفحه در عرضِ دیگر، پرتو
 *      کوتاه یا بلندتر از ریل می‌مانْد. این‌جا `ResizeObserver` دارد.
 *
 * حالتِ سکون: خودِ گام‌ها هیچ وابستگی‌ای به این ندارند. پرتو صرفاً
 * تزئین است و `aria-hidden`؛ اگر جاوااسکریپت هم نرسد، ریلِ کم‌رنگ سرِ
 * جایش است.
 */
export default function MethodRail({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const reduced = useReducedMotion() === true;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => setHeight(node.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 65%"],
  });

  const beamHeight = useTransform(scrollYProgress, [0, 1], [0, height]);
  const beamOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);

  return (
    <div className="relative" ref={ref}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 start-[6px] w-[2px] overflow-hidden rounded-full
                   bg-gradient-to-b from-transparent via-white/12 to-transparent"
      >
        {reduced ? (
          <div className="absolute inset-0 bg-gradient-to-b from-rose-lit via-rose to-transparent" />
        ) : (
          <motion.div
            className="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-rose-lit via-rose to-rose/0"
            style={{ height: beamHeight, opacity: beamOpacity }}
          />
        )}
      </div>
      {children}
    </div>
  );
}
