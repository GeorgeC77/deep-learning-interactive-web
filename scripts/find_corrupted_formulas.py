import re
import os

suspicious = []
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith('.tsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as fh:
                content = fh.read()
            for m in re.finditer(r'String\.raw`([^`]+)`', content):
                formula = m.group(1)
                # Look for Latin-1 chars (U+0080-U+00FF) which might be corrupted UTF-8
                if any(0x80 <= ord(ch) <= 0xFF for ch in formula):
                    line = content[:m.start()].count('\n') + 1
                    suspicious.append((path, line, formula))

with open('scripts/suspicious_all.txt', 'w', encoding='utf-8') as f:
    for path, line, formula in suspicious:
        f.write(f'{path}:{line}: {repr(formula)}\n')

print(f'Found {len(suspicious)} suspicious formulas')
