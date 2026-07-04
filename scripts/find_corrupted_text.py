import os
import re

# Pattern: sequences of 2-4 Latin-1 chars that form valid UTF-8 when reinterpreted
# We look for common Chinese characters that got corrupted.
# A simple heuristic: find chars in range 0x80-0xFF that appear in contexts
# where Chinese is expected (e.g., \text{...}, plain text, etc.)

corrupted = []
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts', '.css', '.md')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as fh:
                content = fh.read()
            # Look for sequences that look like corrupted UTF-8 of Chinese:
            # Common pattern: [Ãàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ][...]
            # We'll just flag any line that contains both Latin-1 high bytes and looks Chinese-related
            for i, line in enumerate(content.split('\n'), 1):
                # Check for corrupted Chinese: Latin-1 chars that are not valid standalone in Chinese text
                if re.search(r'[çèéêëìíîïñòóôõöùúûüåæœÿ][\x80-\xbf]{1,3}', line):
                    corrupted.append((path, i, line))

with open('scripts/corrupted_text.txt', 'w', encoding='utf-8') as f:
    for path, line, text in corrupted:
        f.write(f'{path}:{line}: {repr(text.strip())}\n')

print(f'Found {len(corrupted)} corrupted lines')
