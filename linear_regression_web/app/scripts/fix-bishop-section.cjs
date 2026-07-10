const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith('.tsx')) files.push(full);
  }
  return files;
}

function inferBishopSection(source) {
  const titleMatch = source.match(/(\d+\.\d+)/);
  return titleMatch ? titleMatch[1] : '';
}

function main() {
  const files = walk(PAGES_DIR);
  let fixed = 0;
  for (const file of files) {
    let source = fs.readFileSync(file, 'utf8');
    if (!source.includes('SectionMetadata')) continue;
    if (source.includes('bishopSection=')) continue;

    const section = inferBishopSection(source);
    const newLine = `        bishopSection={${JSON.stringify(section)}}\n`;

    source = source.replace(
      /(<SectionMetadata\s*\n\s+bishopChapter=\{[^}]+\}\n)/,
      `$1${newLine}`
    );

    fs.writeFileSync(file, source, 'utf8');
    fixed++;
    console.log(`  fixed: ${path.relative(ROOT, file)}`);
  }
  console.log(`Fixed ${fixed} files.`);
}

main();
