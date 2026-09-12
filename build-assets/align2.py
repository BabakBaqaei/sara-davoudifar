from PIL import Image
import numpy as np, warnings
warnings.filterwarnings("ignore")
PW, PH = 1376, 768
a1 = np.load("01.jpeg.npy"); a3 = np.load("03.jpeg.npy")

# فقط ناحیه‌ی سر و شال: هم‌ترازی صورت مهم است، نه شانه‌ها. سیلوئت کامل را
# پهنای تن غالب می‌کند و صورت می‌تواند جابه‌جا بماند.
HEAD = slice(0, int(PH*0.55))

def warp(a, s, tx, ty):
    """مقیاس حول مرکز کادر، بعد انتقال — روی آلفا"""
    im = Image.fromarray((a*255).astype(np.uint8))
    nw, nh = round(PW*s), round(PH*s)
    im = im.resize((nw,nh), Image.BILINEAR)
    out = Image.new("L",(PW,PH),0)
    out.paste(im, (round((PW-nw)/2 + tx), round((PH-nh)/2 + ty)))
    return np.asarray(out).astype(np.float32)/255

def iou(s, tx, ty):
    m1 = a1[HEAD] > 0.5
    m3 = warp(a3, s, tx, ty)[HEAD] > 0.5
    u = (m1 | m3).sum()
    return (m1 & m3).sum()/u if u else 0

best = (0,1,0,0)
for s in np.arange(1.00, 1.26, 0.02):
    for tx in range(-40, 41, 6):
        for ty in range(-70, 31, 6):
            v = iou(s,tx,ty)
            if v > best[0]: best = (v,s,tx,ty)
print("coarse  IoU %.4f  s=%.3f tx=%d ty=%d" % best)
_, s0, tx0, ty0 = best
for s in np.arange(s0-0.03, s0+0.031, 0.005):
    for tx in range(tx0-7, tx0+8):
        for ty in range(ty0-7, ty0+8):
            v = iou(s,tx,ty)
            if v > best[0]: best = (v,s,tx,ty)
print("refined IoU %.4f  s=%.4f tx=%d ty=%d   (proxy %dx%d)" % (best+(PW,PH)))
np.save("align.npy", np.array(best[1:]))
print("baseline (no alignment) head IoU = %.4f" % iou(1.0,0,0))
