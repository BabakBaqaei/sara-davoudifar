"""هیروی قرمز — بدون تاریِ ساختگی، با ورودِ آهسته‌تر.

دو خواسته‌ی بابک، که با هم در تنش‌اند و باید با اندازه‌گیری حل می‌شدند:
«بلرِ روی صورت سارا را بردار» و «ورودش را آهسته‌تر و کمی اسلوموشن کن».
آهسته‌کردنِ یک تصویرِ تار، تاری را بیشتر به چشم می‌آورد نه کم‌تر.

── تاری از کجا می‌آمد: دو منبع، نه یکی ──
شارپیِ سر (واریانسِ لاپلاسین) روی خروجیِ قبلی و روی منبعِ خودِ بابک
اندازه گرفته شد:

  خروجیِ قبلی، ثانیه‌ی ۰ تا ۱.۱ : ۳.۷ تا ۲۱      ← فیلترِ خودِ ما
  منبع، ثانیه‌ی ۰.۹۶ تا ۱.۹۵    : ۷ تا ۱۳       ← تاریِ حرکت در خودِ کلیپ
  منبع، مکث (۳.۴ تا ۵.۴)        : ۹۰ تا ۱۰۵     ← مرجعِ «شفاف»

۱. **فیلترِ خودمان.** `BLUR_MAX=10px` تا ثانیه‌ی ۱.۱۰ روی *کلِ* کادر
   می‌نشست. کاملاً برداشته شد. این همان چیزی است که بابک می‌دید.

۲. **تاریِ حرکت در منبع.** موقعِ ورود، مرکزِ سارا ۳۰ تا ۳۸ پیکسل در هر
   فریم جابه‌جا می‌شود و چهره‌اش لَخت می‌شود. با آنشارپ برنمی‌گردد —
   آنشارپ لبه‌ی موجود را پررنگ می‌کند، لبه‌ی گم‌شده را نمی‌سازد.
   واهم‌آمیزیِ وینر با هسته‌ی افقی برمی‌گرداند. هسته آزموده شد
   (L = ۷، ۱۱، ۱۵، ۲۱ روی سه فریم): بهینه در هر سه **L=۱۱** بود و همان‌جا
   ماند حتی وقتی سرعتِ حرکت دو برابر می‌شد — یعنی این تاری شاترِ واقعی
   نیست، نرمیِ خودِ رندرِ کلیپ است، پس هسته‌ی ثابت درست است.
   شارپیِ سر: ۷.۵ → ۹۰. با چشم هم دیده شد: مژه، ابرو و نقشِ شال برمی‌گردند.

   `nsr` روی **۰.۰۲۰** نشست نه ۰.۰۱۰: در ۰.۰۱۰ موجِ ریزی در قرمزِ صافِ
   پشتِ سر پیدا می‌شد. برای اطمینان، نتیجه فقط **روی خودِ سوژه** نشانده
   می‌شود و زمینه دست‌نخورده می‌ماند، پس هیچ هاله‌ای در قرمز نمی‌مانَد.

   شدتش هم داده‌محور است نه زمانی: شارپیِ سرِ *همان فریم* سنجیده می‌شود و
   وزن از ۱ (سر ≤۲۰) تا ۰ (سر ≥۶۰) کم می‌شود. یعنی ورود و خروج که تارند
   درمان می‌شوند و مکث که از قبل شفاف است دست نمی‌خورد. آنشارپ هم به همان
   نسبت سبک‌تر می‌شود تا روی هم انباشته نشوند.

── چرا فقط «آهسته‌تر» کافی نبود ──
سرعت یک‌دست کم نشد، پله‌ای شد. تارترین بخشِ ورود (حرکتِ تند) نزدیک به
سرعتِ عادی می‌گذرد و اسلوموشنِ اصلی روی **رسیدن** می‌افتد — همان‌جا که
سارا کُند می‌شود و شارپی از ۲۰ به ۶۲ می‌رود. یعنی آهستگی روی لحظه‌ای
می‌نشیند که چهره‌اش خوانا است، نه روی لحظه‌ای که لَخت است.

  ورود تا نشستن: ۲.۵۰s ← ۳.۴۷s  (۳۹٪ آهسته‌تر)
"""
import io, os, subprocess, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
import numpy as np
from PIL import Image, ImageFilter
import imageio_ffmpeg as iio
import warnings
warnings.filterwarnings("ignore")

EXE = iio.get_ffmpeg_exe()
SRC = r"C:\Users\BABAK\OneDrive\Desktop\ax sara\Sara_adjusting_scarf_in_video_202609071026_1080p_20260910131928.mp4"
OUT = r"C:\Users\BABAK\OneDrive\Desktop\babak 01\sara-site\public\video"
SRC_FPS, OUT_FPS = 24, 30
CW_, CH_ = 1202, 676
CX = 1920 - CW_

PSF_LEN, NSR = 11, 0.020
SOFT_FULL, SOFT_NONE = 20.0, 60.0   # آستانه‌های شارپیِ سر

SEGS = [
    (0.92, 1.95, 0.85),   # ورود — حرکتِ تند، نزدیک به سرعتِ عادی
    (1.95, 2.62, 0.55),   # رسیدن — اسلوموشنِ اصلی، چهره این‌جا باز می‌شود
    (2.62, 3.40, 0.75),   # نشستن
    (3.40, 5.40, 0.62),   # مکث و لبخند
    (5.40, 6.45, 0.95),   # جمع‌وجور شدن
    (6.45, 7.55, 1.00),   # خروج
]

# ─────────────────────────── سنجش ───────────────────────────

_LW = np.array([0.299, 0.587, 0.114], np.float32)


def lap_var(a):
    g = a.astype(np.float32) @ _LW
    k = g[1:-1, 1:-1] * 4 - g[:-2, 1:-1] - g[2:, 1:-1] - g[1:-1, :-2] - g[1:-1, 2:]
    return float(k.var()) if k.size else 0.0


def subject_mask(a):
    """سوژه = هرچه قرمزِ زمینه نیست."""
    r = a[..., 0].astype(np.int16)
    g = a[..., 1].astype(np.int16)
    b = a[..., 2].astype(np.int16)
    return ~((r - np.maximum(g, b) > 18) & (g < 90) & (b < 90))


def head_sharpness(a, m):
    ys, xs = np.nonzero(m)
    if len(ys) < 4000:
        return None
    y0, y1 = ys.min(), ys.max()
    top = m[y0:y0 + max(8, int((y1 - y0) * 0.28))]
    tys, txs = np.nonzero(top)
    if len(txs) < 200:
        return None
    return lap_var(a[y0:y0 + top.shape[0], int(txs.min()):int(txs.max()) + 1])


# ───────────────────── واهم‌آمیزیِ وینر ─────────────────────

_H = {}


def wiener_kernel(shape):
    if shape not in _H:
        h, w = shape
        psf = np.zeros((h, w), np.float64)
        x0 = (w - PSF_LEN) // 2
        psf[h // 2, x0:x0 + PSF_LEN] = 1.0 / PSF_LEN
        H = np.fft.fft2(np.fft.ifftshift(psf))
        _H[shape] = (np.conj(H), np.abs(H) ** 2 + NSR)
    return _H[shape]


def deconvolve(a):
    Hc, den = wiener_kernel(a.shape[:2])
    out = np.empty(a.shape, np.float64)
    for c in range(3):
        out[..., c] = np.real(np.fft.ifft2(np.fft.fft2(a[..., c].astype(np.float64)) * Hc / den))
    return np.clip(out, 0, 255)


def feathered(mask_bool):
    """آلفای نرمِ سوژه. بی این، موجِ لبه در قرمز می‌مانَد."""
    m = Image.fromarray((mask_bool * 255).astype(np.uint8))
    m = m.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(4))
    return (np.asarray(m).astype(np.float32) / 255.0)[..., None]


# ─────────────────────────── اجرا ───────────────────────────

if __name__ == "__main__":
    print("برش %dx%d از x=%d" % (CW_, CH_, CX))

    os.makedirs("src7", exist_ok=True)
    for f in os.listdir("src7"):
        os.remove("src7/" + f)
    subprocess.run([EXE, "-y", "-i", SRC,
                    "-vf", "fps=%d,crop=%d:%d:%d:0" % (SRC_FPS, CW_, CH_, CX),
                    "src7/%04d.png"], capture_output=True)
    FR = sorted(f for f in os.listdir("src7") if f.endswith(".png"))
    N = len(FR)
    print("فریمِ منبع:", N)

    timeline = []
    for s0, s1, sp in SEGS:
        n = int(round((s1 - s0) / sp * OUT_FPS))
        timeline += [s0 + (k / n) * (s1 - s0) for k in range(n)]
    dur = len(timeline) / OUT_FPS
    print("خروجی %d فریم @%dfps = %.2fs" % (len(timeline), OUT_FPS, dur))
    for s0, s1, sp in SEGS:
        print("   منبع %.2f–%.2fs  ×%.2f  →  %.2fs" % (s0, s1, sp, (s1 - s0) / sp))

    processed = {}

    def build(i):
        i = max(0, min(N - 1, i))
        if i in processed:
            return processed[i]
        if len(processed) > 12:
            processed.clear()
        a = np.asarray(Image.open("src7/" + FR[i]).convert("RGB"))
        m = subject_mask(a)
        s = head_sharpness(a, m)
        if s is None:
            w = 0.0
        else:
            w = float(np.clip((SOFT_NONE - s) / (SOFT_NONE - SOFT_FULL), 0.0, 1.0))
        if w > 0.02:
            alpha = feathered(m) * w
            out = a.astype(np.float64) * (1 - alpha) + deconvolve(a) * alpha
            im = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
        else:
            im = Image.fromarray(a)
        pct = int(round(48 * (1 - w) + 18 * w))
        im = im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=pct, threshold=3))
        processed[i] = (im, s, w)
        return processed[i]

    mp4 = os.path.join(OUT, "sara-hero-red.mp4")
    proc = subprocess.Popen(
        [EXE, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "%dx%d" % (CW_, CH_),
         "-r", str(OUT_FPS), "-i", "-", "-c:v", "libx264", "-crf", "16", "-preset", "slow",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4],
        stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    for i, ts in enumerate(timeline):
        im, s, w = build(int(round(ts * SRC_FPS)))
        proc.stdin.write(im.tobytes())
        if i % 30 == 0:
            print("  %3d/%d  منبع %.2fs  شارپیِ سر %s  وزنِ ترمیم %.2f"
                  % (i, len(timeline), ts, "—" if s is None else "%6.1f" % s, w), flush=True)
    proc.stdin.close()
    proc.wait()
    print("mp4:", os.path.getsize(mp4) // 1024, "KB")

    webm = os.path.join(OUT, "sara-hero-red.webm")
    subprocess.run([EXE, "-y", "-i", mp4, "-c:v", "libvpx-vp9", "-crf", "28", "-b:v", "0",
                    "-row-mt", "1", "-an", webm], capture_output=True)
    print("webm:", os.path.getsize(webm) // 1024, "KB")

    # پوستر از میانه‌ی مکث
    pause_start = sum((s1 - s0) / sp for s0, s1, sp in SEGS[:3])
    poster_t = pause_start + (SEGS[3][1] - SEGS[3][0]) / SEGS[3][2] * 0.5
    subprocess.run([EXE, "-y", "-ss", "%.2f" % poster_t, "-i", mp4, "-frames:v", "1",
                    "-q:v", "2", os.path.join(OUT, "sara-hero-red-poster.jpg")],
                   capture_output=True)
    print("پوستر از %.2fs" % poster_t)
