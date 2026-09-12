from PIL import Image, ImageFilter
import numpy as np, warnings
from collections import deque
warnings.filterwarnings("ignore")
from rembg import remove, new_session

RAW = r"C:\Users\BABAK\OneDrive\Desktop\ax sara\2322.jpg"
im = Image.open(RAW).convert("RGB")
print("raw", im.size)

# ماتِ نیم‌رزولوشن: خروجی نهایی ۱۶۳۵px عرض دارد، پس ۱۵۱۲ عملاً ۱:۱ است
work = im.resize((1512, 2016), Image.LANCZOS)
s = new_session("isnet-general-use")
a = np.asarray(remove(work, session=s).split()[-1]).astype(np.float32)
print("alpha raw: >128 coverage %.2f%%" % ((a>128).mean()*100))

# آستانه ← لکه‌های نیمه‌شفافِ نورهای پشت‌سر حذف می‌شوند، مو سالم می‌مانَد
THR = 170
a = np.clip((a-THR)/(255.0-THR), 0, 1)*255

# بزرگ‌ترین ناحیه‌ی پیوسته
ds = 4
small = a[::ds,::ds] > 40
h,w = small.shape; lab = np.zeros((h,w), np.int32); cur=0; sizes=[0]
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
print("components: %d, largest %.2f%% of frame" % (cur, max(sizes)/small.size*100))
keep = (lab==int(np.argmax(sizes))).astype(np.uint8)*255
keep = np.asarray(Image.fromarray(keep).resize(a.shape[::-1], Image.BILINEAR)
                  .filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32)/255
a = np.clip(a*np.clip(keep*1.15,0,1), 0, 255).astype(np.uint8)

al = Image.fromarray(a).resize(im.size, Image.LANCZOS)
out = im.convert("RGBA"); out.putalpha(al)
out.save("sara-cut.png")

m = np.asarray(al) > 128
ys,xs = np.nonzero(m); H,W = m.shape
print("cutout bbox  x %.1f%%..%.1f%%  y %.1f%%..%.1f%%   coverage %.2f%%" % (
    xs.min()/W*100, xs.max()/W*100, ys.min()/H*100, ys.max()/H*100, m.mean()*100))
prev = Image.new("RGB", (700, int(700*H/W)), (70,70,90))
sm = out.resize(prev.size, Image.LANCZOS)
prev.paste(sm, (0,0), sm); prev.save("sara-cut-preview.jpg", quality=90)
