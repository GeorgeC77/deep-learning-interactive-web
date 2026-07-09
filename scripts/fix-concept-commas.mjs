import fs from 'node:fs';
import path from 'node:path';

const generatedDir = 'src/pages/generated';
const files = fs.readdirSync(generatedDir).filter((f) => f.endsWith('.tsx'));

for (const file of files) {
  const fullPath = path.join(generatedDir, file);
  let text = fs.readFileSync(fullPath, 'utf8');
  const original = text;

  // Fix missing commas between adjacent concept objects within concepts={...}.
  // We operate on the substring between concepts={ and the matching ]}.
  text = text.replace(/(concepts=\{\[)([\s\S]*?)(\]\})/g, (match, prefix, block, suffix) => {
    // Add comma between } and { when no comma is present.
    const fixedBlock = block.replace(/\}(\s*\n\s*)\{(?!,)/g, '},$1{');
    return prefix + fixedBlock + suffix;
  });

  if (text !== original) {
    fs.writeFileSync(fullPath, text, 'utf8');
    console.log(`Fixed commas in ${fullPath}`);
  }
}
