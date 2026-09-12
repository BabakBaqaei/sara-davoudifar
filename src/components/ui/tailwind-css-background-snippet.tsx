import { cn } from "@/lib/utils";

/**
 * پس‌زمینه‌ی رادیال — از سیاه در بالا به بنفش در پایین.
 * به‌صورت یک لایه‌ی مطلق استفاده می‌شود، نه یک بخش مستقل.
 */
export const RadialBackground = ({ className }: { className?: string }) => {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true">
      <div className="absolute inset-0 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
    </div>
  );
};

/** نسخه‌ی تمام‌صفحه‌ی اصلی، مطابق اسنیپت مرجع. */
export const Hero = () => {
  return (
    <div className={cn("w-full relative h-screen")}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      </div>
    </div>
  );
};
