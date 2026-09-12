from PIL import Image, ImageFilter, ImageDraw
import numpy as np, warnings
warnings.filterwarnings("ignore")

CW, CH = 2560, 1429
CUT = "cut-soft.png"
F_HAIRTOP, F_FOREHEAD, F_CHIN, F_CX = 0.03, 0.13, 0.60, 0.45

def radial_bg():
    y, x = np.mgrid[0:CH, 0:CW].astype(np.float32)
    dx = (x/CW-0.50)/0.62; dy = (y/CH-0.42)/0.58
    t = np.clip(np.sqrt(dx*dx+dy*dy), 0, 1)
    c0=np.array([100,2,22],np.float32); c1=np.array([74,2,12],np.float32); c2=np.array([42,1,5],np.float32)
    out=np.empty((CH,CW,3),np.float32); m=t<0.46
    out[m]=(c0+(c1-c0)*(t/0.46)[...,None])[m]
    out[~m]=(c1+(c2-c1)*((t-0.46)/0.54)[...,None])[~m]
    return out/255

def place(scale, hairtop_at):
    cut = Image.open(CUT).convert("RGBA")
    nw, nh = round(cut.width*scale), round(cut.height*scale)
    cut = cut.resize((nw,nh), Image.LANCZOS)
    ox = round(CW*0.48 - F_CX*nw)
    oy = round(CH*hairtop_at - F_HAIRTOP*nh)
    canvas = Image.new("RGBA",(CW,CH),(0,0,0,0))
    canvas.paste(cut,(ox,oy),cut)
    arr = np.asarray(canvas).astype(np.float32)/255
    return arr[...,:3], arr[...,3], (ox,oy,nw,nh)

def rim(alpha, width=11, light=(0.66,-0.75), power=1.7, floor=0.05):
    """باند نور روی لبه‌ی درونی سوژه.

    باند و نرمال‌ها از آلفای باینری‌شده حساب می‌شوند، نه از آلفای نرم:
    آلفای نرم داخل شالِ پُرزدار بافت دارد و آن بافت نور را نقطه‌نقطه
    می‌گرفت — لبه مثل اکلیل می‌شد. باینری کردن، باند را فقط روی خودِ
    مرز نگه می‌دارد. آلفای نرم بعد فقط برای پرِ تارهای مو ضرب می‌شود.

    جهت از نرمالِ سطح می‌آید، نه از مرکز جرم: گرادیانِ آلفای محوشده بردار
    روبه‌بیرونِ لبه است. با مرکز جرم، سرِ سوژه تقریباً مستقیم بالای آن
    می‌افتد و چپ و راست از هم تفکیک نمی‌شد.
    """
    hard = (alpha > 0.5).astype(np.float32)
    blur = np.asarray(Image.fromarray((hard*255).astype(np.uint8))
                      .filter(ImageFilter.GaussianBlur(width))).astype(np.float32)/255
    band = np.clip(hard*(1.0-blur), 0, 1)
    if band.max()>0: band /= band.max()
    band = band * np.clip(alpha*1.15, 0, 1)
    gy, gx = np.gradient(blur)
    n = np.sqrt(gx*gx+gy*gy) + 1e-6
    nx, ny = -gx/n, -gy/n
    d = np.clip(nx*light[0] + ny*light[1], 0, 1)**power
    return band*(floor + (1-floor)*d)

def vfall(geo, face_y):
    """افت نور به سمت پایین کادر — پلیور روشن را در سایه می‌برد."""
    Y = np.mgrid[0:CH,0:CW][0].astype(np.float32)/CH
    t = np.clip((Y-face_y)/(1.0-face_y), 0, 1)
    return (1.0 - 0.74*t**1.25)[...,None]

def grade_lit(rgb):
    x = np.clip((rgb-0.5)*1.16+0.545, 0, 1)
    x = x*np.array([1.05,0.955,0.83],np.float32)
    l = x.mean(2,keepdims=True)
    x = x - 0.22*np.clip((l-0.60)/0.40,0,1)**1.3
    x = x + np.array([0.055,0.004,0.014],np.float32)*np.clip(1-l/0.5,0,1)
    return np.clip(x,0,1)

def build(scale=1.85, hairtop_at=0.045, dark_mul=0.13, rim_gain=1.9):
    bg = radial_bg()
    rgb, a, geo = place(scale, hairtop_at)
    ox,oy,nw,nh = geo
    face_y = (oy + F_FOREHEAD*nh)/CH
    fall = vfall(geo, max(face_y, 0.05))
    # نور لبه‌ای هم از افت عمودی تبعیت می‌کند، وگرنه لبه‌ی شانه پایین کادر
    # یک تکه‌ی روشنِ نوک‌تیز می‌شد در حالی که بقیه‌ی تن در سایه است.
    r = rim(a)[...,None] * fall
    warm = np.array([1.00,0.70,0.34],np.float32)
    A = a[...,None]

    lit_subj  = grade_lit(rgb)*fall
    dark_subj = np.clip(lit_subj*dark_mul + np.array([0.05,0.005,0.013],np.float32)*fall, 0, 1)

    lit  = np.clip(bg*(1-A) + lit_subj*A  + warm*r*rim_gain, 0, 1)
    dark = np.clip(bg*(1-A) + dark_subj*A + warm*r*rim_gain, 0, 1)

    fore = (oy + F_FOREHEAD*nh)/CH; chin = (oy + F_CHIN*nh)/CH
    bleeds = oy + nh >= CH
    xs = np.nonzero((a>0.3).any(0))[0]
    info = dict(scale=scale, forehead=round(fore*100,1), chin=round(chin*100,1),
                faceH=round((chin-fore)*100,1), bottomBleed=bool(bleeds),
                clearL=round(xs.min()/CW*100,1), clearR=round((CW-xs.max())/CW*100,1))
    return lit, dark, info

if __name__ == "__main__":
    lit, dark, info = build()
    print(info)
    for arr,n in ((lit,"new-lit.jpg"),(dark,"new-dark.jpg")):
        Image.fromarray((arr*255).astype(np.uint8)).save(n,"JPEG",quality=90,optimize=True)
    tw=820; th=round(tw/(CW/CH))
    sh=Image.new("RGB",(tw,th*2+10),"#0c0104")
    sh.paste(Image.open("new-lit.jpg").resize((tw,th),Image.LANCZOS),(0,0))
    sh.paste(Image.open("new-dark.jpg").resize((tw,th),Image.LANCZOS),(0,th+10))
    sh.save("new-pair.jpg","JPEG",quality=90)
    print("new-pair.jpg saved")
