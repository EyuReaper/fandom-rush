from PIL import Image
import sys

for path in sys.argv[1:]:
    try:
        img = Image.open(path)
        colors = img.getcolors(maxcolors=1000000)
        print(f"{path}: {len(colors)} unique colors, size {img.size}")
    except Exception as e:
        print(f"Error {path}: {e}")
