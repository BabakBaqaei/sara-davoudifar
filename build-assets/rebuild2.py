from PIL import Image, ImageFilter
import numpy as np, json, os, warnings
from collections import deque
warnings.filterwarnings("ignore")
CREAM = np.array([0xf4,0xec,0xe2], np.float32)
K = 1920/1440
meta = json.load(open("meta2.json")); N = len(meta)

def clean_alpha(a, thr=175, ds=4):
    """۱) آستانه: سایه‌ی دیوار آلفای جزئی دارد و این‌جا حذف می‌شود، در حالی
       که موی تیره آلفای بالا می‌گیرد و سالم می‌ماند (آزمون شد: تا ۲۱۵ هم مو
       دست‌نخورده بود). ۲) بزرگ‌ترین ناحیه‌ی پیوسته، برای لکه‌های جدا."""
    a = np.clip((a.astype(np.float32)-thr)/(255.0-thr),0,1)*255
    small = a[::ds,::ds] > 40
    h,w = small.shape; lab=np.zeros((h,w),np.int32); cur=0; sizes=[0]
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
    if cur==0: return a
    keep = (lab==int(np.argmax(sizes))).astype(np.uint8)*255
    keep = np.asarray(Image.fromarray(keep).resize(a.shape[::-1], Image.BILINEAR)
                      .filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(2))
                      ).astype(np.float32)/255
    return np.clip(a*np.clip(keep*1.15,0,1),0,255)

# آلفای تمیزِ همه‌ی فریم‌ها + مرکزِ سر
alphas=[]; cx=[]
for m in meta:
    a = np.asarray(Image.open(f"cut2/{m['i']:04d}.png").split()[-1])
    ca = clean_alpha(a)
    alphas.append(ca.astype(np.uint8))
    top = ca[:int(ca.shape[0]*0.45)]
    ys,xs = np.nonzero(top>25)
    cx.append(float(xs.mean()) if len(xs)>50 else m["cx"])
cx = np.array(cx)
def smooth(v,win=41):
    k=np.ones(win)/win; pad=np.r_[np.full(win//2,v[0]),v,np.full(win//2,v[-1])]
    return np.convolve(pad,k,mode="valid")[:len(v)]
trend = smooth(cx)
shift = np.round((trend.mean()-trend)*K).astype(int)
print("drift correction %d..%d px ; natural jitter kept std %.1f" % (shift.min(), shift.max(), (cx-trend).std()))

# بوم
xs0=[];xs1=[];ys0=[]
for a,s in zip(alphas,shift):
    ys,xs = np.nonzero(a>25)
    xs0.append(int(xs.min()*K)+s); xs1.append(int(xs.max()*K)+s); ys0.append(int(ys.min()*K))
PAD=24
x0=max(0,min(xs0)-PAD); x1=min(1920,max(xs1)+PAD); y0=max(0,min(ys0)-PAD)
CW=(x1-x0)-((x1-x0)%2); CH=(1080-y0)-((1080-y0)%2)
print("canvas %dx%d" % (CW,CH))

hi = sorted(f for f in os.listdir("raw2") if f.startswith("h"))[:N]
frames=[]
for i,(a,s) in enumerate(zip(alphas,shift)):
    col = Image.open("raw2/"+hi[i]).convert("RGB")
    al = Image.fromarray(a).resize(col.size, Image.LANCZOS)
    A = np.asarray(col).astype(np.float32); AL = np.asarray(al).astype(np.float32)[...,None]/255
    pre = A*AL + CREAM*(1-AL)                     # پیش‌ضرب روی کرِم
    rgba = np.concatenate([pre, AL*255],2).clip(0,255).astype(np.uint8)
    canv = Image.new("RGBA",(CW,CH),tuple(CREAM.astype(int))+(0,))
    src = Image.fromarray(rgba,"RGBA")
    canv.paste(src,(s-x0,-y0),src)
    frames.append(canv)

def arr(f): return np.asarray(f).astype(np.float32)
a0=arr(frames[0]); best=None
for k in range(int(N*0.7), N):
    d=np.abs(arr(frames[k])-a0).mean()
    if best is None or d<best[0]: best=(d,k)
_,END = best
XF=16; core=END-XF
loop=list(frames[:core])
for j in range(XF):
    t=(j+1)/(XF+1); loop.append(Image.fromarray(
        np.clip(arr(frames[core+j])*(1-t)+arr(frames[j])*t,0,255).astype(np.uint8),"RGBA"))
print("loop end %d (%.2fs) diff %.2f -> %d frames = %.2fs" % (END, END/24, best[0], len(loop), len(loop)/24))

os.makedirs("out2", exist_ok=True)
for f in os.listdir("out2"): os.remove("out2/"+f)
for i,f in enumerate(loop): f.save(f"out2/{i:04d}.png")

# سنجش سایه پس از اصلاح
print("\nresidual semi-transparent grey area:")
for i in range(0,len(loop),15):
    A2=np.asarray(loop[i]).astype(int); al=A2[...,3]; rgb=A2[...,:3]
    mid=(al>25)&(al<200); sat=rgb.max(2)-rgb.min(2)
    print("  f%3d  %5.2f%%" % (i, (mid&(sat<28)&(rgb.mean(2)<175)).mean()*100))
