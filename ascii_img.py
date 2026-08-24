from PIL import Image
import sys

chars = "@%#*+=-:. "
img = Image.open(sys.argv[1]).convert('L')
img = img.resize((80, 40))
pixels = img.load()
for y in range(40):
    line = ""
    for x in range(80):
        val = pixels[x, y]
        idx = int((val / 255) * (len(chars) - 1))
        line += chars[idx]
    print(line)
