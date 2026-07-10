import re
import pathlib

root = pathlib.Path("e:/python_project/Lecture/Deep_learning/linear_regression_web/app/src")

# Match math={...} capturing the content
katex_pattern = re.compile(r'math=\{([^}]+)\}')

issues = []

for f in root.rglob("*.tsx"):
    text = f.read_text(encoding="utf-8")
    for m in katex_pattern.finditer(text):
        expr = m.group(1).strip()
        # Skip variable references like math={formula}
        if expr and expr[0].isalpha() and not expr.startswith("String.raw"):
            continue
        # Skip String.raw template literals
        if expr.startswith("String.raw"):
            continue
        # For double-quoted or single-quoted strings, check the actual string value
        if (expr.startswith('"') and expr.endswith('"')) or (expr.startswith("'") and expr.endswith("'")):
            # Remove outer quotes
            inner = expr[1:-1]
            # Decode JS string escapes to get actual value
            try:
                actual = inner.encode('utf-8').decode('unicode_escape')
            except Exception:
                actual = inner
            # Check for tabs/newlines in the actual string value
            if '\t' in actual or '\n' in actual or '\r' in actual:
                issues.append((str(f), expr[:120], "contains tab/newline in rendered string"))
            # Check if common LaTeX commands lost their backslash
            # e.g. \theta became tab, so actual no longer contains \theta
            if '\\theta' in inner and '\\theta' not in actual:
                issues.append((str(f), expr[:120], "theta command broken"))
            if '\\sum' in inner and '\\sum' not in actual:
                issues.append((str(f), expr[:120], "sum command broken"))
            if '\\frac' in inner and '\\frac' not in actual:
                issues.append((str(f), expr[:120], "frac command broken"))
        # For template literals `...` without String.raw, also check
        elif expr.startswith('`') and expr.endswith('`'):
            inner = expr[1:-1]
            # Template literals without String.raw also interpret escapes
            try:
                actual = inner.encode('utf-8').decode('unicode_escape')
            except Exception:
                actual = inner
            if '\t' in actual or '\n' in actual:
                issues.append((str(f), expr[:120], "template literal contains tab/newline"))

print(f"Found {len(issues)} real issues")
for path, expr, reason in issues:
    print("---")
    print(path)
    print(reason)
    print(expr)
