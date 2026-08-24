import re
import os

with open('src/data/fandomClues.ts', 'r') as f:
    content = f.read()

missing = []
for match in re.finditer(r'imagePath:\s*"([^"]+)"', content):
    img_path = match.group(1)
    rel_path = img_path.lstrip('/')
    if not os.path.exists(rel_path):
        missing.append(rel_path)

if missing:
    print("Missing files:")
    for m in missing:
        print(m)
else:
    print("All referenced images exist.")
