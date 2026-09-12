import gsap from "gsap";

/**
 * حالتِ «حرکتِ کم».
 *
 * قاعده‌ی پروژه: خوانایی به انیمیشن گره نمی‌خورد. پس این‌جا چیزی «خاموش»
 * نمی‌شود که محتوا را ببرد — همه‌ی لایه‌ها مستقیم روی حالتِ نهاییِ خودشان
 * می‌نشینند، یعنی همان ترکیب‌بندیِ گرافیکِ مرجع. نه ورودی، نه اسکرولی، نه
 * پارالاکسی.
 */
export function applyReducedMotion(root: HTMLElement) {
  const all = root.querySelectorAll<HTMLElement>("[data-in], [data-scr], [data-par]");
  gsap.set(all, { clearProps: "all" });
  gsap.set(all, { opacity: 1, x: 0, y: 0, scale: 1 });
  const pen = root.querySelector<HTMLElement>("[data-pen]");
  if (pen) gsap.set(pen, { clipPath: "inset(0% 0% 0% 0%)" });
}
