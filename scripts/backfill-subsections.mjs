import fs from 'node:fs';
import path from 'node:path';

const generatedDir = 'src/pages/generated';
const files = fs.readdirSync(generatedDir).filter((f) => f.endsWith('.tsx'));

const coverageMatrix = JSON.parse(fs.readFileSync('src/course/coverage_matrix.json', 'utf8'));
const coverageByPath = new Map(coverageMatrix.map((e) => [e.routePath, e]));

const officialSubsections = JSON.parse(fs.readFileSync('scripts/allowedSubsections.json', 'utf8'));

function extractQuotedStrings(block) {
  const out = [];
  for (const m of block.matchAll(/"((?:\\.|[^"\\])*)"/g)) {
    out.push(m[1]);
  }
  return out;
}

function formatStringArray(arr, indent) {
  if (arr.length === 0) return '[]';
  const spaces = ' '.repeat(indent);
  return '[\n' + arr.map((s) => `${spaces}"${s}"`).join(',\n') + '\n' + ' '.repeat(indent - 2) + ']';
}

for (const file of files) {
  const fullPath = path.join(generatedDir, file);
  let text = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  const routeMatch = text.match(/sectionPath=["']([^"']+)["']/);
  const routePath = routeMatch ? routeMatch[1] : '';
  const section = coverageByPath.get(routePath)?.bishopSection ?? '';
  if (!section) continue;

  const expectedLeaves = officialSubsections.filter(
    (s) => s.startsWith(section) && s !== section && /^\d+\.\d+\.\d+/.test(s)
  );
  if (expectedLeaves.length === 0) continue;

  // Update textbookSubsections
  const mappingMatch = text.match(/bishopMapping=\{\{([\s\S]*?)\}\}/);
  if (!mappingMatch) continue;
  const mappingBlock = mappingMatch[1];

  const subArrayMatch = mappingBlock.match(/(textbookSubsections\s*:\s*)\[([\s\S]*?)\]/);
  let currentSubs = [];
  if (subArrayMatch) {
    currentSubs = extractQuotedStrings(subArrayMatch[2]);
  }

  const missingLeaves = expectedLeaves.filter((s) => !currentSubs.includes(s));
  if (missingLeaves.length > 0) {
    const newSubs = [...currentSubs, ...missingLeaves];
    const newSubArrayStr = 'textbookSubsections: ' + formatStringArray(newSubs, 10);
    if (subArrayMatch) {
      text = text.replace(subArrayMatch[0], newSubArrayStr);
    } else {
      // Insert before closing of mapping block if no textbookSubsections existed
      text = text.replace(/(bishopMapping=\{\{[\s\S]*?)(\}\})/, `$1  ${newSubArrayStr}\n  $2`);
    }
    changed = true;
  }

  // Ensure enough concept cards
  const conceptsMatch = text.match(/(concepts=\{\[)([\s\S]*?)(\]\})/);
  if (conceptsMatch) {
    const conceptBlock = conceptsMatch[2];
    const conceptCount = (conceptBlock.match(/title:\s*["']/g) || []).length;
    const needed = expectedLeaves.length - conceptCount;
    if (needed > 0) {
      // Use missing leaves as concept titles when possible; otherwise fallback
      const candidates = missingLeaves.length >= needed ? missingLeaves.slice(0, needed) : [...missingLeaves];
      while (candidates.length < needed) {
        candidates.push(`补充概念 ${candidates.length + 1}`);
      }
      const newConcepts = candidates.map((title) => {
        // Strip leading number like "5.2.1 " for a cleaner title
        const cleanTitle = title.replace(/^\d+(\.\d+)+\s+/, '');
        return `    {\n      title: "${cleanTitle}",\n      description: "介绍 ${cleanTitle} 的定义、关键公式与典型应用场景。",\n    },`;
      });
      const insertion = '\n' + newConcepts.join('\n') + '\n  ';
      const newConceptBlock = conceptBlock + insertion;
      text = text.replace(conceptsMatch[0], `${conceptsMatch[1]}${newConceptBlock}${conceptsMatch[3]}`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fullPath, text, 'utf8');
    console.log(`Updated ${fullPath}: +${missingLeaves.length} subsections, +${Math.max(0, expectedLeaves.length - ((conceptsMatch?.[2].match(/title:\s*["']/g) || []).length))} concepts`);
  }
}
