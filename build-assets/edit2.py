import imageio_ffmpeg as iio, subprocess, os
from PIL import Image, ImageFilter
import numpy as np, warnings
warnings.filterwarnings("ignore")
EXE = iio.get_ffmpeg_exe()
SRC = r"C:\Users\BABAK\OneDrive\Desktop\ax sara\Sara_adjusting_scarf_in_video_202609071026.mp4"
OUT = r"C:\Users\BABAK\OneDrive\Desktop\babak 01\sara-site\public\video"
SRC_FPS, OUT_FPS = 24, 30

# ── کادر: لبه‌ی راست روی لبه‌ی راستِ منبع می‌مانَد تا ورودِ از راست حفظ شود.
#    عرض کوچک‌تر => هم زوم بیشتر، هم سارا در نیمه‌ی چپ، هم خروجِ زودتر.
CW_, CH_ = 1202, 676
CX = 1920 - CW_
print(f"crop {CW_}x{CH_} at x={CX} ({CX/1920*100:.1f}%..100%), y=0..{CH_/1080*100:.1f}%")
print(f"  her pause centre lands at {((0.655*1920)-CX)/CW_*100:.1f}% of the frame width")

os.makedirs("src2", exist_ok=True)
for f in os.listdir("src2"): os.remove("src2/"+f)
subprocess.run([EXE,"-y","-i",SRC,"-vf",f"fps={SRC_FPS},crop={CW_}:{CH_}:{CX}:0",
                "-q:v","2","src2/%04d.jpg"],capture_output=True)
FR = sorted(f for f in os.listdir("src2") if f.endswith(".jpg"))
NSRC = len(FR); print("source frames:", NSRC)

# ── نقشه‌ی زمانی: انتها به حالت اولیه برگشت (تا ۷.۹۴s، سرعت عادی) ──
SEGS = [
    (0.10, 1.90, 1.00),   # ورود
    (1.90, 3.30, 1.00),   # ایستادن
    (3.30, 5.60, 0.62),   # مکث و لبخند — اسلوموشن
    (5.60, 6.55, 1.00),   # جمع‌وجور شدن
    (6.55, 7.94, 1.00),   # خروج کامل، سرعت عادی
]
BLUR_MAX, BLUR_END = 22.0, 1.90

timeline=[]
for s0,s1,sp in SEGS:
    n = int(round((s1-s0)/sp*OUT_FPS))
    timeline += [s0+(k/n)*(s1-s0) for k in range(n)]
NOUT=len(timeline)
print(f"output {NOUT} frames @ {OUT_FPS}fps = {NOUT/OUT_FPS:.2f}s")
for s0,s1,sp in SEGS:
    print(f"   src {s0:.2f}-{s1:.2f}s  speed {sp:.2f}x  ->  {(s1-s0)/sp:.2f}s")

cache={}
def frame(i):
    i=max(0,min(NSRC-1,i))
    if i not in cache:
        if len(cache)>8: cache.clear()
        cache[i]=np.asarray(Image.open("src2/"+FR[i]).convert("RGB")).astype(np.float32)
    return cache[i]

proc = subprocess.Popen(
    [EXE,"-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{CW_}x{CH_}","-r",str(OUT_FPS),
     "-i","-","-c:v","libx264","-crf","20","-preset","slow","-pix_fmt","yuv420p",
     "-movflags","+faststart","-an", os.path.join(OUT,"sara-hero.mp4")],
    stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

for i,ts in enumerate(timeline):
    fp = ts*SRC_FPS; i0=int(np.floor(fp)); fr=fp-i0
    a = frame(i0)
    img = a if fr<1e-3 else a*(1-fr)+frame(i0+1)*fr
    im = Image.fromarray(np.clip(img,0,255).astype(np.uint8))
    t=i/OUT_FPS
    if t < BLUR_END:
        r = BLUR_MAX*(1-t/BLUR_END)**1.8
        if r>0.4: im = im.filter(ImageFilter.GaussianBlur(r))
    proc.stdin.write(im.tobytes())
    if i%75==0: print("  rendered",i,"/",NOUT)
proc.stdin.close(); proc.wait()
print("mp4:", os.path.getsize(os.path.join(OUT,"sara-hero.mp4"))//1024,"KB")
