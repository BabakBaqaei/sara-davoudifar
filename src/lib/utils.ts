import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * ادغام کلاس‌های Tailwind با حل تعارض.
 * قرارداد استاندارد shadcn — همه‌ی کامپوننت‌های /components/ui به آن تکیه می‌کنند.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
