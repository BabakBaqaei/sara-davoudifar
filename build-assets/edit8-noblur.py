"""هیروی قرمز — همان نسخه‌ی فعلی، فقط بدون تاریِ ساختگیِ ورود.

── چرا این بار کوچک است ──
`edit7` سه کار با هم کرد: تاریِ خودمان را برداشت، تاریِ حرکتِ خودِ کلیپ را
با واهم‌آمیزیِ وینر ترمیم کرد، و سرعت را پله‌ای کرد. بابک نتیجه را بدتر
دید و همه‌اش برگشت. حالا که دوباره همان خواسته آمده («افکتی که چهره را تار
کرده بردار، مثل نمونه‌ی خامِ ویدیو باکیفیت شود»)، فقط **یک** چیز عوض
می‌شود:

    BLUR_MAX: 10.0 → 0

یعنی گاوسیِ ۱۰ پیکسلی که تا ثانیه‌ی ۱.۱۰ روی **کلِ کادر** می‌نشست، حذف
می‌شود. هیچ ترمیمِ تصویریِ تازه‌ای اضافه نمی‌شود — همان چیزی که بار قبل
پوست را سخت و پردازش‌شده نشان داد. زمان‌بندی، آنشارپ، برش، CRF و همه‌چیزِ
دیگر دقیقاً مثل نسخه‌ی فعلی می‌مانَد.

نتیجه‌اش این است که فریم‌های ورود حالا آنشارپِ معمولِ کلیپ را می‌گیرند
(radius 1.1، percent 48) به‌جای بلر — یعنی «مثل خام، ولی تمیز».

نرمیِ باقی‌مانده‌ی ثانیه‌ی اول، تاریِ حرکت در خودِ فایلِ بابک است (سارا
۳۰ تا ۳۸ پیکسل در هر فریم جابه‌جا می‌شود). آن با هیچ فیلترِ بی‌خطری
برنمی‌گردد و تنها راهش همان واهم‌آمیزی بود که رد شد.
"""
import imageio_ffmpeg as iio, subprocess, os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
from PIL import Image, ImageFilter
import warnings
warnings.filterwarnings("ignore")

EXE = iio.get_ffmpeg_exe()
SRC = r"C:\Users\BABAK\OneDrive\Desktop\ax sara\Sara_adjusting_scarf_in_video_202609071026_1080p_20260910131928.mp4"
OUT = r"C:\Users\BABAK\OneDrive\Desktop\babak 01\sara-site\public\video"
SRC_FPS, OUT_FPS = 24, 30
CW_, CH_ = 1202, 676
CX = 1920 - CW_

# ── تنها تغییر نسبت به نسخه‌ی فعلی ──
BLUR_MAX = 0.0

SEGS = [
    (0.90, 1.95, 1.00),
    (1.95, 3.40, 1.00),
    (3.40, 5.40, 0.62),
    (5.40, 6.45, 1.00),
    (6.45, 7.55, 1.00),
]

print("برش %dx%d از x=%d  ·  بلرِ ورود: %s" % (CW_, CH_, CX, "ندارد" if BLUR_MAX == 0 else BLUR_MAX))

os.makedirs("src8", exist_ok=True)
for f in os.listdir("src8"):
    os.remove("src8/" + f)
subprocess.run([EXE, "-y", "-i", SRC,
                "-vf", "fps=%d,crop=%d:%d:%d:0" % (SRC_FPS, CW_, CH_, CX),
                "src8/%04d.png"], capture_output=True)
FR = sorted(f for f in os.listdir("src8") if f.endswith(".png"))
N = len(FR)
print("فریمِ منبع:", N)

timeline = []
for s0, s1, sp in SEGS:
    n = int(round((s1 - s0) / sp * OUT_FPS))
    timeline += [s0 + (k / n) * (s1 - s0) for k in range(n)]
print("خروجی %d فریم @%dfps = %.2fs" % (len(timeline), OUT_FPS, len(timeline) / OUT_FPS))

cache = {}


def frame(i):
    i = max(0, min(N - 1, i))
    if i not in cache:
        if len(cache) > 10:
            cache.clear()
        cache[i] = Image.open("src8/" + FR[i]).convert("RGB")
    return cache[i]


mp4 = os.path.join(OUT, "sara-hero-red.mp4")
proc = subprocess.Popen(
    [EXE, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "%dx%d" % (CW_, CH_),
     "-r", str(OUT_FPS), "-i", "-", "-c:v", "libx264", "-crf", "17", "-preset", "slow",
     "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4],
    stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

for i, ts in enumerate(timeline):
    im = frame(int(round(ts * SRC_FPS)))
    im = im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=48, threshold=3))
    proc.stdin.write(im.tobytes())
    if i % 60 == 0:
        print("  %d/%d" % (i, len(timeline)), flush=True)
proc.stdin.close()
proc.wait()
print("mp4:", os.path.getsize(mp4) // 1024, "KB")

webm = os.path.join(OUT, "sara-hero-red.webm")
subprocess.run([EXE, "-y", "-i", mp4, "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0",
                "-row-mt", "1", "-an", webm], capture_output=True)
print("webm:", os.path.getsize(webm) // 1024, "KB")

subprocess.run([EXE, "-y", "-ss", "4.3", "-i", mp4, "-frames:v", "1", "-q:v", "2",
                os.path.join(OUT, "sara-hero-red-poster.jpg")], capture_output=True)
print("پوستر از ثانیه‌ی ۴.۳")
