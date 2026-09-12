/**
 * ۰۱ — جمله‌ی برند. بلافاصله بعد از هیرو.
 *
 * عمداً کم‌ترین چیزِ ممکن: یک جمله، یک پاراگرافِ کوتاه، و هیچ تزئینی.
 * بابک گفت «باید خیلی Minimal باشد» — پس این‌جا نه کارت است، نه عدد، نه
 * قاب. تنها لهجه، یک کلمه‌ی برجسته در خودِ جمله است.
 *
 * زمینه روشن است و نه تیره: هیرو تیره است و بخشِ داستان هم؛ این بخش
 * نفسِ روشنِ میانِ آن دو است.
 *
 * بالای بخش یک نوارِ گرادیانی هست که درزِ هیرو را می‌بندد. توضیحِ کاملش
 * کنارِ خودش و در `hero-v3-video.tsx` است.
 */
export default function BrandStatement() {
  return (
    <section
      aria-labelledby="statement-title"
      className="relative isolate overflow-hidden bg-bone pb-[clamp(84px,15vh,190px)] pt-[clamp(130px,26vh,320px)] text-[#1f1a16]"
      id="statement"
    >
      {/* نیمه‌ی دومِ درزِ هیرو. از همان #4d1214 شروع می‌شود که کفِ هیرو در
          آن حل شده، پس هیچ خطی بینشان نیست.
          نسخه‌ی اول ۹۹ پیکسل بود و با اینکه ریاضیاً هیچ درزی نداشت، چشم
          یک «نوار» می‌دید: شیب آن‌قدر کوتاه بود که گذار ناگهانی می‌نمود.
          حالا ۱۹vh است و `padding-top` بخش هم با آن بالا رفت.

          ارتفاعش عمداً از padding بالای بخش کوچک‌تر مانده (۱۹vh در برابر
          ۲۶vh، و ۹۶ در برابر ۱۳۰، و ۲۳۰ در برابر ۳۲۰): وگرنه تیتر روی
          قسمتِ تیره‌ی گرادیان می‌افتاد و تضادش می‌شکست. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(96px,19vh,230px)] bg-gradient-to-b from-[#4d1214] to-bone"
      />

      <div className="mx-auto max-w-[1160px] px-[clamp(20px,5vw,64px)]">
        <p
          className="reveal max-w-[30ch] font-display text-[clamp(26px,4.6vw,58px)] font-extrabold leading-[1.42] tracking-tight"
          id="statement-title"
        >
          من مسیر رشد را فقط آموزش نمی‌دهم؛{" "}
          <em className="not-italic text-rose-deep">خودم آن را زندگی کرده‌ام.</em>
        </p>

        <p className="reveal mt-[clamp(26px,4vh,48px)] max-w-[58ch] text-[clamp(15px,1.5vw,17.5px)] leading-[2.15] text-graphite">
          توسعه‌ی فردی، ورود به کسب‌وکار، دوازده سال بازاریابی شبکه‌ای و رهبری یک
          سازمان؛ مسیر من همیشه درباره‌ی یک چیز بوده است: رشد.
        </p>

        {/* این جمله پیش‌تر در بخشِ «شاهد» بود و با حذفِ آن بخش از سایت رفت.
            بابک خواست بماند و این‌جا جای درستش است: تعریفِ خودِ موفقیت،
            بلافاصله بعد از جمله‌ی برند. اندازه‌اش عمداً بینِ آن دو است تا
            ریتمِ بلند-کوتاه-متوسط بسازد و با تیترِ بالا رقابت نکند. */}
        <p className="reveal mt-[clamp(28px,4.5vh,56px)] max-w-[44ch] border-r-2 border-rose-deep/60 pr-6 font-display text-[clamp(18px,2.6vw,32px)] font-bold leading-[1.7] tracking-tight text-[#1f1a16]">
          در واقع موفقیتِ من فقط چیزی نیست که به دست آورده‌ام،{" "}
          <em className="not-italic text-rose-deep">
            چیزی است که در دیگران ایجاد کرده‌ام.
          </em>
        </p>
      </div>
    </section>
  );
}
