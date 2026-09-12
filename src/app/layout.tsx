import type { Metadata } from "next";
import localFont from "next/font/local";
import PageShineFrame from "@/components/ui/page-shine-frame";
import "./globals.css";

/**
 * پیدا (Peyda v3، نسخه‌ی Standard) — سه وزن، مجموعاً ۱۳۲KB.
 *   ۴۰۰ متن · ۷۰۰ `font-bold` · ۸۰۰ `font-display` برای تیترها
 *
 * از `@font-face` در `globals.css` به این‌جا آمد تا انتشار روی زیرمسیر
 * نشکند؛ توضیحِ کامل در `globals.css`.
 */
const peyda = localFont({
  src: [
    { path: "../../public/fonts/Peyda-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Peyda-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Peyda-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-peyda",
  display: "swap",
  fallback: ["Tahoma", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  title: "سارا داودی‌فر",
  description:
    "سارا داودی‌فر، کارآفرین، رهبر سازمان و مربی. انضباط از ورزش، ساختن در کسب‌وکار، رشد در آدم‌ها.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={peyda.variable} dir="rtl" lang="fa">
      <body className="antialiased">
        {children}
        <PageShineFrame borderWidth={2} />
      </body>
    </html>
  );
}
