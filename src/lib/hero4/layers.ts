import { asset } from "@/lib/asset";

/**
 * فهرستِ لایه‌های هیروی ۴ — تنها منبعِ حقیقت برای ترتیب، عمق و متنِ جانشین.
 *
 * هر لایه یک webp تمام‌فریمِ ۲۵۶۰×۱۴۲۹ است که موقعیتش در خودِ فایل پخته
 * شده. یعنی در DOM همه با `absolute inset-0` روی هم می‌نشینند و هیچ
 * جای‌گذاریِ دستی لازم نیست؛ ترکیب‌بندی مو‌به‌مو همان گرافیکِ مرجع می‌مانَد
 * و با تغییرِ اندازه‌ی پنجره هم از هم نمی‌پاشد.
 *
 * `depth` شدتِ پارالاکسِ ماوس به پیکسل است — عمداً کم: زمینه کم‌ترین،
 * سارا بیش‌ترین. `z` ترتیبِ روی‌هم‌افتادن است.
 */
export type Hero4Layer = {
  /** کلید — هم برای `data-layer` و هم برای هدف‌گیری در انیمیشن‌ها */
  key: string;
  src: string;
  /** خالی یعنی تزئینی؛ کامپوننت آن را `aria-hidden` می‌کند */
  alt: string;
  /** دامنه‌ی جابه‌جایی با ماوس، پیکسل */
  depth: number;
  z: number;
  /** لایه‌هایی که باید زودتر برسند — بی این‌ها کادر خالی دیده می‌شود */
  critical?: boolean;
  /** لایه‌ی زمینه — ترتیبش صفر است و متنِ جانشین ندارد */
  isBackdrop?: boolean;
};

export const HERO4_LAYERS: Hero4Layer[] = [
  {
    key: "bg",
    src: asset("/images/hero4/bg.webp"),
    alt: "",
    depth: 2,
    z: 0,
    critical: true,
    isBackdrop: true,
  },
  {
    key: "about",
    src: asset("/images/hero4/about.webp"),
    alt: "",
    depth: 4,
    z: 1,
    critical: true,
  },
  {
    key: "sara",
    src: asset("/images/hero4/sara.webp"),
    alt: "سارا داودی‌فر",
    depth: 7,
    z: 2,
    critical: true,
  },
  {
    key: "signature",
    src: asset("/images/hero4/signature.webp"),
    alt: "",
    depth: 3,
    z: 3,
  },
  {
    key: "bio",
    src: asset("/images/hero4/bio.webp"),
    alt:
      "سارا داودی‌فر، کارآفرین، رهبر و مربی با دوازده سال تجربه در نتورک " +
      "مارکتینگ و علاقه‌ای همیشگی به ورزش و رشد فردی. باور دارد رشد با " +
      "مسئولیت‌پذیری، پذیرفتنِ چالش و سرمایه‌گذاری پیوسته روی خود آغاز " +
      "می‌شود. امروز به آدم‌ها کمک می‌کند فردی، حرفه‌ای و مالی رشد کنند.",
    depth: 3,
    z: 3,
  },
  { key: "stars", src: asset("/images/hero4/stars.webp"), alt: "", depth: 3, z: 4 },
  {
    key: "label-left",
    src: asset("/images/hero4/label-left.webp"),
    alt: "",
    depth: 3,
    z: 4,
  },
  {
    key: "label-right",
    src: asset("/images/hero4/label-right.webp"),
    alt: "",
    depth: 3,
    z: 4,
  },
];

/** جعبه‌ی مشترکِ همه‌ی لایه‌ها — برای مستندسازی و آزمون */
export const HERO4_FRAME = { width: 2560, height: 1429, aspect: 2560 / 1429 };

/** طولِ اسکرولِ پین‌شده به پیکسل. کوتاه نگه داشته شده: بخشِ بعدی نباید دیر برسد. */
export const HERO4_SCROLL_LENGTH = 1200;
