"""ساختِ لایه‌های واقعیِ هیروی ۴ از گرافیکِ مرجع.

لایه‌های آماده‌ی `Downloads/0*.png` قابل استفاده نبودند: تصویرِ تختِ نهایی
را تکه کرده بودند و هرچه پشتِ سارا افتاده بود بازسازی نشده بود —
`03_about_me_text.png` فقط «ABOU» دارد و `04_…signature.png` وسطش («Davo»)
نیست. در یک هیروی لایه‌ای که اجزا نسبت به هم حرکت می‌کنند، این‌ها سوراخ
لو می‌دهند.

پس از خودِ `2322.jpg_2K_…` (همان طراحیِ زنده‌ی سایت و همان تایپِ مرجع)
لایه‌ها استخراج می‌شوند:

  • «ABOUT ME» زیرِ سارا است، پس تنها لایه‌ای است که سوراخ دارد. حلش با
    بازسازیِ حروف نیست (نمی‌شود گلیف نساخته را ساخت) بلکه با **حاشیه‌ی
    لقی**: طبقه‌بندیِ «حرف/زمینه» از بیرونِ سیلوئتِ سارا به داخل تراوش
    داده می‌شود. ساقه‌ی حروفِ این وزن عمودی و یک‌دست است، پس تراوشِ
    نزدیک‌ترین‌همسایه چند ده پیکسل را درست ادامه می‌دهد — به‌اندازه‌ی
    کافی برای پوشاندنِ جابه‌جاییِ چند پیکسلیِ انیمیشن، بی آن‌که ادعای
    بازسازیِ گلیف داشته باشیم.
  • امضا، پاراگراف، برچسب‌ها و ستاره‌ها **روی** سارا کشیده شده‌اند، پس در
    تصویرِ تخت کامل‌اند و سوراخ ندارند. جداسازی با «قلمِ نازک» انجام
    می‌شود نه با روشنایی: شال و شلوارِ سارا هم روشن و بی‌رنگ‌اند، ولی در
    پنجره‌ی ۲۵ پیکسلی کسرِ روشنشان ۱ است و قلمِ متن کم.
  • سارا از برشِ عکس خام می‌آید (`sara-cut.png`) — همان ژست و لباس، ولی
    صورتش ~۴۷۰px است نه ~۲۷۰px.
"""
from PIL import Image, ImageFilter
import numpy as np, os

AX  = r"C:\Users\BABAK\OneDrive\Desktop\ax sara"
DL  = r"C:\Users\BABAK\Downloads"
DST = r"C:\Users\BABAK\OneDrive\Desktop\babak 01\sara-site\public\images\hero4"
os.makedirs(DST, exist_ok=True)

CUR = Image.open(AX+r"\2322.jpg_2K_202609071651.jpeg").convert("RGB")
W0, H0 = CUR.size
OW, OH = 2560, 1429
a = np.asarray(CUR).astype(int)
mcur = np.load("mcur.npy")                       # سیلوئتِ ساراىِ گرافیک
print("master %dx%d   sara silhouette %.2f%%" % (W0, H0, mcur.mean()*100))

bright = (a.min(2) > 165) & ((a.max(2)-a.min(2)) < 30)
b = bright.astype(np.float32)
ii = np.pad(b, 1).cumsum(0).cumsum(1)
r = 12
ys, xs = np.mgrid[0:H0, 0:W0]
y0 = np.clip(ys-r, 0, H0); y1 = np.clip(ys+r+1, 0, H0)
x0 = np.clip(xs-r, 0, W0); x1 = np.clip(xs+r+1, 0, W0)
local = (ii[y1,x1]-ii[y0,x1]-ii[y1,x0]+ii[y0,x0]) / ((y1-y0)*(x1-x0))
thick = bright & (local >= 0.55)
thin  = bright & (local <  0.55)

def band(f0, f1):
    m = np.zeros((H0,W0), bool); m[int(f0*H0):int(f1*H0)] = True; return m

def xrange_mask(f0, f1):
    m = np.zeros((H0,W0), bool); m[:, int(f0*W0):int(f1*W0)] = True; return m

def emit(mask, name, feather=1.3, boost=1.0):
    al = np.asarray(Image.fromarray((mask*255).astype(np.uint8))
                    .filter(ImageFilter.GaussianBlur(feather))).astype(np.float32)/255
    al = np.clip(al*boost, 0, 1)
    rgb = np.asarray(CUR).astype(np.float32)
    m3 = (al > 0.02)[...,None]
    rgb = np.where(m3, rgb, 255.0)      # بیرونِ ماسک سفیدِ تخت
    rgba = np.dstack([rgb, al*255]).astype(np.uint8)
    im = Image.fromarray(rgba, "RGBA").resize((OW,OH), Image.LANCZOS)
    p = os.path.join(DST, name)
    im.save(p, quality=92, method=6)
    print("  %-18s cov %5.2f%%  %6.0fKB" % (name, mask.mean()*100, os.path.getsize(p)/1024))

# ── ۲) «ABOUT ME» با حاشیه‌ی لقی ──
letters = thick & band(0.0, 0.61) & ~mcur
# تراوش به داخلِ سیلوئت: نزدیک‌ترین طبقه‌بندیِ افقی، محدود به SLACK پیکسل
# سوراخِ این لایه دقیقاً سیلوئتِ ساراىِ گرافیک است، و لایه‌ی سارا هم
# همان سیلوئت را دارد (`hero4-sara.py`) — پس مو‌به‌مو جا می‌افتد و هیچ
# شکافی نمی‌مانَد. پشتِ او هم بازسازی لازم نیست: در اسکرول هر دو `y:-10`
# می‌گیرند (جابه‌جاییِ نسبیِ عمودی صفر) و سارا فقط بزرگ می‌شود (۱.۰۶)
# در حالی که حروف آب می‌روند (۰.۹۴)، یعنی پوشش بیشتر می‌شود نه کمتر.
fill = letters.copy()
print("  about: visible %.2f%% -> with slack %.2f%%" % (letters.mean()*100, fill.mean()*100))
emit(fill, "about.webp")

# ── ۳) امضا / پاراگراف / برچسب‌ها / ستاره‌ها ── همه روی سارا، کامل
emit(thin & band(0.505, 0.745), "signature.webp", boost=1.25)
emit(thin & band(0.750, 0.900), "bio.webp",       boost=1.25)
lab = thin & band(0.900, 0.99)
emit(lab & xrange_mask(0.00, 0.35), "label-left.webp",  boost=1.25)
emit(lab & xrange_mask(0.65, 1.00), "label-right.webp", boost=1.25)
emit((thin | thick) & band(0.895, 0.99) & xrange_mask(0.38, 0.62), "stars.webp", boost=1.3)

tot = sum(os.path.getsize(os.path.join(DST,f)) for f in os.listdir(DST))
print("total: %.0fKB" % (tot/1024))
