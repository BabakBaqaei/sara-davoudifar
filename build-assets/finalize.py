"""ترکیبِ نهایی + خروجی‌های هیروی ۲."""
from PIL import Image, ImageFilter
import numpy as np, warnings, os
warnings.filterwarnings("ignore")
from rembg import remove, new_session

AX  = r"C:\Users\BABAK\OneDrive\Desktop\ax sara"
DST = r"C:\Users\BABAK\OneDrive\Desktop\babak 01\sara-site\public\images"
CUR = Image.open(AX+r"\2322.jpg_2K_202609071651.jpeg").convert("RGB")
W,H = CUR.size
iou_v, s_p, tx_p, ty_p = np.load("swapfit.npy")
K = W/1376.0                                  # پروکسی ← رزولوشن کامل (دقیقاً ۲)
s, tx, ty = s_p*K, tx_p*K, ty_p*K
print("fit IoU %.4f -> full-res scale %.4f  offset (%.0f, %.0f)" % (iou_v, s, tx, ty))

raw = Image.open("sara-cut.png")
nw, nh = round(raw.size[0]*s), round(raw.size[1]*s)
sara = raw.resize((nw, nh), Image.LANCZOS)

# سیلوئتِ ساراى فعلى، در رزولوشن کامل
if os.path.exists("mcur.npy"):
    mcur = np.load("mcur.npy")
else:
    sess = new_session("isnet-general-use")
    mcur = np.asarray(remove(CUR.resize((1376,768), Image.LANCZOS), session=sess).split()[-1])
    mcur = np.asarray(Image.fromarray(mcur).resize((W,H), Image.BILINEAR)) > 100
    np.save("mcur.npy", mcur)

# آلفاى ساراى نو روى بومِ کامل
anew = Image.new("L",(W,H),0)
anew.paste(sara.split()[-1], (round(tx), round(ty)))
anew = anew.filter(ImageFilter.GaussianBlur(1.4))
anew_a = np.asarray(anew).astype(np.float32)/255

# ── تطبیق تُن: میانگین کانالى در ناحیه‌ى مشترک ──
both = (anew_a > 0.85) & mcur
cur_a = np.asarray(CUR).astype(np.float32)
new_rgb = Image.new("RGB",(W,H),(0,0,0))
new_rgb.paste(sara.convert("RGB"), (round(tx), round(ty)))
new_a = np.asarray(new_rgb).astype(np.float32)
if both.sum() > 5000:
    gain = np.array([cur_a[...,c][both].mean()/max(1e-3, new_a[...,c][both].mean())
                     for c in range(3)])
    gain = np.clip(gain, 0.85, 1.20)
else:
    gain = np.ones(3)
print("overlap %.2f%% of frame   tone gain R%.3f G%.3f B%.3f" % (both.mean()*100, *gain))
new_a = np.clip(new_a*gain, 0, 255)

# ── ترکیب ──
al = anew_a[...,None]
out = new_a*al + cur_a*(1-al)

# ── حفره‌ها: جایى که ساراى قدیم بود و ساراى نو نمى‌پوشاند ──
hole = mcur & (anew_a < 0.15)
# لبه‌ى سیلوئتِ قدیم را کمى ضخیم کن تا هاله‌ى آپ‌اسکیل هم برود
hole = np.asarray(Image.fromarray((hole*255).astype(np.uint8))
                  .filter(ImageFilter.MaxFilter(5))).astype(bool) & (anew_a < 0.15)
print("holes to fill: %.3f%% of frame" % (hole.mean()*100))
valid = ~hole
for c in range(3):
    ch = out[...,c]
    for y in np.nonzero(hole.any(1))[0]:
        row_h = hole[y]
        if not row_h.any(): continue
        xs_v = np.nonzero(valid[y])[0]
        if len(xs_v)==0: continue
        xs_h = np.nonzero(row_h)[0]
        idx = np.searchsorted(xs_v, xs_h)
        left  = xs_v[np.clip(idx-1, 0, len(xs_v)-1)]
        right = xs_v[np.clip(idx,   0, len(xs_v)-1)]
        pick = np.where(np.abs(xs_h-left) <= np.abs(xs_h-right), left, right)
        ch[y, xs_h] = ch[y, pick]
res = Image.fromarray(out.clip(0,255).astype(np.uint8))
res = res.filter(ImageFilter.UnsharpMask(radius=1.1, percent=30, threshold=3))
res.save("about-final.png")
res.resize((980, round(980*H/W)), Image.LANCZOS).save("about-final-preview.jpg", quality=93)

for w,q in ((2560,90),(1792,88),(1280,86)):
    h = round(w*H/W); h -= h % 2
    p = os.path.join(DST, f"hero2-about-{w}.webp")
    res.resize((w,h), Image.LANCZOS).save(p, quality=q, method=6)
    print("wrote %s  %dx%d  %.0fKB" % (os.path.basename(p), w, h, os.path.getsize(p)/1024))
