"""بازگرداندنِ تایپی که باید روی سارا بنشیند.

در طراحیِ اصلی امضا و پاراگراف *روی* سارا کشیده شده‌اند. چون سارای نو از
سارای قدیم پهن‌تر است (پرسپکتیوِ عکسِ نزدیک، نه کشیدگی)، بعد از جای‌گذاری
آن‌ها زیرِ او می‌افتند. این‌جا از خودِ تصویرِ فعلی بیرون کشیده و دوباره رو
گذاشته می‌شوند.

جداکردنِ «قلمِ نازک» از «سفیدِ یکدست»: شلوارِ سفید هم روشن و بی‌رنگ است،
پس شرطِ روشنایی کافی نیست. قلمِ امضا و متن نازک است، یعنی در پنجره‌ی ۲۵
پیکسلی کسرِ روشن کم می‌مانَد؛ داخلِ شلوار این کسر ۱ است.
"""
from PIL import Image, ImageFilter
import numpy as np, os

AX  = r"C:\Users\BABAK\OneDrive\Desktop\ax sara"
DST = r"C:\Users\BABAK\OneDrive\Desktop\babak 01\sara-site\public\images"
CUR = Image.open(AX+r"\2322.jpg_2K_202609071651.jpeg").convert("RGB")
RES = Image.open("about-final.png").convert("RGB")
W,H = CUR.size
a = np.asarray(CUR).astype(int)
bright = (a.min(2) > 165) & ((a.max(2)-a.min(2)) < 30)

# کسرِ روشن در پنجره‌ی ۲۵px، با تصویرِ انتگرالی
b = bright.astype(np.float32)
ii = np.pad(b,1).cumsum(0).cumsum(1)
r = 12
ys, xs = np.mgrid[0:H, 0:W]
y0 = np.clip(ys-r,0,H); y1 = np.clip(ys+r+1,0,H)
x0 = np.clip(xs-r,0,W); x1 = np.clip(xs+r+1,0,W)
area = (y1-y0)*(x1-x0)
local = (ii[y1,x1]-ii[y0,x1]-ii[y1,x0]+ii[y0,x0]) / area
thin = bright & (local < 0.55)

band = np.zeros((H,W), bool)
band[int(0.505*H):int(0.745*H)] = True      # امضا
band[int(0.750*H):int(0.895*H)] = True      # پاراگراف
mask = thin & band
print("type pixels recovered: %.3f%% of frame" % (mask.mean()*100))

al = np.asarray(Image.fromarray((mask*255).astype(np.uint8))
                .filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32)/255
al = np.clip(al*1.25, 0, 1)[...,None]
out = np.asarray(RES).astype(np.float32)*(1-al) + np.asarray(CUR).astype(np.float32)*al
res = Image.fromarray(out.clip(0,255).astype(np.uint8))
res.save("about-final2.png")
res.resize((980, round(980*H/W)), Image.LANCZOS).save("about-final2-preview.jpg", quality=93)
for w,q in ((2560,90),(1792,88),(1280,86)):
    h = round(w*H/W); h -= h % 2
    p = os.path.join(DST, f"hero2-about-{w}.webp")
    res.resize((w,h), Image.LANCZOS).save(p, quality=q, method=6)
    print("wrote %s %dx%d %.0fKB" % (os.path.basename(p), w, h, os.path.getsize(p)/1024))
