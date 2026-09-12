import ActionPills from "@/components/ui/action-pills";
import { SocialIcons } from "@/components/ui/social-icons";
import Image from "next/image";
import InkReveal from "@/components/ui/ink-reveal";
import { asset } from "@/lib/asset";

/**
 * پایانِ سایت — و تنها فوتر.
 *
 * سایت دو فوتر داشت: این یکی، و بخشِ «گفت‌وگو» که ویدیوی پس‌زمینه‌ی بابک
 * را داشت. به‌خواستِ او این یکی ماند و ویدیو به این‌جا آمد؛ آیکون‌های
 * شبکه‌های اجتماعی و خطِ کپی‌رایت هم از آن یکی منتقل شد تا چیزی از دست
 * نرود. `sections/contact.tsx` دیگر در فلو نیست.
 *
 * `id="contact"` عمداً همین‌جاست، چون بیشترِ لنگرهای سایت به آن اشاره
 * می‌کنند.
 *
 * «تماس با من» نیست؛ یک تصمیم است. آخرِ یک سایتِ روایت‌محور باید همان
 * حرفی را بزند که کلِ روایت رویش ایستاده: انتخاب.
 *
 * ── پرده‌ی جوهری ──
 * پس‌زمینه از ویدیو به دو پرتره‌ی سارا تغییر کرد: روشن زیر، تاریک رو، و
 * نشانگر تاریک را کنار می‌زند. توضیحِ فنی در `ui/ink-reveal.tsx`.
 *
 * پوسته‌ی مشترکِ بخش‌ها را نمی‌پوشد — نه شماره دارد و نه سرشناسه — تا از
 * ریتمِ بخش‌های قبل بیرون بزند و حسِ پایان بدهد.
 */
export default function FinalCta() {
  return (
    <footer
      aria-labelledby="final-cta-title"
      className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-char py-[clamp(76px,13vh,168px)]"
      id="contact"
    >
      {/* ── پرده‌ی جوهری ──
          بابک خواست فوتر همان کاری را بکند که هیروی ۱ می‌کرد — پرتره‌ی
          تاریکِ سارا که کنار می‌رود و پرتره‌ی روشن زیرش پیدا می‌شود — ولی
          این بار با تکنیکِ «Ink Reveal» که فرستاد: با حرکتِ نشانگر.

          چیدمانِ لایه‌ها:
            زیر  : پرتره‌ی روشن، همیشه آن‌جاست.
            روی  : بومی که پرتره‌ی تاریک را می‌کشد و نشانگر سوراخش می‌کند.
            بالا : پرده و هاله و متن.

          ویدیوی پس‌زمینه‌ی قبلی از این‌جا رفت؛ دو لایه‌ی تصویر روی هم با
          یک ویدیو، هم سنگین می‌شد و هم شلوغ. فایلِ ویدیو سرِ جایش است. */}
      <Image
        alt=""
        aria-hidden="true"
        className="-z-20 object-cover object-[50%_28%]"
        fill
        quality={82}
        sizes="100vw"
        src={asset("/images/hero-lit-1792.jpg")}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <InkReveal maskSrc={asset("/images/hero-dark-1792.jpg")} />
      </div>

      {/* هاله‌ی گرم که چشم را وسط نگه می‌دارد */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10
                   bg-[radial-gradient(ellipse_58%_46%_at_50%_46%,rgba(200,50,74,0.14),transparent_72%)]"
      />

      {/* `pointer-events-none` روی ظرفِ متن، و `auto` فقط روی چیزهایی که
          واقعاً کلیک‌پذیرند. بی این، ستونِ متن کلِ وسطِ فوتر را می‌گرفت و
          پرده‌ی جوهری فقط در حاشیه‌ها کار می‌کرد — یعنی درست همان‌جایی که
          چشم نگاه نمی‌کند. */}
      <div className="pointer-events-none mx-auto w-full max-w-[1240px] px-[clamp(20px,5vw,72px)] text-center">
        <p className="reveal text-[12.5px] tracking-[0.16em] text-chalk/85">فصلِ بعدی</p>

        <h2
          className="reveal mx-auto mt-8 max-w-[24ch] font-display text-[clamp(28px,5.6vw,74px)] font-extrabold leading-[1.26] tracking-tight text-chalk"
          id="final-cta-title"
        >
          فصلِ بعدی‌ات با یک{" "}
          <em className="not-italic text-rose-lit">تصمیم</em> شروع می‌شود.
        </h2>

        <p className="reveal mx-auto mt-7 max-w-[42ch] text-[clamp(15px,1.55vw,18px)] leading-[2.1] text-chalk/85">
          آماده‌ی رشدی؟ مسیرش را یک‌بار خودم رفته‌ام و می‌دانم از کجا شروع
          می‌شود.
        </p>

        <div className="reveal pointer-events-auto mt-[clamp(34px,5.5vh,64px)]">
          <ActionPills />
        </div>

        <div className="reveal pointer-events-auto mt-[clamp(40px,6.5vh,76px)] flex justify-center">
          <SocialIcons />
        </div>

        <div className="mt-[clamp(44px,7vh,86px)] flex w-full flex-wrap items-center justify-between gap-4 border-t border-chalk/12 pt-7 text-[11.5px] tracking-[0.05em] text-chalk/85">
          <span>© ۱۴۰۵، تمام حقوق محفوظ است.</span>
          <span>طراحی و توسعه: AFA.CO</span>
        </div>
      </div>
    </footer>
  );
}
