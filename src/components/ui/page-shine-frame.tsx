"use client";

/**
 * قاب درخشان دور کل صفحه.
 *
 * از همان مکانیک ShineBorder استفاده می‌کند — یک ::before با گرادیان
 * رادیالِ متحرک که با mask-composite فقط نوارِ لبه از آن باقی می‌ماند —
 * ولی به‌جای در‌بر‌گرفتن محتوا، ثابت روی viewport می‌نشیند. دلیلش دو چیز
 * است: قاب با اسکرول از صفحه بیرون نمی‌رود، و چون از جریان چیدمان بیرون
 * است هیچ اثری روی طول و عرض محتوا و روی اسکرول ندارد.
 *
 * نکته‌ی Tailwind v4: نحو کوتاه `[prop:--var]` حذف شده. مقدارها باید
 * صریح `var()` بنویسند، وگرنه مرورگر بی‌صدا `none` می‌گیرد و نه گرادیان
 * می‌آید و نه انیمیشن — بدون هیچ خطایی در کنسول.
 */
export default function PageShineFrame({
  borderWidth = 1,
  borderRadius = 0,
  duration = 14,
  color = ["#eba14a", "#8c1024", "#eba14a"],
}: {
  borderWidth?: number;
  borderRadius?: number;
  duration?: number;
  color?: string | string[];
}) {
  const stops = Array.isArray(color) ? color.join(",") : color;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40
                 before:absolute before:inset-0 before:size-full before:content-['']
                 before:rounded-[var(--border-radius)]
                 before:p-[var(--border-width)]
                 before:[background-image:var(--frame-gradient)]
                 before:[background-size:300%_300%]
                 before:[mask:var(--frame-mask)]
                 before:![-webkit-mask-composite:xor]
                 before:![mask-composite:exclude]
                 before:will-change-[background-position]
                 motion-safe:before:[animation:shine_var(--duration)_infinite_linear]"
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--border-radius": `${borderRadius}px`,
          "--duration": `${duration}s`,
          "--frame-mask":
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          "--frame-gradient": `radial-gradient(transparent,transparent,${stops},transparent,transparent)`,
        } as React.CSSProperties
      }
    />
  );
}
