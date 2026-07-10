import fs from 'node:fs';
import path from 'node:path';

const allowed = JSON.parse(fs.readFileSync('scripts/allowedSubsections.json', 'utf8'));
const normalizedAllowed = new Map();
for (const sub of allowed) {
  const key = sub.toLowerCase().replace(/–/g, '-').replace(/\s+/g, ' ').trim();
  normalizedAllowed.set(key, sub);
}

function normalizeKey(s) {
  return s.toLowerCase().replace(/–/g, '-').replace(/\s+/g, ' ').trim();
}

function parseStringArray(block) {
  const out = [];
  for (const m of block.matchAll(/"((?:\\.|[^"\\])*)"/g)) {
    out.push(m[1]);
  }
  return out;
}

function formatStringArray(arr) {
  if (arr.length === 0) return '[]';
  return '[\n' + arr.map((s) => `          "${s}"`).join(',\n') + '\n        ]';
}

const generatedDir = 'src/pages/generated';
const files = fs.readdirSync(generatedDir).filter((f) => f.endsWith('.tsx'));

for (const file of files) {
  const fullPath = path.join(generatedDir, file);
  let text = fs.readFileSync(fullPath, 'utf8');

  const mappingMatch = text.match(/bishopMapping=\{\{([\s\S]*?)\}\}/);
  if (!mappingMatch) continue;
  const mappingBlock = mappingMatch[1];

  const sectionMatch = mappingBlock.match(/section:\s*"([^"]+)"/);
  const sectionNumber = sectionMatch ? sectionMatch[1] : '';

  const subMatch = mappingBlock.match(/textbookSubsections:\s*\[([\s\S]*?)\]/);
  const supMatch = mappingBlock.match(/supplementalTopics:\s*\[([\s\S]*?)\]/);

  const currentSubs = subMatch ? parseStringArray(subMatch[1]) : [];
  const currentSup = supMatch ? parseStringArray(supMatch[1]) : [];

  const validSubs = [];
  const moved = [];
  for (const sub of currentSubs) {
    const official = normalizedAllowed.get(normalizeKey(sub));
    if (official) {
      validSubs.push(official);
    } else {
      moved.push(sub);
    }
  }

  // If nothing valid, try to fall back to the official parent subsection.
  if (validSubs.length === 0 && sectionNumber) {
    const re = new RegExp('^' + sectionNumber.replace(/\./g, '\\.') + ' ');
    for (const sub of allowed) {
      if (re.test(sub)) {
        validSubs.push(sub);
        break;
      }
    }
  }

  // Deduplicate and merge moved items into supplementalTopics.
  const supplementalSet = new Set(currentSup);
  for (const item of moved) {
    supplementalSet.add(item);
  }
  const newSup = [...supplementalSet];

  const newSubArray = formatStringArray(validSubs);
  const newSupArray = formatStringArray(newSup);

  let newMappingBlock = mappingBlock;
  if (subMatch) {
    newMappingBlock = newMappingBlock.replace(
      /textbookSubsections:\s*\[[\s\S]*?\]/,
      `textbookSubsections: ${newSubArray}`
    );
  }
  if (supMatch) {
    newMappingBlock = newMappingBlock.replace(
      /supplementalTopics:\s*\[[\s\S]*?\]/,
      `supplementalTopics: ${newSupArray}`
    );
  }

  text = text.replace(mappingMatch[0], `bishopMapping={{${newMappingBlock}}}`);
  fs.writeFileSync(fullPath, text, 'utf8');
}

console.log(`Normalized ${files.length} generated files.`);
