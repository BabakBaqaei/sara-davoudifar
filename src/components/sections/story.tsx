import { ShineBorder } from "@/components/ui/shine-border";
import { RadialBackground } from "@/components/ui/tailwind-css-background-snippet";

const NUMBERS = [
  { v: "۱۲", u: "سال", l: "ساختن تیم و توسعه‌ی افراد" },
  { v: "۵۰۰", u: "نفر", l: "آموزش‌دیده و همراهی‌شده" },
  { v: "یک", u: "سازمان", l: "چندصدنفره، تحت رهبری" },
  { v: "۱۵٬۰۰۰", u: "+ دلار", l: "سرمایه‌گذاری بر توسعه‌ی خود" },
];

const PRESENCE = [
  "PMM First Leadership ۲۰۲۳",
  "PMM 13th Anniversary",
  "Mastermind Event",
  "دانشگاه رضوی مشهد",
  "همایش تونی رابینز",
];

export default function Story() {
  return (
    <section id="story" className="relative isolate overflow-hidden py-[clamp(84px,14vh,180px)]">
      <RadialBackground className="-z-10" />

      <div className="mx-auto max-w-[1160px] px-[clamp(20px,5vw,64px)]">
        <div className="mb-8 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.26em] text-violet-400">
          ۰۱ — نقطه‌ی چرخش
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
        </div>

        <h2 className="mb-11 max-w-[26ch] text-[clamp(21px,3.2vw,40px)] leading-[1.6] tracking-tight">
          رشد را نمی‌شود انتظار کشید.{" "}
          <em className="font-bold not-italic text-violet-400">باید ساختش.</em>
        </h2>

        <div className="max-w-[64ch] space-y-6 text-[clamp(15px,1.5vw,17px)] leading-[2.25] text-neutral-300">
          <p>
            از کودکی در زمین ورزش بزرگ شدم. پدرم ورزشکار حرفه‌ای بود و انضباط، اولین چیزی بود که یاد
            گرفتم — پیش از هر درس دیگری. بسکتبال، شنا، هنرستان تربیت‌بدنی، علوم ورزشی، مدیریت ورزشی؛
            مسیری که فکر می‌کردم تا آخر همان است.
          </p>
          <p>بعد همه‌چیز تغییر کرد. آنچه سال‌ها ساخته شده بود، در فاصله‌ای کوتاه از دست رفت.</p>
          <p className="border-r-2 border-violet-500/70 pr-6 text-paper">
            آن روز دو راه پیش رویم بود: منتظر بمانم تا کسی وضعیت را درست کند، یا خودم عامل تغییرش
            باشم. راه دوم را انتخاب کردم — و همین انتخاب، دوازده سال بعدم را ساخت.
          </p>
          <p>
            امروز کاری که می‌کنم همان چیزی است که آن روز یاد گرفتم: ساختن تیم، آموزش آدم‌ها، و باز
            کردن مسیری که خودم یک‌بار در آن راه رفته‌ام.
          </p>
        </div>

        {/* نوار اعداد — داخل ShineBorder */}
        <ShineBorder
          borderRadius={16}
          borderWidth={1}
          duration={12}
          color={["#6633ee", "#a78bfa", "#6633ee"]}
          className="mt-[clamp(56px,9vh,100px)] w-full min-w-0 bg-white/[0.02] p-0 backdrop-blur-sm dark:bg-white/[0.02]"
        >
          <div className="grid w-full grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {NUMBERS.map((n) => (
              <div key={n.l} className="bg-[#0b0a12] p-8">
                <div className="text-[clamp(26px,3.6vw,42px)] leading-tight tracking-tight text-paper">
                  {n.v} <span className="text-violet-400">{n.u}</span>
                </div>
                <div className="mt-2.5 text-[13px] leading-[1.8] text-neutral-400">{n.l}</div>
              </div>
            ))}
          </div>
        </ShineBorder>

        {/* نوار حضور */}
        <div className="mt-[clamp(48px,7vh,84px)] flex flex-wrap items-center gap-x-[clamp(18px,3.2vw,48px)] gap-y-3 border-y border-white/10 py-8 text-[12.5px] tracking-[0.12em] text-neutral-500">
          <b className="font-mono text-[9.5px] font-normal tracking-[0.24em] text-violet-400/80">
            حضور
          </b>
          {PRESENCE.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
