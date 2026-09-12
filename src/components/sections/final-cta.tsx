import ActionPills from "@/components/ui/action-pills";
import { SocialIcons } from "@/components/ui/social-icons";
import VideoBackdrop from "@/components/ui/video-backdrop";
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
      {/* ویدیوی پس‌زمینه با شفافیت ۵۰٪ — همان که بابک داده بود */}
      <VideoBackdrop
        className="absolute inset-0 -z-20"
        mp4={asset("/video/footer-loop.mp4")}
        opacity={0.5}
        poster={asset("/video/footer-loop-poster.jpg")}
        webm={asset("/video/footer-loop.webm")}
      />

      {/* لایه‌ی نشاننده.
          عددهایش اندازه‌گیری‌شده است، نه سلیقه‌ای: روشن‌ترین نقطه‌ی فریمِ
          ویدیو روشناییِ ۰.۶۵۹ دارد و با شفافیتِ ۵۰٪ روی زمینه‌ی تیره،
          زمینه‌ی مؤثر ۰.۱۳۲ می‌شود. آن‌جا متنِ کوچکِ خاکستری فقط ۲.۱۸:۱
          می‌گرفت. با این پوششِ عمیق‌تر، زمینه‌ی مؤثر به ۰.۰۹۹ می‌رسد و
          متنِ روشن از آستانه رد می‌شود. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10
                   bg-[linear-gradient(to_bottom,rgba(26,23,25,0.94)_0%,rgba(26,23,25,0.74)_46%,rgba(26,23,25,0.88)_100%)]"
      />

      {/* هاله‌ی گرم که چشم را وسط نگه می‌دارد */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10
                   bg-[radial-gradient(ellipse_58%_46%_at_50%_46%,rgba(200,50,74,0.14),transparent_72%)]"
      />

      <div className="mx-auto w-full max-w-[1240px] px-[clamp(20px,5vw,72px)] text-center">
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

        <div className="reveal mt-[clamp(34px,5.5vh,64px)]">
          <ActionPills />
        </div>

        <div className="reveal mt-[clamp(40px,6.5vh,76px)] flex justify-center">
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
