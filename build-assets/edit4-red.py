"""نسخه‌ی زمینه‌قرمزِ ویدیوی هیرو — تست.

سارا گفت رنگ‌های تیره و گرم را دوست دارد، مثل زمینه‌ی پرتره‌ی استودیویی‌اش.
آن زمینه اندازه‌گیری شد: میانه‌ی #53040e (چارک‌ها #4c030c تا #590610) و
مرکزش از نورِ رادیال روشن‌تر. توکن‌های `--color-crimson*` پروژه از همین
عکس آمده‌اند، پس همان‌ها استفاده می‌شوند تا هیرو و بقیه‌ی سایت یک خانواده
بمانند.

روش: ماتِ هر فریم با rembg، بعد ترکیب روی یک گرادیانِ رادیالِ قرمز که
همان پروفایلِ پرتره را دارد. لبه یک پیکسل تو داده می‌شود و بعد پر می‌شود
تا هاله‌ی کرِمِ دیوارِ قبلی دورِ مو نماند.

خروجی **فایلِ جدا** است (`sara-hero-red.*`) تا اگر سارا نپسندید، فقط
مسیرِ فایل در کامپوننت برگردد.
"""
import imageio_ffmpeg as iio, subprocess, os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
from PIL import Image, ImageFilter
import numpy as np, warnings
from collections import deque
warnings.filterwarnings("ignore")
from rembg import remove, new_session

EXE = iio.get_ffmpeg_exe()
OUT = r"C:\Users\BABAK\OneDrive\Desktop\babak 01\sara-site\public\video"
CW_, CH_, SRC_FPS, OUT_FPS = 1202, 676, 24, 30
BLUR_MAX, BLUR_END = 10.0, 1.10
SEGS = [(0.10,1.90,1.00),(1.90,3.30,1.00),(3.30,5.60,0.62),(5.60,6.55,1.00),(6.55,7.94,1.00)]

FR = sorted(f for f in os.listdir("src3") if f.endswith(".png"))
NSRC = len(FR); print("source frames:", NSRC)

# ── زمینه‌ی قرمز، با همان پروفایلِ رادیالِ پرتره ──
yy, xx = np.mgrid[0:CH_, 0:CW_]
d = np.sqrt(((xx-CW_*0.50)/(CW_*0.62))**2 + ((yy-CH_*0.42)/(CH_*0.58))**2)
lit  = np.array([0x64,0x02,0x16], np.float32)
mid  = np.array([0x4a,0x02,0x0c], np.float32)
deep = np.array([0x2a,0x01,0x05], np.float32)
t = np.clip(d, 0, 1)[..., None]
bg = np.where(t < 0.46, lit + (mid-lit)*(t/0.46), mid + (deep-mid)*((t-0.46)/0.54))
bg = bg.astype(np.float32)
print("backdrop built %dx%d" % (CW_, CH_))

sess = new_session("isnet-general-use")
def matte(im):
    a = np.asarray(remove(im, session=sess).split()[-1]).astype(np.float32)
    a = np.clip((a-165)/(255-165), 0, 1)*255            # آستانه: هاله‌ی نیمه‌شفاف برود
    small = a[::4, ::4] > 40
    h, w = small.shape; lab = np.zeros((h,w), np.int32); cur = 0; sizes=[0]
    for sy in range(h):
        for sx in range(w):
            if small[sy,sx] and lab[sy,sx]==0:
                cur+=1; n=0; q=deque([(sy,sx)]); lab[sy,sx]=cur
                while q:
                    y,x=q.popleft(); n+=1
                    for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
                        ny,nx=y+dy,x+dx
                        if 0<=ny<h and 0<=nx<w and small[ny,nx] and lab[ny,nx]==0:
                            lab[ny,nx]=cur; q.append((ny,nx))
                sizes.append(n)
    if cur:
        keep = (lab==int(np.argmax(sizes))).astype(np.uint8)*255
        keep = np.asarray(Image.fromarray(keep).resize((a.shape[1],a.shape[0]), Image.BILINEAR)
                          .filter(ImageFilter.MaxFilter(9))).astype(np.float32)/255
        a = a*np.clip(keep*1.15, 0, 1)
    # یک پیکسل تو، بعد نرم — تا نوارِ کرِمِ دیوار دورِ مو نماند
    a = np.asarray(Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.MinFilter(3))
                   .filter(ImageFilter.GaussianBlur(1.0))).astype(np.float32)/255
    return a[..., None]

cache = {}
def composited(i):
    i = max(0, min(NSRC-1, i))
    if i in cache: return cache[i]
    if len(cache) > 10: cache.clear()
    im = Image.open("src3/"+FR[i]).convert("RGB")
    al = matte(im)
    fg = np.asarray(im).astype(np.float32)
    out = fg*al + bg*(1-al)
    cache[i] = Image.fromarray(np.clip(out,0,255).astype(np.uint8))
    return cache[i]

timeline=[]
for s0,s1,sp in SEGS:
    n = int(round((s1-s0)/sp*OUT_FPS))
    timeline += [s0+(k/n)*(s1-s0) for k in range(n)]
print("output frames:", len(timeline))

proc = subprocess.Popen(
    [EXE,"-y","-f","rawvideo","-pix_fmt","rgb24","-s","%dx%d"%(CW_,CH_),"-r",str(OUT_FPS),
     "-i","-","-c:v","libx264","-crf","17","-preset","slow","-pix_fmt","yuv420p",
     "-movflags","+faststart","-an", os.path.join(OUT,"sara-hero-red.mp4")],
    stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

for i, ts in enumerate(timeline):
    im = composited(int(round(ts*SRC_FPS)))
    t_ = i/OUT_FPS
    if t_ < BLUR_END:
        r = BLUR_MAX*(1-t_/BLUR_END)**1.8
        if r > 0.4: im = im.filter(ImageFilter.GaussianBlur(r))
    else:
        im = im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=48, threshold=3))
    proc.stdin.write(im.tobytes())
    if i % 40 == 0: print("  %d/%d" % (i, len(timeline)), flush=True)
proc.stdin.close(); proc.wait()
mp4 = os.path.join(OUT,"sara-hero-red.mp4")
print("mp4:", os.path.getsize(mp4)//1024, "KB")
subprocess.run([EXE,"-y","-i",mp4,"-c:v","libvpx-vp9","-crf","30","-b:v","0",
                "-row-mt","1","-an", os.path.join(OUT,"sara-hero-red.webm")], capture_output=True)
print("webm:", os.path.getsize(os.path.join(OUT,"sara-hero-red.webm"))//1024, "KB")
subprocess.run([EXE,"-y","-ss","4.5","-i",mp4,"-frames:v","1","-q:v","2",
                os.path.join(OUT,"sara-hero-red-poster.jpg")], capture_output=True)
print("done")
