"""زمینه‌ی هیروی ۴ — پرکردنِ جای حروف و سارا با انتشارِ نرم.

نسخه‌ی اول میانگینِ وزن‌دار در مقیاس ۱/۳۲ می‌گرفت و باگ داشت: بلوکی که
کاملاً داخلِ یک حرف می‌افتد هیچ پیکسلِ معتبری ندارد، وزنش صفر می‌شود و
`num/den` با den کلمپ‌شده به ۱e-۴ صفر می‌دهد — یعنی **مشکی**. نتیجه‌اش
لکه‌های مشکیِ حرف‌شکل در زمینه بود که در مرورگر دیده شد.

روشِ درست انتشار است: در مقیاسِ ۱/۸ جای ماسک با میانگینِ معتبر مقدار
اولیه می‌گیرد و بعد ۸۰ بار «تارکردن و جانشینی» انجام می‌شود، تا زمینه‌ی
واقعی از لبه‌ها به داخل نفوذ کند. وینیت این‌طور پیوسته می‌مانَد و هیچ
بلوکی بی‌مقدار نمی‌مانَد.
"""
from PIL import Image, ImageFilter
import numpy as np, os

AX  = r"C:\Users\BABAK\OneDrive\Desktop\ax sara"
DST = r"C:\Users\BABAK\OneDrive\Desktop\babak 01\sara-site\public\images\hero4"
CUR = Image.open(AX+r"\2322.jpg_2K_202609071651.jpeg").convert("RGB")
W, H = CUR.size
rgb = np.asarray(CUR).astype(np.float32)
mcur = np.load("mcur.npy")

a = np.asarray(CUR).astype(int)
bright = (a.min(2) > 165) & ((a.max(2)-a.min(2)) < 30)
# ماتِ rembg در سطر ۱۱۴۹ (۷۴.۸٪) تمام می‌شود، ولی سارا تا پایینِ کادر
# ادامه دارد و پایین‌تنه‌اش در زمینه جا می‌مانْد — همان لکه‌ی قرمز.
# دو قید اضافه: ادامه‌ی ستونی از لبه‌ی مات به پایین، و اشباعِ رنگ
# (بلوزِ قرمزش اشباع ~۸۳ دارد و زمینه ~۵).
rows = np.nonzero(mcur.any(1))[0]
ext = np.zeros_like(mcur)
if len(rows):
    b = rows[-1]
    cols = mcur[max(0, b-20):b+1].any(0)
    ext[b:, cols] = True
    ext = np.asarray(Image.fromarray((ext*255).astype(np.uint8))
                     .filter(ImageFilter.MaxFilter(31))) > 127
    ext[:b] = False

sat_img = a.max(2) - a.min(2)
low = np.zeros_like(mcur); low[int(0.68*H):] = True
sat_body = low & (sat_img > 45) & (a[...,0] >= a[...,1])

mask = bright | mcur | ext | sat_body
mask = np.asarray(Image.fromarray((mask*255).astype(np.uint8))
                  .filter(ImageFilter.MaxFilter(11))) > 127
print("masked out (type + Sara): %.2f%% of frame" % (mask.mean()*100))

SC = 8
sw, sh = W//SC, H//SC
def down(arr, mode=Image.BOX):
    return np.asarray(Image.fromarray(arr.astype(np.float32)).resize((sw,sh), mode)).astype(np.float32)

# میانگینِ **وزن‌دار**: میانگینِ ساده‌ی بلوک، پیکسل‌های ماسک‌شده را هم
# داخل می‌کند و رنگِ بلوزِ قرمز و حروف به زمینه نشت می‌کند — در رندرِ قبل
# یک لکه‌ی قرمز و شبحِ حروف در زمینه دیده شد. و آستانه‌ی اعتبار سخت‌گیرانه
# است (۹۰٪ پیکسلِ سالم) تا بلوک‌های لبه‌ای هم آلوده نکنند.
w = (~mask).astype(np.float32)
den = down(w)
cur_s = np.dstack([down(rgb[...,c]*w) / np.maximum(den, 1e-6) for c in range(3)])
valid = den > 0.90
print("valid at 1/%d scale: %.2f%% of blocks" % (SC, valid.mean()*100))

def box3(x):
    """میانگینِ ۳×۳ با numpy — PIL روی نمای غیرپیوسته‌ی float کار نمی‌کند."""
    p = np.pad(x, 1, mode="edge")
    return (p[:-2,:-2] + p[:-2,1:-1] + p[:-2,2:] +
            p[1:-1,:-2] + p[1:-1,1:-1] + p[1:-1,2:] +
            p[2:,:-2] + p[2:,1:-1] + p[2:,2:]) / 9.0

work = cur_s.copy()
seed = np.array([cur_s[...,c][valid].mean() for c in range(3)], np.float32)
for c in range(3):
    work[...,c] = np.where(valid, cur_s[...,c], seed[c])
for i in range(200):
    for c in range(3):
        bl = box3(np.ascontiguousarray(work[...,c]))
        work[...,c] = np.where(valid, cur_s[...,c], bl)
print("diffusion done; filled range %.1f..%.1f" % (work.min(), work.max()))

coarse = np.dstack([
    np.asarray(Image.fromarray(np.ascontiguousarray(work[...,c])).resize((W,H), Image.BICUBIC))
    for c in range(3)])
resid = (rgb - coarse)[~mask]
sd = float(resid.std())
rng = np.random.default_rng(7)
noise = rng.normal(0, sd, size=(H,W,1)).astype(np.float32)
filled = np.where(mask[...,None], np.clip(coarse+noise, 0, 255), rgb)
print("texture sd %.2f/255 restored;  fill luminance %.1f..%.1f (was 0 = black bug)" % (
    sd, filled[mask].min(), filled[mask].max()))

OW, OH = 2560, 1429
bg = Image.fromarray(filled.astype(np.uint8)).resize((OW,OH), Image.LANCZOS)
p = os.path.join(DST, "bg.webp")
bg.save(p, quality=90, method=6)
print("wrote bg.webp %dx%d  %.0fKB" % (OW, OH, os.path.getsize(p)/1024))
bg.resize((900, round(900*OH/OW))).save("hero4-bg-preview.jpg", quality=90)
