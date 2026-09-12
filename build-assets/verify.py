import imageio_ffmpeg as iio, subprocess, os
from PIL import Image, ImageDraw
import numpy as np, warnings
warnings.filterwarnings("ignore")
EXE = iio.get_ffmpeg_exe()
V = r"C:\Users\BABAK\OneDrive\Desktop\babak 01\sara-site\public\video\sara-hero.mp4"
os.makedirs("vf", exist_ok=True)
subprocess.run([EXE,"-y","-i",V,"-vf","fps=6,scale=560:-1","-q:v","3","vf/%03d.jpg"],capture_output=True)
fs = sorted(f for f in os.listdir("vf") if f.endswith(".jpg"))
print("sampled %d frames at 6fps (%.2fs)" % (len(fs), len(fs)/6))

print("\n  t_out  sharpness  motion(px/frame)   phase")
prev=None
sh=[]
for i,f in enumerate(fs):
    im = Image.open("vf/"+f).convert("L")
    g = np.asarray(im).astype(float)
    lap = g[1:-1,1:-1]*4 - g[:-2,1:-1] - g[2:,1:-1] - g[1:-1,:-2] - g[1:-1,2:]
    s = lap.var()
    mv = np.abs(g-prev).mean() if prev is not None else 0
    prev = g
    t = i/6
    phase = ("entry+blur" if t<1.9 else "approach" if t<3.1 else
             "SLOW smile" if t<6.8 else "settle" if t<7.8 else "fast exit")
    sh.append(s)
    print("  %5.2f  %9.0f  %6.2f            %s" % (t, s, mv, phase))
