import { SocialIcons } from "@/components/ui/social-icons";
import { RadialBackground } from "@/components/ui/tailwind-css-background-snippet";
import VideoBackdrop from "@/components/ui/video-backdrop";

export default function Contact() {
  return (
    <footer
      id="contact"
      className="relative isolate overflow-hidden py-[clamp(84px,14vh,180px)]"
    >
      <RadialBackground className="-z-10 rotate-180" />

      {/* ویدیوی پس‌زمینه با شفافیت ۵۰٪ */}
      <VideoBackdrop
        className="absolute inset-0 -z-10"
        mp4="/video/footer-loop.mp4"
        opacity={0.5}
        poster="/video/footer-loop-poster.jpg"
        webm="/video/footer-loop.webm"
      />

      {/* لایه‌ی نشاننده — ویدیو در بالای کادر روشن است و متن روی آن
          نمی‌خواند. این گرادیان فقط بالای فوتر را می‌گیرد و پایین را
          دست‌نخورده می‌گذارد تا ویدیو دیده شود. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10
                   bg-[linear-gradient(to_bottom,rgba(8,7,10,0.86)_0%,rgba(8,7,10,0.55)_46%,rgba(8,7,10,0.72)_100%)]"
      />

      <div className="mx-auto flex max-w-[1160px] flex-col items-center px-[clamp(20px,5vw,64px)] text-center">
        <div className="mb-8 font-mono text-[10px] uppercase tracking-[0.26em] text-violet-400">
          ۱۶ — گفت‌وگو
        </div>

        <h2 className="mb-4 max-w-[20ch] text-[clamp(25px,4.2vw,52px)] leading-[1.45] tracking-tight">
          بیایید گفت‌وگو را{" "}
          <em className="font-bold not-italic text-violet-400">شروع کنیم.</em>
        </h2>

        <p className="mb-[clamp(28px,5vh,56px)] max-w-[44ch] text-[15px] leading-[2] text-neutral-400">
          برای همکاری حرفه‌ای، سخنرانی، یا مشاوره.
        </p>

        <SocialIcons />

        <div className="mt-[clamp(48px,8vh,90px)] flex w-full flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-7 text-[11.5px] tracking-[0.05em] text-neutral-500">
          <span>© ۱۴۰۵ — تمام حقوق محفوظ است.</span>
          <span>طراحی و توسعه: AFA.CO</span>
        </div>
      </div>
    </footer>
  );
}
