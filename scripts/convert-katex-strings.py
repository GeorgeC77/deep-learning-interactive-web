import codecs
import re
from pathlib import Path

FILES = [
    Path('src/pages/chapters/chapter01/CostFunctionPage.tsx'),
    Path('src/pages/chapters/chapter01/ModelPage.tsx'),
    Path('src/pages/chapters/chapter01/OverviewPage.tsx'),
]

# Match math={"..."} (regular string literal inside JSX braces)
pattern = re.compile(r'math=\{"((?:[^"\\]|\\.)*)"\}')

def repl(m: re.Match) -> str:
    inner = m.group(1)
    # Decode the JS string literal to its runtime value
    decoded = codecs.decode(inner, 'unicode_escape')
    # Escape characters that are special in a template literal for String.raw
    decoded = decoded.replace('`', '\\`').replace('${', '\\${')
    return f'math={{String.raw`{decoded}`}}'

for f in FILES:
    text = f.read_text(encoding='utf-8')
    new_text = pattern.sub(repl, text)
    if new_text != text:
        f.write_text(new_text, encoding='utf-8')
        print(f'Updated {f}')
    else:
        print(f'No changes in {f}')
