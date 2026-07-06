const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GENERATED_DIR = path.join(ROOT, 'src', 'pages', 'generated');
const MANIFEST_TS = path.join(ROOT, 'src', 'course', 'manifest.ts');

const manifestSrc = fs.readFileSync(MANIFEST_TS, 'utf8');

// Parse manifest for path -> title and description
const sectionRe = /\{\s*id:\s*"[^"]+",\s*title:\s*"([^"]+)",\s*path:\s*"([^"]+)",/g;
const manifestMap = new Map();
let m;
while ((m = sectionRe.exec(manifestSrc)) !== null) {
  manifestMap.set(m[2], m[1]);
}

function parseConcepts(src) {
  const concepts = [];
  const conceptRe = /\{\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)"(?:,\s*formula:\s*String\.raw`([^`]+)`)?\s*,?\s*\}/g;
  let cm;
  while ((cm = conceptRe.exec(src)) !== null) {
    concepts.push({ title: cm[1], description: cm[2], formula: cm[3] || null });
  }
  return concepts;
}

function inferBishopMapping(sectionPath, title, concepts) {
  const parts = sectionPath.replace(/^\//, '').split('/');
  let chapter = '';
  if (parts[0] === 'appendix') {
    chapter = `Appendix ${parts[1].toUpperCase()}`;
  } else if (parts[0] === 'prerequisite') {
    chapter = `Ch ${Number(parts[1].replace('ch', ''))}`;
  } else {
    const manifestNum = Number(parts[0].replace('ch', ''));
    const bishopMap = {
      1: 'Ch 4', 2: 'Ch 5', 3: 'Ch 6', 4: 'Ch 7', 5: 'Ch 8',
      6: 'Ch 9', 7: 'Ch 10', 8: 'Ch 11', 9: 'Ch 12', 10: 'Ch 13',
      11: 'Ch 14', 12: 'Ch 15', 13: 'Ch 16', 14: 'Ch 17', 15: 'Ch 18',
      16: 'Ch 19', 17: 'Ch 20',
    };
    chapter = bishopMap[manifestNum] || `Ch ${manifestNum}`;
  }

  const sectionMatch = title?.match(/^(\d+\.\d+(?:\.\d+)?)\s+/);
  const section = sectionMatch ? sectionMatch[1] : '';
  const sectionTitle = title ? title.replace(/^\d+(\.\d+)*\s+/, '') : '';

  const textbookSubsections = concepts
    .slice(0, 4)
    .map((c, i) => (section ? `${section}.${i + 1} ${c.title}` : `${c.title}`));

  const formulas = concepts
    .filter((c) => c.formula)
    .map((c) => `${c.title}公式`)
    .slice(0, 5);

  const algorithms = concepts
    .filter((c) => /算法|采样|传播|训练|更新|聚合|传播|检测|分割|编码|解码|匹配|优化|推断/i.test(c.title))
    .map((c) => c.title)
    .slice(0, 3);

  const exercises = [
    '复述本节核心公式并说明每个符号含义。',
    '用一个小例子验证本节概念或数值结论。',
    '找出本节结论与相邻小节结论的异同。',
  ];

  return {
    chapter,
    section,
    pages: chapter,
    textbookSubsections,
    formulas,
    algorithms,
    exercises,
  };
}

function replaceMapping(src, mapping) {
  const start = src.indexOf('bishopMapping={{');
  if (start === -1) return src;
  let depth = 0;
  let i = start + 'bishopMapping='.length;
  while (i < src.length && depth >= 0) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') depth--;
    i++;
    if (depth === 0) break;
  }
  const oldBlock = src.slice(start, i);

  const props = [];
  if (mapping.chapter) props.push(`chapter: ${JSON.stringify(mapping.chapter)}`);
  if (mapping.section) props.push(`section: ${JSON.stringify(mapping.section)}`);
  if (mapping.pages) props.push(`pages: ${JSON.stringify(mapping.pages)}`);
  if (mapping.textbookSubsections && mapping.textbookSubsections.length) {
    props.push(`textbookSubsections: [${mapping.textbookSubsections.map((s) => JSON.stringify(s)).join(', ')}]`);
  }
  if (mapping.formulas && mapping.formulas.length) {
    props.push(`formulas: [${mapping.formulas.map((s) => JSON.stringify(s)).join(', ')}]`);
  }
  if (mapping.algorithms && mapping.algorithms.length) {
    props.push(`algorithms: [${mapping.algorithms.map((s) => JSON.stringify(s)).join(', ')}]`);
  }
  if (mapping.exercises && mapping.exercises.length) {
    props.push(`exercises: [${mapping.exercises.map((s) => JSON.stringify(s)).join(', ')}]`);
  }

  const newBlock = `bishopMapping={{\n      ${props.join(',\n      ')}\n    }}`;
  return src.replace(oldBlock, newBlock);
}

const files = fs.readdirSync(GENERATED_DIR).filter((f) => f.endsWith('.tsx'));
let updated = 0;
for (const file of files) {
  const filePath = path.join(GENERATED_DIR, file);
  const src = fs.readFileSync(filePath, 'utf8');
  const sectionMatch = src.match(/sectionPath="([^"]+)"/);
  if (!sectionMatch) continue;
  const sectionPath = sectionMatch[1];
  if (!src.includes('bishopMapping={{')) continue;

  const title = manifestMap.get(sectionPath) || '';
  const concepts = parseConcepts(src);
  const mapping = inferBishopMapping(sectionPath, title, concepts);
  const newSrc = replaceMapping(src, mapping);
  if (newSrc !== src) {
    fs.writeFileSync(filePath, newSrc, 'utf8');
    updated++;
  }
}

console.log(`Updated bishopMapping in ${updated} generated pages.`);
