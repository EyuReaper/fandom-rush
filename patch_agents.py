import sys

with open('AGENTS.md', 'r') as f:
    lines = f.readlines()

new_content = """
#### Remaining Placeholder Art (13 images)
- [ ] `games/final-fantasy/buster-sword.png` — Final Fantasy — Buster Sword
- [ ] `games/final-fantasy/materia.png` — Final Fantasy — Materia
- [ ] `games/final-fantasy/moogle.png` — Final Fantasy — Moogle
- [ ] `games/fortnite/llama-pinata.png` — Fortnite — Llama Piñata
- [ ] `games/fortnite/pickaxe.png` — Fortnite — Pickaxe
- [ ] `games/fortnite/supply-drop.png` — Fortnite — Supply Drop
- [ ] `games/super-mario/question-block.png` — Super Mario — Question Block
- [ ] `games/super-mario/super-mushroom.png` — Super Mario — Super Mushroom
- [ ] `games/super-mario/super-star.png` — Super Mario — Super Star
- [ ] `games/tlou/clicker.png` — The Last of Us — Clicker
- [ ] `games/tlou/ellies-switchblade.png` — The Last of Us — Ellie's Switchblade
- [ ] `games/tlou/firefly-pendant.png` — The Last of Us — Firefly Pendant
- [ ] `tv/simpsons/krusty-doll.png` — The Simpsons — Krusty Doll

"""

for i, line in enumerate(lines):
    if line.startswith("## Plan Audit Fix Order"):
        lines.insert(i-1, new_content)
        break

with open('AGENTS.md', 'w') as f:
    f.writelines(lines)
