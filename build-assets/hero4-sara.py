"""لایه‌ی سارا برای هیروی ۴ — ساراىِ خودِ گرافیک.

عکس خام صورتِ خیلی شارپ‌تری دارد (~۴۷۰px در برابر ~۲۷۰px) و در هیروی ۲
همان استفاده شده. این‌جا نه، و دلیلش معماری است نه سلیقه:

لایه‌ی «ABOUT ME» به‌اندازه‌ی سیلوئتِ ساراىِ گرافیک سوراخ دارد، چون در
تصویرِ تختِ مرجع هرچه پشتِ او بوده وجود ندارد. اگر لایه‌ی سارا سیلوئتِ
دیگری داشته باشد، بخشی از آن سوراخ بی‌پوشش می‌مانَد — اندازه‌گیری شد:
IoU ۰.۸۹، و یک شکافِ ۱۶۳ پیکسلی کنارِ شانه که با تراوش پر نمی‌شد.

جای‌گذاریِ فقط صورت هم آزمایش شد و رد شد: بیشینه‌ی همبستگیِ نرمال در
ناحیه‌ی صورت ۰.۱۲۸ درآمد، یعنی هندسه‌ی دو صورت بر هم نمی‌نشیند (رندرِ AI
چهره را از فریمِ دیگری بازتفسیر کرده). نتیجه‌اش چانه‌ی پایین‌تر و حالتِ
دهانِ متفاوت بود — بدتر از صورتِ نرم‌تر.

راهِ درستِ داشتنِ هر دو، لایه‌های واقعیِ همان طراحی است.
"""
from PIL import Image, ImageFilter
import numpy as np, os

AX  = r"C:\Users\BABAK\OneDrive\Desktop\ax sara"
DST = r"C:\Users\BABAK\OneDrive\Desktop\babak 01\sara-site\public\images\hero4"
CUR = Image.open(AX+r"\2322.jpg_2K_202609071651.jpeg").convert("RGB")
W, H = CUR.size
mcur = np.load("mcur.npy")

al = np.asarray(Image.fromarray((mcur*255).astype(np.uint8))
                .filter(ImageFilter.GaussianBlur(1.2))).astype(np.uint8)
rgba = np.dstack([np.asarray(CUR), al]).astype(np.uint8)
im = Image.fromarray(rgba, "RGBA").filter(
    ImageFilter.UnsharpMask(radius=1.0, percent=30, threshold=3))
OW, OH = 2560, 1429
im = im.resize((OW, OH), Image.LANCZOS)
p = os.path.join(DST, "sara.webp")
im.save(p, quality=92, method=6)
print("wrote sara.webp %dx%d  %.0fKB  (silhouette %.2f%% of frame)" % (
    OW, OH, os.path.getsize(p)/1024, mcur.mean()*100))
