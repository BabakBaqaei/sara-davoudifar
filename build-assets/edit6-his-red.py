"""هیرو از ویدیوی قرمزِ خودِ بابک — با همان تنظیماتِ نسخه‌ی کرِم.

بابک خودش کلیپ را با زمینه‌ی قرمز رندر کرد، پس دیگر هیچ ماتی لازم نیست:
نه rembg، نه لبه‌سازی، نه ترکیب. همان خطِ لوله‌ی `edit3.py` است و فقط
نقشه‌ی زمانی روی زمان‌بندیِ تازه‌ی او نگاشت شده.

── چرا زمان‌بندی عوض شد ──
کلیپِ او همان کلیپ است ولی ریتمش فرق دارد. از خودِ فایل اندازه‌گیری شد
(سطحِ سوژه، مرکزِ افقی، شارپی و حرکت، هر ۱/۸ ثانیه):

    ۰.۰۰–۰.۸۸   کادر خالی
    ۰.۹۰–۱.۹۵   ورود از راست (مرکز ۹۴٪ → ۶۸٪)، حرکتِ زیاد، شارپیِ کم
    ۱.۹۵–۳.۴۰   نشستن (مرکز ۵۷–۶۵٪)
    ۳.۴۰–۵.۴۰   **مکث و لبخند** — بیشینه‌ی شارپی (۸۷–۱۰۵)، کمینه‌ی حرکت
    ۵.۴۰–۶.۴۵   جمع‌وجور شدن
    ۶.۴۵–۷.۵۵   خروج به چپ

مرکزِ او در مکث روی ۶۵.۵٪ عرضِ منبع می‌افتد — دقیقاً مثل نسخه‌ی کرِم —
پس همان برشِ ۱۲۰۲×۶۷۶ از لبه‌ی راست کار می‌کند و سارا در ۴۴.۹٪ کادر،
یعنی نیمه‌ی چپ، می‌نشیند.

── چرا در ۷.۵۵ تمام می‌شود ──
در کادرِ کاملِ ۱۹۲۰ او تا انتهای کلیپ هنوز کمی پیداست، ولی برش از ۳۷.۴٪
به بعد است و لبه‌ی راستش در ۷.۳۵ ثانیه از آن رد می‌شود. پس در کادرِ ما
همان‌جا کامل بیرون است و ۰.۲ ثانیه کادرِ خالی برای بستنِ درزِ لوپ کافی
است. (درسِ دفعه‌ی قبل: ۱.۲ ثانیه کادرِ خالی روی قرمز مثل خرابی دیده
می‌شود.)

بقیه‌ی تنظیمات دست‌نخورده: نزدیک‌ترین فریم به‌جای میانگین‌گیری، واسطه‌ی
PNG، بلرِ ورودِ ۱۰px تا ۱.۱s، آنشارپِ ۴۸٪، CRF 17.
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
BLUR_MAX, BLUR_END = 10.0, 1.10
SEGS = [
    (0.90, 1.95, 1.00),
    (1.95, 3.40, 1.00),
    (3.40, 5.40, 0.62),
    (5.40, 6.45, 1.00),
    (6.45, 7.55, 1.00),
]
print("crop %dx%d at x=%d" % (CW_, CH_, CX))

os.makedirs("src6", exist_ok=True)
for f in os.listdir("src6"): os.remove("src6/"+f)
subprocess.run([EXE,"-y","-i",SRC,"-vf","fps=%d,crop=%d:%d:%d:0"%(SRC_FPS,CW_,CH_,CX),
                "src6/%04d.png"], capture_output=True)
FR = sorted(f for f in os.listdir("src6") if f.endswith(".png"))
N = len(FR); print("source frames:", N)

timeline=[]
for s0,s1,sp in SEGS:
    n=int(round((s1-s0)/sp*OUT_FPS))
    timeline += [s0+(k/n)*(s1-s0) for k in range(n)]
print("output %d frames @%dfps = %.2fs" % (len(timeline), OUT_FPS, len(timeline)/OUT_FPS))
for s0,s1,sp in SEGS:
    print("   src %.2f-%.2fs  x%.2f  -> %.2fs" % (s0,s1,sp,(s1-s0)/sp))

cache={}
def frame(i):
    i=max(0,min(N-1,i))
    if i not in cache:
        if len(cache)>10: cache.clear()
        cache[i]=Image.open("src6/"+FR[i]).convert("RGB")
    return cache[i]

mp4=os.path.join(OUT,"sara-hero-red.mp4")
proc = subprocess.Popen(
    [EXE,"-y","-f","rawvideo","-pix_fmt","rgb24","-s","%dx%d"%(CW_,CH_),"-r",str(OUT_FPS),
     "-i","-","-c:v","libx264","-crf","17","-preset","slow","-pix_fmt","yuv420p",
     "-movflags","+faststart","-an", mp4],
    stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
for i,ts in enumerate(timeline):
    im = frame(int(round(ts*SRC_FPS)))
    t=i/OUT_FPS
    if t < BLUR_END:
        r=BLUR_MAX*(1-t/BLUR_END)**1.8
        if r>0.4: im=im.filter(ImageFilter.GaussianBlur(r))
    else:
        im=im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=48, threshold=3))
    proc.stdin.write(im.tobytes())
    if i%60==0: print("  %d/%d"%(i,len(timeline)), flush=True)
proc.stdin.close(); proc.wait()
print("mp4:", os.path.getsize(mp4)//1024, "KB")
subprocess.run([EXE,"-y","-i",mp4,"-c:v","libvpx-vp9","-crf","30","-b:v","0","-row-mt","1","-an",
                os.path.join(OUT,"sara-hero-red.webm")], capture_output=True)
print("webm:", os.path.getsize(os.path.join(OUT,"sara-hero-red.webm"))//1024, "KB")
subprocess.run([EXE,"-y","-ss","4.3","-i",mp4,"-frames:v","1","-q:v","2",
                os.path.join(OUT,"sara-hero-red-poster.jpg")], capture_output=True)
print("poster from the pause")
