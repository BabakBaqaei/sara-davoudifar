import SectionShell from "@/components/site/section-shell";

/**
 * ۱۳ — همکاری.
 *
 * «پروژه‌های ورزشی» از فهرست برداشته شد چون سارا گفت ورزش یک اشاره
 * کافی است و آن اشاره در «داستان» است.
 *
 * این بخش مستقیم از حرفِ خودِ سارا می‌آید: او فقط مخاطبِ عمومی نمی‌خواهد،
 * می‌خواهد برندها و شرکت‌ها هم او را ببینند. پس مخاطبِ این بخش سازمان
 * است، نه فرد — و لحنش هم همان است.
 */

const AUDIENCES = [
  { fa: "برندها", en: "Brands" },
  { fa: "کسب‌وکارها", en: "Businesses" },
  { fa: "رویدادها", en: "Events" },
  { fa: "آموزش", en: "Education" },
  { fa: "همکاری‌های تجاری", en: "Business Collaborations" },
];

export default function Collaborate() {
  return (
    <SectionShell id="collaborate" eyebrow="همکاری" tone="dark">
      <h2 className="reveal max-w-[22ch] font-display text-[clamp(26px,4.4vw,54px)] font-extrabold leading-[1.3] tracking-tight text-chalk">
        بیایید چیزی بسازیم که{" "}
        <em className="not-italic text-rose-lit">معنا داشته باشد.</em>
      </h2>
      <p className="reveal mt-5 font-mono text-[11px] uppercase tracking-[0.28em] md:text-[10px] text-dust">
        Let&rsquo;s build something meaningful.
      </p>

      <ul className="mt-[clamp(40px,6vh,80px)] grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {AUDIENCES.map((a) => (
          <li
            className="reveal bg-char-2 p-7 transition-colors duration-300 hover:bg-[#2b2528]"
            key={a.en}
          >
            <div className="text-[clamp(16px,1.9vw,20px)] leading-tight text-chalk">{a.fa}</div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] md:text-[9.5px] text-dust">
              {a.en}
            </div>
          </li>
        ))}
      </ul>

      <a
        className="reveal group mt-[clamp(36px,5.5vh,68px)] inline-flex items-center gap-3 rounded-full bg-chalk px-7 py-3.5
                   text-[13.5px] font-bold text-char transition-transform duration-300 hover:scale-[1.03]
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-lit"
        href="#contact"
      >
        همکاری با سارا
        <svg
          aria-hidden="true"
          className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path d="M19 12H5m0 0 6-6m-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </SectionShell>
  );
}
