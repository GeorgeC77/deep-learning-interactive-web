import fs from 'node:fs';
import path from 'node:path';
import { getAllSections, type Section } from '../src/course/manifest.ts';

const coverageMatrix = JSON.parse(fs.readFileSync('src/course/coverage_matrix.json', 'utf8')) as Array<{
  routePath: string;
  bishopChapter?: string;
  bishopSection?: string;
}>;
const coverageByPath = new Map(coverageMatrix.map((entry) => [entry.routePath, entry]));

const officialSubsections: string[] = JSON.parse(
  fs.readFileSync('scripts/allowedSubsections.json', 'utf8')
);

const TEMPLATE_PHRASES = [
  '与本节讨论的问题完全无关',
  '在任何情况下都不需要额外假设即可使用',
  '只要样本量足够大，前提假设就不重要',
  '结果与直觉相反时首先应该检查假设',
  '复述本节核心公式并说明每个符号含义',
  '找出本节结论与相邻小节结论的异同',
];

const WRONG_FORMULA_REGEXES = [
  /p_x\s*=\s*p_z\s*-\s*ln\s*\|\s*det\s*J\s*\|/i,
  /p_x\(x\)\s*=\s*p_z\(z\)\s*-\s*ln\s*\|\s*det\s*J\s*\|/i,
];

const OLD_CHAPTER_REFS = [
  /第[一二三四五六七八九十]+章/,
  /第[\\d]+章/,
];

const appText = fs.readFileSync('src/App.tsx', 'utf8');

const importMap: Record<string, string> = {};
for (const m of appText.matchAll(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/g)) {
  importMap[m[1]] = m[2];
}

const routeComponentMap: Record<string, string> = {};
const scMatch = appText.match(/const sectionComponents: Record<string, React\.ComponentType> = \{([\s\S]*?)\n\};/);
if (scMatch) {
  const body = scMatch[1];
  for (const m of body.matchAll(/['"]([^'"]+)['"]\s*:\s*(\w+),?/g)) {
    routeComponentMap[m[1]] = m[2];
  }
}

function isBishopSectionRoute(sec: Section): boolean {
  const entry = coverageByPath.get(sec.path);
  const section = entry?.bishopSection ?? '';
  return section.length > 0;
}

function getBishopChapter(sec: Section): string {
  return coverageByPath.get(sec.path)?.bishopChapter ?? '';
}

function resolveComponentFile(importSource: string): string {
  if (!importSource) return '';
  const rel = importSource.replace(/^\.\//, '');
  return `src/${rel}.tsx`;
}

function extractQuotedStrings(block: string): string[] {
  const out: string[] = [];
  for (const m of block.matchAll(/"((?:\\.|[^"\\])*)"/g)) {
    out.push(m[1]);
  }
  return out;
}

function extractFirstArray(block: string, key: string): string[] {
  const keyRe = new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`);
  const m = block.match(keyRe);
  return m ? extractQuotedStrings(m[1]) : [];
}

function extractBlock(text: string, propName: string): string | null {
  const re = new RegExp(`${propName}=\\{\\[([\\s\\S]*?)\\]\\}`);
  const m = text.match(re);
  return m ? m[1] : null;
}

function looksLikeSubsection(title: string): boolean {
  return /\d+\.\d+/.test(title) || /Appendix [A-C]\.\d+/.test(title);
}

function containsChinese(s: string): boolean {
  return /[\u4e00-\u9fff]/.test(s);
}

function hasTemplatePhrase(s: string): string | null {
  for (const phrase of TEMPLATE_PHRASES) {
    if (s.includes(phrase)) return phrase;
  }
  return null;
}

// ---------- Build allowed subsection set ----------
const allowedSubsections = new Set<string>(officialSubsections);

// ---------- Route audit ----------
const routeRows: {
  routePath: string;
  manifestTitle: string;
  componentName: string;
  componentFile: string;
  usesLegacyComponent: boolean;
  issue: string;
}[] = [];

for (const sec of getAllSections()) {
  const routePath = sec.path;
  const componentName = routeComponentMap[routePath] ?? 'DynamicPlaceholderPage';
  const importSource = importMap[componentName] ?? '';
  const componentFile = resolveComponentFile(importSource);
  const usesLegacy = componentFile.includes('src/pages/chapters/');
  let issue = '';
  if (usesLegacy && isBishopSectionRoute(sec)) {
    issue = `Bishop section route uses legacy component (${componentName})`;
  }
  routeRows.push({
    routePath,
    manifestTitle: sec.title,
    componentName,
    componentFile,
    usesLegacyComponent: usesLegacy,
    issue,
  });
}

// ---------- Generated page audits ----------
const generatedDir = 'src/pages/generated';
const generatedFiles = fs.readdirSync(generatedDir).filter((f) => f.endsWith('.tsx'));

type InvalidSubsectionRow = { componentFile: string; routePath: string; subsection: string };
type TemplateRow = { componentFile: string; routePath: string; phrase: string; context: string };
type WrongFormulaRow = { componentFile: string; routePath: string; snippet: string };
type ConceptCoverageRow = { componentFile: string; routePath: string; note: string };
type SupplementalTopicRow = { componentFile: string; routePath: string; topic: string; note: string };
type OldTitleRow = { componentFile: string; routePath: string; match: string };

const invalidSubsectionRows: InvalidSubsectionRow[] = [];
const templateRows: TemplateRow[] = [];
const wrongFormulaRows: WrongFormulaRow[] = [];
const conceptCoverageRows: ConceptCoverageRow[] = [];
const supplementalTopicRows: SupplementalTopicRow[] = [];
const oldTitleRows: OldTitleRow[] = [];

for (const file of generatedFiles) {
  const fullPath = path.join(generatedDir, file);
  const text = fs.readFileSync(fullPath, 'utf8');

  const sectionPathMatch = text.match(/sectionPath=["']([^"']+)["']/);
  const routePath = sectionPathMatch ? sectionPathMatch[1] : '';

  const mappingMatch = text.match(/bishopMapping=\{\{([\s\S]*?)\}\}/);
  if (!mappingMatch) continue;
  const mappingBlock = mappingMatch[1];

  const chapterMatch = mappingBlock.match(/chapter:\s*["']([^"']+)["']/);
  const bishopChapter = chapterMatch ? chapterMatch[1] : '';
  const enforceSubsections = /^(Ch (\d+|Appendix [A-C]))$/.test(bishopChapter);

  const subsections = extractFirstArray(mappingBlock, 'textbookSubsections');

  if (enforceSubsections) {
    for (const sub of subsections) {
      if (!allowedSubsections.has(sub)) {
        invalidSubsectionRows.push({ componentFile: `src/pages/generated/${file}`, routePath, subsection: sub });
      }
      if (containsChinese(sub)) {
        invalidSubsectionRows.push({ componentFile: `src/pages/generated/${file}`, routePath, subsection: `${sub} (contains Chinese)` });
      }
    }
  }

  const supplementalTopics = extractFirstArray(mappingBlock, 'supplementalTopics');
  for (const topic of supplementalTopics) {
    if (looksLikeSubsection(topic)) {
      supplementalTopicRows.push({
        componentFile: `src/pages/generated/${file}`,
        routePath,
        topic,
        note: 'supplementalTopics should not contain textbook-style subsection numbers',
      });
    }
  }

  const conceptBlock = extractBlock(text, 'concepts');
  const conceptTitles: string[] = [];
  if (conceptBlock) {
    for (const m of conceptBlock.matchAll(/title:\s*["']([^"']+)["']/g)) {
      conceptTitles.push(m[1]);
    }
  }
  const conceptCount = conceptTitles.length;
  const leafSubsectionCount = enforceSubsections
    ? subsections.filter((s) => /^\d+\.\d+\.\d+/.test(s)).length
    : 0;
  if (enforceSubsections && leafSubsectionCount > 0 && conceptCount < leafSubsectionCount) {
    conceptCoverageRows.push({
      componentFile: `src/pages/generated/${file}`,
      routePath,
      note: `Only ${conceptCount} concept cards for ${leafSubsectionCount} leaf textbook subsections`,
    });
  }

  function checkStringsForTemplates(strings: string[], source: string) {
    for (const s of strings) {
      const phrase = hasTemplatePhrase(s);
      if (phrase) {
        templateRows.push({ componentFile: `src/pages/generated/${file}`, routePath, phrase, context: `[${source}] ${s.slice(0, 120)}` });
      }
    }
  }

  const cmBlock = extractBlock(text, 'commonMistakes');
  if (cmBlock) {
    const strings = extractQuotedStrings(cmBlock);
    checkStringsForTemplates(strings, 'commonMistakes');
    for (const s of strings) {
      for (const re of WRONG_FORMULA_REGEXES) {
        const match = s.match(re);
        if (match) {
          const idx = match.index ?? 0;
          const prefix = s.slice(Math.max(0, idx - 30), idx);
          if (/错误|incorrect|wrong|不应/i.test(prefix)) continue;
          wrongFormulaRows.push({ componentFile: `src/pages/generated/${file}`, routePath, snippet: match[0] });
        }
      }
    }
  }

  const quizBlock = extractBlock(text, 'quiz');
  if (quizBlock) {
    const strings = extractQuotedStrings(quizBlock);
    checkStringsForTemplates(strings, 'quiz');
  }

  const exercisesBlock = extractBlock(text, 'exercises');
  if (exercisesBlock) {
    const strings = extractQuotedStrings(exercisesBlock);
    checkStringsForTemplates(strings, 'exercises');
  }

  // Heuristic for extra parentheses in GAN loss strings.
  if (/ln\(1-D\(G\(z\)\)\)\)/.test(text)) {
    wrongFormulaRows.push({ componentFile: `src/pages/generated/${file}`, routePath, snippet: 'ln(1-D(G(z)))) extra parenthesis' });
  }

  for (const re of OLD_CHAPTER_REFS) {
    const match = text.match(re);
    if (match) {
      oldTitleRows.push({ componentFile: `src/pages/generated/${file}`, routePath, match: match[0] });
    }
  }
}

// ---------- Write route audit report ----------
const routeMd = [
  '# Route Audit Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '| routePath | manifestTitle | componentName | componentFile | usesLegacyComponent | issue |',
  '|-----------|---------------|---------------|---------------|---------------------|-------|',
  ...routeRows.map((r) => {
    const file = r.componentFile || '(none)';
    return `| ${r.routePath} | ${r.manifestTitle} | ${r.componentName} | ${file} | ${r.usesLegacyComponent} | ${r.issue || 'OK'} |`;
  }),
  '',
  `Total routes: ${routeRows.length}`,
  `Legacy components: ${routeRows.filter((r) => r.usesLegacyComponent).length}`,
  `Issues: ${routeRows.filter((r) => r.issue).length}`,
].join('\n');
fs.writeFileSync('route_audit_report.md', routeMd, 'utf8');

// ---------- Write invalid Bishop subsections report ----------
const invalidMd = [
  '# Invalid Bishop Subsections Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  'The following `textbookSubsections` entries are not in the allowed Bishop list.',
  'Supplemental material should be moved to `supplementalTopics`.',
  '',
  '| componentFile | routePath | invalidSubsection |',
  '|---------------|-----------|-------------------|',
  ...invalidSubsectionRows.map((r) => `| ${r.componentFile} | ${r.routePath} | ${r.subsection} |`),
  '',
  `Total invalid subsections: ${invalidSubsectionRows.length}`,
  '',
  '## Other Content Issues',
  '',
  '### Wrong density formula in commonMistakes',
  ...(wrongFormulaRows.length
    ? [
        '| componentFile | routePath | snippet |',
        '|---------------|-----------|---------|',
        ...wrongFormulaRows.map((r) => `| ${r.componentFile} | ${r.routePath} | \`${r.snippet}\` |`),
      ]
    : ['None.']),
  '',
  '### Template phrases in quiz/commonMistakes',
  ...(templateRows.length
    ? [
        '| componentFile | routePath | phrase | context |',
        '|---------------|-----------|--------|---------|',
        ...templateRows.map((r) => `| ${r.componentFile} | ${r.routePath} | ${r.phrase} | ${r.context.replace(/\|/g, '\\|')} |`),
      ]
    : ['None.']),
  '',
  '### supplementalTopics containing subsection-style entries',
  ...(supplementalTopicRows.length
    ? [
        '| componentFile | routePath | topic | note |',
        '|---------------|-----------|-------|------|',
        ...supplementalTopicRows.map((r) => `| ${r.componentFile} | ${r.routePath} | ${r.topic} | ${r.note} |`),
      ]
    : ['None.']),
  '',
  '### Old chapter references in generated pages',
  ...(oldTitleRows.length
    ? [
        '| componentFile | routePath | match |',
        '|---------------|-----------|-------|',
        ...oldTitleRows.map((r) => `| ${r.componentFile} | ${r.routePath} | ${r.match} |`),
      ]
    : ['None.']),
  '',
  '### Concept coverage warnings',
  ...(conceptCoverageRows.length
    ? [
        '| componentFile | routePath | note |',
        '|---------------|-----------|------|',
        ...conceptCoverageRows.map((r) => `| ${r.componentFile} | ${r.routePath} | ${r.note} |`),
      ]
    : ['None.']),
].join('\n');
fs.writeFileSync('invalid_bishop_subsections_report.md', invalidMd, 'utf8');

// ---------- Write coverage report ----------
const legacyCount = routeRows.filter((r) => r.usesLegacyComponent).length;
const issueCount = routeRows.filter((r) => r.issue).length;
const statusSummary: Record<string, number> = {};
for (const sec of getAllSections()) {
  statusSummary[sec.status] = (statusSummary[sec.status] ?? 0) + 1;
}

const fatalIssues =
  invalidSubsectionRows.length +
  wrongFormulaRows.length +
  templateRows.length +
  supplementalTopicRows.length +
  oldTitleRows.length +
  issueCount;
const allIssues = fatalIssues + conceptCoverageRows.length;

const coverageMd = [
  '# Coverage Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  `Total mapped routes: ${getAllSections().length}`,
  `Routes using legacy components: ${legacyCount}`,
  `Bishop route / legacy component issues: ${issueCount}`,
  `Invalid Bishop subsections: ${invalidSubsectionRows.length}`,
  `Wrong density formulas: ${wrongFormulaRows.length}`,
  `Template phrase occurrences: ${templateRows.length}`,
  `Supplemental topic issues: ${supplementalTopicRows.length}`,
  `Old chapter references: ${oldTitleRows.length}`,
  `Concept coverage warnings: ${conceptCoverageRows.length}`,
  '',
  '## Status Summary',
  '',
  ...Object.entries(statusSummary).map(([status, count]) => `- ${status}: ${count}`),
  '',
  fatalIssues === 0
    ? '✅ All fatal audit items pass.' + (conceptCoverageRows.length ? ` (${conceptCoverageRows.length} concept coverage warning(s) remain.)` : '')
    : '⚠️ Some issues remain; see route_audit_report.md and invalid_bishop_subsections_report.md.',
].join('\n');
fs.writeFileSync('coverage_report.md', coverageMd, 'utf8');

console.log(`Audit complete.`);
console.log(`Routes: ${routeRows.length}, legacy components: ${legacyCount}, route issues: ${issueCount}`);
console.log(`Invalid subsections: ${invalidSubsectionRows.length}`);
console.log(`Wrong formulas: ${wrongFormulaRows.length}`);
console.log(`Template phrases: ${templateRows.length}`);
console.log(`Supplemental topic issues: ${supplementalTopicRows.length}`);
console.log(`Old chapter references: ${oldTitleRows.length}`);
console.log(`Concept coverage warnings: ${conceptCoverageRows.length}`);

if (fatalIssues > 0) {
  process.exit(1);
}
