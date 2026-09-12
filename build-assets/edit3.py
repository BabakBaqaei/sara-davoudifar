import imageio_ffmpeg as iio, subprocess, os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
from PIL import Image, ImageFilter
import numpy as np, warnings
warnings.filterwarnings("ignore")
EXE = iio.get_ffmpeg_exe()
SRC = r"C:\Users\BABAK\Downloads\Sara_adjusting_scarf_animation_1080p_202609071019.mp4"
OUT = r"C:\Users\BABAK\OneDrive\Desktop\babak 01\sara-site\public\video"
SRC_FPS, OUT_FPS = 24, 30
CW_, CH_ = 1202, 676
CX = 1920 - CW_

# ═══ چرا این نسخه جای edit2.py را گرفت ═══
# بابک گفت چهره‌ی سارا در هیرو تار است. اندازه‌گیری تأیید کرد: بیشینه‌ی
# شارپیِ منبع ۱۱۸ بود و خروجی فقط ۷۳ — یعنی ۳۷٪ جدا از کوچک‌ترشدنِ کادر
# در خودِ تدوین از دست می‌رفت. سه علت داشت:
#
#  ۱) **میانگین‌گیریِ فریم.** نسخه‌ی قبل برای هر فریمِ خروجی دو فریمِ منبع
#     را وزنی جمع می‌کرد. با ۲۴→۳۰fps تقریباً *همه‌ی* فریم‌ها کسری
#     می‌افتند، پس کلِ ویدیو — نه فقط اسلوموشن — شبح‌دار و نرم می‌شد.
#     حالا نزدیک‌ترین فریمِ منبع برداشته می‌شود؛ تکرارِ فریم استانداردِ
#     همین کار است و هر فریم تیز می‌مانَد.
#  ۲) **واسطه‌ی JPEG** با `-q:v 2` یک نسلِ افت اضافه می‌کرد. حالا PNG.
#  ۳) **CRF 20** → ۱۷.
#
# و بلرِ ورود از ۲۲px/۱.۹s به ۱۰px/۱.۱s کم شد: خواسته‌ی خودِ بابک بود که
# «با یک بلر نسبی وارد شود»، ولی ۱.۹ ثانیه از لوپِ ۸ ثانیه‌ای یعنی ۲۴٪
# وقت، صورت تار بود — و همان چیزی است که حالا به چشمش آمده.
BLUR_MAX, BLUR_END = 10.0, 1.10
SEGS = [
    (0.10, 1.90, 1.00),
    (1.90, 3.30, 1.00),
    (3.30, 5.60, 0.62),
    (5.60, 6.55, 1.00),
    (6.55, 7.94, 1.00),
]
print("crop %dx%d at x=%d" % (CW_, CH_, CX))

os.makedirs("src3", exist_ok=True)
for f in os.listdir("src3"): os.remove("src3/"+f)
subprocess.run([EXE,"-y","-i",SRC,"-vf","fps=%d,crop=%d:%d:%d:0"%(SRC_FPS,CW_,CH_,CX),
                "src3/%04d.png"], capture_output=True)
FR = sorted(f for f in os.listdir("src3") if f.endswith(".png"))
NSRC = len(FR); print("source frames:", NSRC)

timeline=[]
for s0,s1,sp in SEGS:
    n = int(round((s1-s0)/sp*OUT_FPS))
    timeline += [s0+(k/n)*(s1-s0) for k in range(n)]
NOUT=len(timeline)
print("output %d frames @ %dfps = %.2fs" % (NOUT, OUT_FPS, NOUT/OUT_FPS))

cache={}
def frame(i):
    i=max(0,min(NSRC-1,i))
    if i not in cache:
        if len(cache)>10: cache.clear()
        cache[i]=Image.open("src3/"+FR[i]).convert("RGB")
    return cache[i]

proc = subprocess.Popen(
    [EXE,"-y","-f","rawvideo","-pix_fmt","rgb24","-s","%dx%d"%(CW_,CH_),"-r",str(OUT_FPS),
     "-i","-","-c:v","libx264","-crf","17","-preset","slow","-pix_fmt","yuv420p",
     "-movflags","+faststart","-an", os.path.join(OUT,"sara-hero.mp4")],
    stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

for i,ts in enumerate(timeline):
    im = frame(int(round(ts*SRC_FPS)))          # نزدیک‌ترین فریم، بی میانگین
    t = i/OUT_FPS
    if t < BLUR_END:
        r = BLUR_MAX*(1-t/BLUR_END)**1.8
        if r > 0.4: im = im.filter(ImageFilter.GaussianBlur(r))
    else:
        # جبرانِ بزرگ‌نماییِ مرورگر؛ ملایم تا هاله نسازد
        im = im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=48, threshold=3))
    proc.stdin.write(im.tobytes())
    if i%75==0: print("  rendered", i, "/", NOUT)
proc.stdin.close(); proc.wait()
mp4 = os.path.join(OUT,"sara-hero.mp4")
print("mp4:", os.path.getsize(mp4)//1024, "KB")

subprocess.run([EXE,"-y","-i",mp4,"-c:v","libvpx-vp9","-crf","30","-b:v","0",
                "-row-mt","1","-an", os.path.join(OUT,"sara-hero.webm")], capture_output=True)
print("webm:", os.path.getsize(os.path.join(OUT,"sara-hero.webm"))//1024, "KB")
subprocess.run([EXE,"-y","-ss","4.2","-i",mp4,"-frames:v","1","-q:v","2",
                os.path.join(OUT,"sara-hero-poster.jpg")], capture_output=True)
print("poster refreshed")
