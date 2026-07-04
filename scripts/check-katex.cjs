const ts = require('typescript');
const katex = require('katex');
const fs = require('fs');
const path = require('path');

function evaluateExpr(exprText, file) {
  // Evaluate the expression text in a sandbox that has String.raw.
  // For template literals with interpolation, replace ${...} with placeholders
  // to avoid runtime errors from undefined variables.
  let safe = exprText;
  safe = safe.replace(/\$\{[^}]*\}/g, '0');
  // Rename String.raw so we can inject it as a scoped function.
  safe = safe.replace(/\bString\.raw\b/g, '__raw');
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('__raw', `return (${safe});`);
    return { value: fn(String.raw), ok: true };
  } catch (e) {
    return { error: e.message, ok: false };
  }
}

function findKaTeXMathExpressions(filePath) {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, 'utf-8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const results = [];
  function visit(node) {
    if (
      ts.isJsxElement(node) ||
      ts.isJsxSelfClosingElement(node)
    ) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node;
      const tagName = opening.tagName.getText(sourceFile);
      if (tagName === 'KaTeX') {
        for (const attr of opening.attributes.properties) {
          if (
            ts.isJsxAttribute(attr) &&
            attr.name.getText(sourceFile) === 'math' &&
            attr.initializer
          ) {
            const expr = attr.initializer;
            let exprText = expr.getText(sourceFile);
            // Strip outer braces if present (JSX expression container)
            if (ts.isJsxExpression(expr)) {
              exprText = expr.expression ? expr.expression.getText(sourceFile) : exprText;
            }
            results.push({ file: filePath, exprText, pos: sourceFile.getLineAndCharacterOfPosition(attr.getStart(sourceFile)) });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return results;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith('.tsx')) files.push(full);
  }
  return files;
}
const files = walk(path.resolve('src'));
const allExprs = files.flatMap(f => findKaTeXMathExpressions(path.resolve(f)));

const bad = [];
for (const item of allExprs) {
  const ev = evaluateExpr(item.exprText, item.file);
  if (!ev.ok) {
    bad.push({ ...item, phase: 'eval', error: ev.error });
    continue;
  }
  try {
    katex.renderToString(String(ev.value), { throwOnError: true, trust: true });
  } catch (e) {
    bad.push({ ...item, phase: 'katex', value: ev.value, error: e.message });
  }
}

console.log(`Checked ${allExprs.length} KaTeX math expressions in ${files.length} files.`);
if (bad.length === 0) {
  console.log('All expressions render successfully.');
} else {
  console.log(`\nFound ${bad.length} problematic expressions:\n`);
  for (const b of bad) {
    console.log(`File: ${path.relative(process.cwd(), b.file)}:${b.pos.line + 1}:${b.pos.character + 1}`);
    console.log(`Expr: ${b.exprText}`);
    if (b.value !== undefined) console.log(`Value: ${b.value}`);
    console.log(`Error (${b.phase}): ${b.error}\n`);
  }
  process.exit(1);
}
