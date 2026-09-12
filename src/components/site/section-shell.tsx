import type { ReactNode } from "react";

type Props = {
  id: string;
  /** برچسبِ فارسیِ کوتاه — چیزی که بخش *هست*، نه شماره‌ی آن */
  eyebrow: string;
  children: ReactNode;
  /**
   * پرده‌ی روشن یا تیره. سایت با ارزشِ روشنایی قصه می‌گوید، نه با
   * راه‌راهِ یک‌درمیان: هیرو روشن است، سقوط تیره می‌شود، برخاستن روشن.
   * گروه‌بندی در `page.tsx` نوشته شده.
   */
  tone: "light" | "dark";
  /**
   * فقط برای بخش‌هایی که محتوایشان **واقعاً** ترتیب دارد (مسیر، روش).
   * شماره‌گذاریِ همه‌ی بخش‌ها تزئین است نه اطلاع — و همان چیزی است که
   * سایت را قالبی می‌کند.
   */
  seq?: string;
  className?: string;
};

/**
 * پوسته‌ی مشترکِ بخش‌ها.
 *
 * نسخه‌ی اول هر شانزده بخش را با «۰۱ — LABEL» و یک خطِ گرادیانی شروع
 * می‌کرد. آن الگو دو عیب داشت: شماره برای بخش‌هایی که ترتیب ندارند
 * (تأثیر، همکاری، درباره) اطلاعی حمل نمی‌کرد، و تکرارِ یک سرشناسه‌ی
 * یکسان در شانزده بخش، ریتم را یکنواخت و «ماشینی» می‌کرد.
 *
 * حالا سرشناسه یک برچسبِ فارسیِ کوتاه است با یک خطِ مویی که فقط تا
 * عرضِ خودِ برچسب می‌آید — و سلسله‌مراتب از مقیاسِ تایپ می‌آید، نه از
 * تکرارِ یک قالب.
 */
export default function SectionShell({
  id,
  eyebrow,
  children,
  tone,
  seq,
  className = "",
}: Props) {
  const dark = tone === "dark";
  return (
    <section
      className={`relative isolate overflow-hidden py-[clamp(88px,15vh,196px)] ${
        dark ? "bg-char text-chalk" : "bg-bone text-graphite"
      } ${className}`}
      id={id}
    >
      <div className="mx-auto max-w-[1240px] px-[clamp(20px,5vw,72px)]">
        <div className="reveal mb-[clamp(28px,4.5vh,56px)] flex items-center gap-3.5">
          {seq && (
            <span
              className={`font-display text-[13px] font-extrabold tabular-nums ${
                dark ? "text-rose-lit" : "text-rose-deep"
              }`}
            >
              {seq}
            </span>
          )}
          <span
            className={`text-[12.5px] tracking-[0.16em] ${
              dark ? "text-dust" : "text-graphite"
            }`}
          >
            {eyebrow}
          </span>
          <span
            aria-hidden="true"
            className={`h-px w-[clamp(28px,6vw,72px)] ${
              dark ? "bg-chalk/25" : "bg-graphite/25"
            }`}
          />
        </div>
        {children}
      </div>
    </section>
  );
}
