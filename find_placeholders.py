from PIL import Image
import sys
import glob

placeholders = []
for path in glob.glob('src/assets/**/*.png', recursive=True):
    try:
        img = Image.open(path)
        colors = img.getcolors(maxcolors=1000000)
        if colors is not None and len(colors) < 500:
            placeholders.append(path)
    except:
        pass

for p in placeholders:
    print(p)
