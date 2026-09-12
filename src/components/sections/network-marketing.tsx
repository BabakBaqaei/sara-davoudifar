import SectionShell from "@/components/site/section-shell";

/**
 * ۰۸ — بازاریابی شبکه‌ای.
 *
 * باید باشد، ولی نباید کلِ سایت را بگیرد. عددِ «دوازده سال» و
 * «چندصدنفره» از این‌جا برداشته شد چون در «شاهد» و «مسیر» هم بودند —
 * سه‌بار گفتنِ یک عدد، آن را بزرگ‌تر نمی‌کند. دعوتِ این بخش هم حذف شد
 * چون دو بخش بعد، «همکاری» همان دعوت را می‌کند. پس عنوان درباره‌ی «ساختنِ آدم و
 * سازمان» است نه درباره‌ی صنعت، بخش کوتاه است، و هیچ عددِ درآمدی و هیچ
 * دعوتِ عضوگیریِ تهاجمی ندارد — روی سایتِ یک برندِ شخصی، آن‌ها اعتبار را
 * می‌برند نه می‌آورند.
 */

/* این ستون‌ها درباره‌ی **سازمان**‌اند، نه رشدِ فردی. نسخه‌ی اول
   «رشدِ مالی» داشت که عیناً یکی از سه مسیرِ بخشِ مربی‌گری بود. */
const PILLARS = [
  { fa: "ساختِ تیم", en: "Team Building" },
  { fa: "آموزشِ درون‌سازمانی", en: "Internal Training" },
  { fa: "جانشین‌پروری", en: "Succession" },
  { fa: "مقیاس‌پذیری", en: "Scale" },
];

export default function NetworkMarketing() {
  return (
    <SectionShell id="network" eyebrow="سازمان" tone="dark">
      <div className="reveal max-w-[22ch] font-display text-[clamp(25px,4.2vw,50px)] font-extrabold leading-[1.3] tracking-tight text-chalk">
        <span className="block">آدم می‌سازم.</span>
        <span className="block text-rose-lit">سازمان می‌سازم.</span>
      </div>
      <p className="reveal mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-dust">
        Building people. Building organizations.
      </p>

      <p className="reveal mt-[clamp(28px,4.5vh,52px)] max-w-[54ch] text-[clamp(14.5px,1.45vw,16.5px)] leading-[2.15] text-dust">
        از فعالیتِ فردی شروع شد و به ساختن و رهبریِ یک سازمان رسید. آنچه این‌جا
        یاد گرفتم، بعدها پایه‌ی مربی‌گری‌ام شد.
      </p>

      <ul className="reveal mt-[clamp(32px,5vh,60px)] flex flex-wrap items-center gap-x-[clamp(18px,3.2vw,44px)] gap-y-4 border-y border-white/10 py-7">
        {PILLARS.map((p) => (
          <li className="flex flex-col gap-1" key={p.en}>
            <span className="text-[15px] leading-tight text-chalk">{p.fa}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-dust">
              {p.en}
            </span>
          </li>
        ))}
      </ul>

    </SectionShell>
  );
}
