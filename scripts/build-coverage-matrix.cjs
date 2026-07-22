const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_TS = path.join(ROOT, 'src', 'course', 'manifest.ts');
const APP_TSX = path.join(ROOT, 'src', 'App.tsx');
const COVERAGE_JSON = path.join(ROOT, 'src', 'course', 'coverage_matrix.json');

function parseManifestArray(source) {
  const match = source.match(/export const courseManifest: Part\[\] = ([\s\S]*?);\s*\nexport function getAllSections/);
  if (!match) throw new Error('Could not find courseManifest array');
  let arrayText = match[1].trim();
  arrayText = arrayText.replace(/:\s*SectionStatus/g, '');
  arrayText = arrayText.replace(/:\s*PartKind/g, '');
  return new Function('return ' + arrayText + ';')();
}

function extractSectionComponents(source) {
  const match = source.match(/const sectionComponents: Record<string, React\.ComponentType> = \{([\s\S]*?)\};/);
  if (!match) throw new Error('Could not find sectionComponents');
  const block = match[1];
  const map = {};
  const regex = /'([^']+)':\s*(\w+),/g;
  let m;
  while ((m = regex.exec(block)) !== null) {
    map[m[1]] = m[2];
  }
  return map;
}

function inferSectionNumber(sectionTitle) {
  const m = sectionTitle.match(/^(\d+\.\d+)/);
  return m ? m[1] : '';
}

function inferBishopChapter(sectionPath) {
  const parts = sectionPath.replace(/^\//, '').split('/');
  if (parts[0] === 'appendix') return `Appendix ${parts[1].toUpperCase()}`;
  if (parts[0] === 'prerequisite') return `Ch ${Number(parts[1].replace('ch', ''))}`;
  const manifestNum = Number(parts[0].replace('ch', ''));
  const map = {
    1: 'Ch 4', 2: 'Ch 5', 3: 'Ch 6', 4: 'Ch 7', 5: 'Ch 8',
    6: 'Ch 9', 7: 'Ch 10', 8: 'Ch 11', 9: 'Ch 12', 10: 'Ch 13',
    11: 'Ch 14', 12: 'Ch 15', 13: 'Ch 16', 14: 'Ch 17', 15: 'Ch 18',
    16: 'Ch 19', 17: 'Ch 20',
  };
  return map[manifestNum] || `Ch ${manifestNum}`;
}

function buildCoverageEntry(section, componentName) {
  const bishopCh = section.bishopChapter || inferBishopChapter(section.path);
  const secNum = section.bishopSection || inferSectionNumber(section.title);
  const isGenerated = componentName?.startsWith('Ch') || componentName?.startsWith('Appendix') || componentName?.startsWith('PrerequisiteCh');
  const isWrong = !componentName;

  return {
    id: section.id,
    bishopChapter: bishopCh,
    bishopSection: secNum,
    sectionTitle: section.title,
    routePath: section.path,
    componentName: componentName || 'DynamicPlaceholderPage',
    formulasCovered: [],
    algorithmsCovered: [],
    interactiveDemos: isGenerated || ['/ch01/bias-variance', '/ch09/attention'].includes(section.path)
      ? [`${section.title} 交互演示`]
      : [],
    learningObjectives: [],
    commonMistakes: [],
    status: section.status || (isWrong ? 'draft' : 'content-reviewed'),
  };
}

function main() {
  const manifestSource = fs.readFileSync(MANIFEST_TS, 'utf8');
  const appSource = fs.readFileSync(APP_TSX, 'utf8');
  const manifest = parseManifestArray(manifestSource);
  const components = extractSectionComponents(appSource);

  const matrix = [];
  for (const part of manifest) {
    for (const chapter of part.chapters) {
      for (const section of chapter.sections) {
        matrix.push(buildCoverageEntry(section, components[section.path]));
      }
    }
  }

  fs.writeFileSync(COVERAGE_JSON, JSON.stringify(matrix, null, 2), 'utf8');
  console.log(`Wrote ${matrix.length} entries to ${path.relative(ROOT, COVERAGE_JSON)}`);
}

main();
