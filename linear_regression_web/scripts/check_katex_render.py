import re
import pathlib
import subprocess
import json

root = pathlib.Path("e:/python_project/Lecture/Deep_learning/linear_regression_web/app/src")
node_path = pathlib.Path("e:/python_project/Lecture/Deep_learning/nodejs/node.exe")

# Extract math expressions from TSX files
katex_pattern = re.compile(r'math=\{([^}]+)\}')
expressions = []

for f in root.rglob("*.tsx"):
    text = f.read_text(encoding="utf-8")
    for m in katex_pattern.finditer(text):
        expr = m.group(1).strip()
        # Skip variable references
        if expr and expr[0].isalpha() and not expr.startswith("String.raw"):
            continue
        # Extract string content from String.raw or regular strings
        if expr.startswith("String.raw`") and expr.endswith("`"):
            inner = expr[len("String.raw`"):-1]
            # Remove simple ${...} interpolation for testing
            inner = re.sub(r'\$\{[^}]*\}', '', inner)
            expressions.append((str(f), inner))
        elif (expr.startswith('"') and expr.endswith('"')) or (expr.startswith("'") and expr.endswith("'")):
            inner = expr[1:-1]
            inner = inner.encode('utf-8').decode('unicode_escape')
            expressions.append((str(f), inner))
        elif expr.startswith('`') and expr.endswith('`'):
            inner = expr[1:-1]
            inner = re.sub(r'\$\{[^}]*\}', '', inner)
            inner = inner.encode('utf-8').decode('unicode_escape')
            expressions.append((str(f), inner))

# Deduplicate
seen = set()
unique_exprs = []
for file, math in expressions:
    if math not in seen:
        seen.add(math)
        unique_exprs.append((file, math))

print(f"Testing {len(unique_exprs)} unique math expressions...")

js_code = """
const katex = require('katex');
const exprs = %s;
const errors = [];
for (const [file, math] of exprs) {
  try {
    katex.renderToString(math, { throwOnError: true, displayMode: false });
  } catch (e) {
    errors.push({ file, math, error: e.message });
  }
}
console.log(JSON.stringify(errors, null, 2));
""" % json.dumps(unique_exprs, ensure_ascii=False)

js_path = pathlib.Path("e:/python_project/Lecture/Deep_learning/linear_regression_web/app/_katex_test.cjs")
js_path.write_text(js_code, encoding="utf-8")

result = subprocess.run(
    [str(node_path), str(js_path)],
    capture_output=True,
    text=True,
    cwd="e:/python_project/Lecture/Deep_learning/linear_regression_web/app"
)
print("STDOUT:")
print(result.stdout)
if result.stderr:
    print("STDERR:")
    print(result.stderr[:2000])
