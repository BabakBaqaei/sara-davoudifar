"""جایگزینیِ سارا در گرافیکِ فعلیِ «ABOUT ME» با پیکسل‌های عکس خام.

طراحی دست نمی‌خورد: زمینه، «ABOUT ME»، امضا، پاراگراف و برچسب‌ها همان
نسخه‌ی فعلیِ سایت می‌مانند. فقط خودِ سارا از `2322.jpg` می‌آید که همان
عکسِ منبعِ همین گرافیک است — صورتش آن‌جا ~۴۷۰px است و در رندرِ ۲K ~۲۷۰px
و پوستش حالتِ پلاستیکیِ آپ‌اسکیل دارد.

هم‌ترازی با جست‌وجوی شبکه‌ای مقیاس و انتقال روی IoU سیلوئت انجام می‌شود،
و فقط روی نیمه‌ی بالا: صورت باید بنشیند، نه لبه‌ی شلوار. همان روشی که
برای جفتِ روشن/تاریکِ هیروی ۱ کار کرد (build-assets/align2.py).
"""
from PIL import Image, ImageFilter
import numpy as np, warnings
warnings.filterwarnings("ignore")
from rembg import remove, new_session

AX  = r"C:\Users\BABAK\OneDrive\Desktop\ax sara"
CUR = Image.open(AX+r"\2322.jpg_2K_202609071651.jpeg").convert("RGB")
W,H = CUR.size
print("current", CUR.size)

sess = new_session("isnet-general-use")
PW,PH = 1376, 768
prox = CUR.resize((PW,PH), Image.LANCZOS)
mcur = np.asarray(remove(prox, session=sess).split()[-1]).astype(np.float32)/255
print("cur silhouette coverage %.2f%%" % ((mcur>0.5).mean()*100))

raw = Image.open("sara-cut.png")                       # RGBA 3024x4032
araw = np.asarray(raw.split()[-1]).astype(np.float32)/255

HEAD = slice(0, int(PH*0.58))     # سر، شال، بالاتنه

def warp_alpha(s, tx, ty):
    nw, nh = round(raw.size[0]*s), round(raw.size[1]*s)
    a = Image.fromarray((araw*255).astype(np.uint8)).resize((nw,nh), Image.BILINEAR)
    out = Image.new("L",(PW,PH),0)
    out.paste(a, (round(tx), round(ty)))
    return np.asarray(out).astype(np.float32)/255

def iou(s,tx,ty):
    m1 = mcur[HEAD] > 0.5
    m2 = warp_alpha(s,tx,ty)[HEAD] > 0.5
    u = (m1|m2).sum()
    return (m1&m2).sum()/u if u else 0

# تخمین اولیه از جعبه‌ها
ys,xs = np.nonzero(mcur>0.5)
cy0,cy1,cx0,cx1 = ys.min(), ys.max(), xs.min(), xs.max()
ry,rx = np.nonzero(araw>0.5)
s0 = (cx1-cx0)/(rx.max()-rx.min()) * (PW/PW)
print("seed scale %.4f  (cur box %dx%d)" % (s0, cx1-cx0, cy1-cy0))

best=(0,s0,0,0)
for s in np.arange(s0*0.80, s0*1.25, s0*0.03):
    nw = raw.size[0]*s
    for tx in range(int(cx0 - rx.min()*s - 40), int(cx0 - rx.min()*s + 41), 12):
        for ty in range(int(cy0 - ry.min()*s - 40), int(cy0 - ry.min()*s + 41), 12):
            v = iou(s,tx,ty)
            if v>best[0]: best=(v,s,tx,ty)
print("coarse  IoU %.4f  s=%.4f tx=%d ty=%d" % best)
_,s1,tx1,ty1 = best
for s in np.arange(s1*0.97, s1*1.031, s1*0.006):
    for tx in range(tx1-12, tx1+13, 3):
        for ty in range(ty1-12, ty1+13, 3):
            v = iou(s,tx,ty)
            if v>best[0]: best=(v,s,tx,ty)
print("refined IoU %.4f  s=%.4f tx=%d ty=%d" % best)
np.save("swapfit.npy", np.array(best))
