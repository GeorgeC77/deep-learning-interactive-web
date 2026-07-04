import re
from pathlib import Path

ROOT = Path('src/pages/prerequisite')

# Pattern to match attribution banners mentioning Bishop in various forms
patterns = [
    re.compile(
        r'本[页内容|内容]*基于\s*Bishop\s*&\s*Bishop\s*[《《]?\s*Deep Learning[ :]*Foundations and Concepts\s*[》》]?[^，。]*[，。]?\s*仅供教学与非商业学习使用（CC BY-NC 4\.0）。?'
    ),
    re.compile(
        r'本[页内容|内容]*基于\s*Bishop\s*&\s*Bishop\s*[《《]?\s*Deep Learning[ :]*Foundations and Concepts\s*[》》]?[^，。]*[，。]?\s*采用\s*CC BY-NC 4\.0\s*许可，仅供教学与非商业学习使用。?'
    ),
]

# Generic replacement
generic = '本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。'

for path in ROOT.rglob('*.tsx'):
    text = path.read_text(encoding='utf-8')
    new_text = text
    for pattern in patterns:
        new_text = pattern.sub(generic, new_text)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        print(f'Updated {path}')
