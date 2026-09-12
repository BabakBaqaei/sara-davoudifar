"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * پرده‌ای که با حرکتِ نشانگر کنار می‌رود، مثل جوهری که روی کاغذ باز شود.
 *
 * منبع: کامپوننتِ «Ink Reveal» از 21st.dev که بابک فرستاد. فیزیکش
 * دست‌نخورده ماند — مهرهای دایره‌ایِ لرزان با گرادیانِ شعاعی، عمرِ
 * محدود، و `destination-out` که سوراخشان می‌کند. سه چیز عوض شد:
 *
 *   ۱. **پرده یک رنگِ تخت نیست، یک تصویر است.** نسخه‌ی اصلی هر فریم
 *      `fillRect` با یک رنگ می‌زد. این‌جا `drawImage` می‌زند، پس چیزی که
 *      کنار می‌رود پرتره‌ی تاریکِ ساراست و زیرش پرتره‌ی روشن پیدا می‌شود.
 *      همان ایده‌ی هیروی ۱، فقط با نشانگر به‌جای اسکرول.
 *
 *   ۲. **لمس هم کار می‌کند.** نسخه‌ی اصلی فقط `onMouse*` داشت، یعنی روی
 *      موبایل هیچ اتفاقی نمی‌افتاد. با `PointerEvent` هر سه ورودی
 *      (ماوس، قلم، لمس) یکی می‌شوند.
 *
 *   ۳. **`cursor: none` برداشته شد.** روی یک فوتر که دکمه و لینک دارد،
 *      ناپدیدکردنِ نشانگر یعنی کاربر نمی‌داند کجا کلیک می‌کند.
 *
 * **حالتِ سکون:** اگر هیچ‌وقت نشانگری نیاید — موبایل، صفحه‌کلید،
 * `prefers-reduced-motion` — پرتره‌ی تاریک سرِ جایش می‌مانَد و چیزی از
 * محتوا گم نمی‌شود. متنِ فوتر روی این پرده نیست، بالای آن است.
 */

type Props = {
  /** تصویری که نقشِ پرده را دارد و کنار می‌رود */
  maskSrc: string;
  brushSize?: number;
  lifetime?: number;
  rStart?: number;
  rVary?: number;
  stampStep?: number;
  maxStamps?: number;
  segments?: number;
  wobble?: [number, number, number];
  gradientInnerRadius?: number;
  gradientStops?: [number, number, number];
  className?: string;
};

type Stamp = { x: number; y: number; born: number; seed: number; rmax: number };

export default function InkReveal({
  maskSrc,
  brushSize = 150,
  lifetime = 900,
  rStart = 12,
  rVary = 0.45,
  stampStep = 12,
  maxStamps = 160,
  segments = 36,
  wobble = [0.14, 0.08, 0.05],
  gradientInnerRadius = 0.2,
  gradientStops = [0.95, 0.88, 0],
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLImageElement | null>(null);
  const stampsRef = useRef<Stamp[]>([]);
  const runningRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const dimsRef = useRef({ w: 0, h: 0 });

  /** پرده را طوری می‌کشد که مثل `object-cover` کلِ کادر را بگیرد. */
  const paintMask = useCallback((ctx: CanvasRenderingContext2D) => {
    const { w, h } = dimsRef.current;
    const img = maskRef.current;
    ctx.globalCompositeOperation = "source-over";
    if (!img || !img.complete || !img.naturalWidth) {
      ctx.clearRect(0, 0, w, h);
      return;
    }
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * s;
    const dh = img.naturalHeight * s;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = parent.getBoundingClientRect();
    dimsRef.current = { w: rect.width, h: rect.height };
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintMask(ctx);
  }, [paintMask]);

  const carveInk = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, seed: number, alpha: number) => {
      const g = ctx.createRadialGradient(x, y, r * gradientInnerRadius, x, y, r);
      g.addColorStop(0, `rgba(0,0,0,${gradientStops[0] * alpha})`);
      g.addColorStop(0.5, `rgba(0,0,0,${gradientStops[1] * alpha})`);
      g.addColorStop(1, `rgba(0,0,0,${gradientStops[2] * alpha})`);
      ctx.fillStyle = g;
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const wob =
          0.78 +
          wobble[0] * Math.sin(a * 3 + seed) +
          wobble[1] * Math.sin(a * 5 + seed * 2.1) +
          wobble[2] * Math.sin(a * 7 + seed * 0.7);
        const px = x + Math.cos(a) * r * wob;
        const py = y + Math.sin(a) * r * wob;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    },
    [segments, wobble, gradientInnerRadius, gradientStops],
  );

  const loop = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const now = performance.now();
    const stamps = stampsRef.current;

    paintMask(ctx);
    ctx.globalCompositeOperation = "destination-out";

    for (let i = stamps.length - 1; i >= 0; i--) {
      const t = (now - stamps[i].born) / lifetime;
      if (t >= 1) {
        stamps.splice(i, 1);
        continue;
      }
      const ease = 1 - Math.pow(1 - t, 3);
      const r = rStart + (stamps[i].rmax - rStart) * ease;
      carveInk(ctx, stamps[i].x, stamps[i].y, r, stamps[i].seed, 1 - t * t);
    }

    if (stamps.length) requestAnimationFrame(loop);
    else runningRef.current = false;
  }, [carveInk, paintMask, lifetime, rStart]);

  const startLoop = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    requestAnimationFrame(loop);
  }, [loop]);

  const addStamp = useCallback(
    (x: number, y: number) => {
      const stamps = stampsRef.current;
      if (stamps.length >= maxStamps) stamps.shift();
      stamps.push({
        x,
        y,
        born: performance.now(),
        seed: Math.random() * Math.PI * 2,
        rmax: brushSize * (1 - rVary + Math.random() * rVary),
      });
    },
    [brushSize, rVary, maxStamps],
  );

  const stampAlong = useCallback(
    (x: number, y: number) => {
      const last = lastPosRef.current;
      if (!last) {
        addStamp(x, y);
      } else {
        const dx = x - last.x;
        const dy = y - last.y;
        const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / stampStep));
        for (let i = 1; i <= steps; i++) {
          addStamp(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
        }
      }
      lastPosRef.current = { x, y };
    },
    [addStamp, stampStep],
  );

  useEffect(() => {
    const img = new Image();
    img.decoding = "async";
    img.src = maskSrc;
    maskRef.current = img;
    const onReady = () => resize();
    if (img.complete) onReady();
    else img.addEventListener("load", onReady, { once: true });
    return () => img.removeEventListener("load", onReady);
  }, [maskSrc, resize]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    /* ارتفاعِ فوتر با شکستنِ متن عوض می‌شود و `resize` پنجره آن را
       نمی‌گیرد؛ بی این، بوم با کادر ناهم‌اندازه می‌مانَد. */
    const ro = new ResizeObserver(resize);
    const parent = canvasRef.current?.parentElement;
    if (parent) ro.observe(parent);
    return () => {
      window.removeEventListener("resize", resize);
      ro.disconnect();
    };
  }, [resize]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <canvas
      aria-hidden="true"
      className={`pointer-events-auto absolute inset-0 ${className ?? ""}`}
      onPointerDown={(e) => {
        const p = pos(e);
        lastPosRef.current = p;
        stampAlong(p.x, p.y);
        startLoop();
      }}
      onPointerEnter={(e) => {
        const p = pos(e);
        lastPosRef.current = p;
        stampAlong(p.x, p.y);
        startLoop();
      }}
      onPointerLeave={() => {
        lastPosRef.current = null;
      }}
      onPointerMove={(e) => {
        const p = pos(e);
        stampAlong(p.x, p.y);
        startLoop();
      }}
      ref={canvasRef}
    />
  );
}
