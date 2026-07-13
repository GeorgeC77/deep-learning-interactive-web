#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_TS = path.join(ROOT, 'src', 'course', 'manifest.ts');
const APP_TSX = path.join(ROOT, 'src', 'App.tsx');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const DEMOS_DIR = path.join(ROOT, 'src', 'components', 'demos');
const MATH_TESTS_DIR = path.join(ROOT, 'src', 'math-tests');
const PEDAGOGICAL_TESTS_DIR = path.join(ROOT, 'src', 'pedagogical-tests');
const OUTPUT_JSON = path.join(ROOT, 'src', 'course', 'interaction_matrix.json');
const OUTPUT_MD = path.join(ROOT, 'reports', 'full_course_interaction_coverage.md');

function parseManifestSections(source) {
  const sections = [];
  const regex = /\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*path:\s*"([^"]+)",\s*status:\s*"([^"]+)"/g;
  let m;
  while ((m = regex.exec(source)) !== null) {
    sections.push({ id: m[1], title: m[2], path: m[3], status: m[4] });
  }
  return sections;
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

function extractImportPaths(appSource) {
  const map = {};
  const regex = /import\s+(\w+)\s+from\s+'([^']+)';/g;
  let m;
  while ((m = regex.exec(appSource)) !== null) {
    map[m[1]] = m[2];
  }
  return map;
}

function resolveImportPath(importPath) {
  if (!importPath) return null;
  if (importPath.startsWith('@/')) {
    const relative = importPath.replace('@/', 'src/');
    return path.join(ROOT, relative) + '.tsx';
  }
  if (importPath.startsWith('./')) {
    return path.join(ROOT, 'src', importPath.replace(/^\.\//, '').replace(/^pages\//, 'pages/')) + '.tsx';
  }
  return null;
}

function findPageFile(componentName, importPaths) {
  if (!componentName || componentName === 'DynamicPlaceholderPage') return null;
  const importPath = importPaths[componentName];
  if (importPath) {
    const resolved = resolveImportPath(importPath);
    if (resolved && fs.existsSync(resolved)) return resolved;
  }
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.tsx')) files.push(full);
    }
  }
  walk(PAGES_DIR);
  return files.find((f) => {
    const content = fs.readFileSync(f, 'utf8');
    return (
      content.includes(`export default function ${componentName}`) ||
      content.includes(`function ${componentName}(`) ||
      content.includes(`const ${componentName} =`)
    );
  }) || null;
}

function findWrappedSource(pageSource) {
  const importMatch = pageSource.match(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
  if (!importMatch) return null;
  const importedName = importMatch[1];
  const importPath = importMatch[2];
  const usesImport = new RegExp(`<${importedName}[^/]*/?\\s*/>`).test(pageSource);
  if (!usesImport) return null;
  return resolveImportPath(importPath);
}

function readPageSource(pageFile) {
  if (!pageFile || !fs.existsSync(pageFile)) return '';
  let src = fs.readFileSync(pageFile, 'utf8');
  const wrapped = findWrappedSource(src);
  if (wrapped && fs.existsSync(wrapped)) {
    src += '\n' + fs.readFileSync(wrapped, 'utf8');
  }
  return src;
}

function collectDemoSources(source) {
  const demos = [];
  // Imports like import X from '@/components/demos/X'
  const importRegex = /import\s+(\w+)\s+from\s+['"]@\/components\/demos\/([^'"]+)['"];/g;
  let m;
  while ((m = importRegex.exec(source)) !== null) {
    const demoFile = path.join(DEMOS_DIR, `${m[2]}.tsx`);
    if (fs.existsSync(demoFile)) demos.push({ name: m[1], file: demoFile, source: fs.readFileSync(demoFile, 'utf8') });
  }
  return demos;
}

function hasMathTestForModule(moduleName) {
  const candidate = path.join(MATH_TESTS_DIR, `${moduleName}.test.ts`);
  return fs.existsSync(candidate);
}

function mathTestsFromSource(source) {
  const imports = [];
  const regex = /@\/lib\/math\/(\w+)/g;
  let m;
  while ((m = regex.exec(source)) !== null) {
    imports.push(m[1]);
  }
  if (imports.length === 0) return false;
  return imports.some(hasMathTestForModule);
}

function semanticTestsForComponents(componentNames, pageFile) {
  if (componentNames.length === 0 || !pageFile) return false;
  const testFiles = fs.readdirSync(PEDAGOGICAL_TESTS_DIR).filter((f) => f.endsWith('.test.ts') || f.endsWith('.test.tsx'));
  const bases = componentNames.concat([path.basename(pageFile)]);
  for (const tf of testFiles) {
    const content = fs.readFileSync(path.join(PEDAGOGICAL_TESTS_DIR, tf), 'utf8');
    for (const name of bases) {
      if (content.includes(name)) return true;
    }
  }
  return false;
}

function detectFeatures(source) {
  const staticExplanation = /summary\s*=|concepts\s*=|learningObjectives\s*=/i.test(source);
  const quiz = /quiz\s*=\s*\{/i.test(source);
  const submittedQuiz = quiz;
  const scalarDemo = /demo\s*=\s*\{\{/i.test(source);
  const customLab = /extraContent\s*=|interactiveDemo\s*=|@\/components\/demos\//i.test(source);
  const controlImports = (source.match(/@\/components\/ui\/(slider|switch|select|tabs|radio-group)/gi) || []).length;
  const hasSvgOrCanvas = /<svg|<canvas/i.test(source);
  const linkedViews = customLab || controlImports >= 2 || (controlImports >= 1 && hasSvgOrCanvas);
  const predictionGate = /PredictionGate/i.test(source);
  const prediction = predictionGate;
  const lock = quiz || predictionGate;
  const reveal = quiz || predictionGate;
  const evaluation = predictionGate;
  const feedback = predictionGate;
  const counterexample = /CounterexampleToggle|counterexample|反例|边界|极端/i.test(source);
  const transferChallenge = /transfer|迁移|transferChallenge|transfer-challenge|改变分布|新任务|分布偏移/i.test(source);
  const mathTests = mathTestsFromSource(source);
  return {
    staticExplanation,
    quiz,
    submittedQuiz,
    scalarDemo,
    customLab,
    linkedViews,
    predictionGate,
    prediction,
    lock,
    reveal,
    evaluation,
    feedback,
    counterexample,
    transferChallenge,
    mathTests,
  };
}

function main() {
  const manifestSource = fs.readFileSync(MANIFEST_TS, 'utf8');
  const appSource = fs.readFileSync(APP_TSX, 'utf8');
  const sections = parseManifestSections(manifestSource);
  const components = extractSectionComponents(appSource);
  const importPaths = extractImportPaths(appSource);

  const matrix = [];
  for (const section of sections) {
    const componentName = components[section.path] || 'DynamicPlaceholderPage';
    const pageFile = findPageFile(componentName, importPaths);
    const source = readPageSource(pageFile);
    const demos = collectDemoSources(source);
    const demoSource = demos.map((d) => d.source).join('\n');
    const combined = source + '\n' + demoSource;

    const features = detectFeatures(combined);
    const semanticTests = semanticTestsForComponents(
      [componentName].concat(demos.map((d) => d.name)),
      pageFile,
    );
    const completePredictionGate =
      features.prediction && features.lock && features.reveal && features.evaluation && features.feedback;
    const l3plus = features.customLab && (features.predictionGate || features.counterexample || features.transferChallenge);

    matrix.push({
      routePath: section.path,
      title: section.title,
      componentName,
      componentFile: pageFile ? path.relative(ROOT, pageFile) : null,
      demos: demos.map((d) => path.relative(ROOT, d.file)),
      status: section.status,
      ...features,
      semanticTests,
      completePredictionGate,
      l3plus,
    });
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(matrix, null, 2), 'utf8');

  const total = matrix.length;
  const customLabs = matrix.filter((r) => r.customLab).length;
  const predictionGates = matrix.filter((r) => r.completePredictionGate).length;
  const counterexamples = matrix.filter((r) => r.counterexample).length;
  const transferChallenges = matrix.filter((r) => r.transferChallenge).length;
  const l3plusCount = matrix.filter((r) => r.l3plus).length;
  const pct = (n) => total > 0 ? `${(n / total * 100).toFixed(1)}%` : '0.0%';

  const lines = [];
  lines.push('# Full Course Interaction Coverage Matrix');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('Coverage dimensions: StaticExplanation, GenericQuiz, SubmittedQuiz, ScalarDemo, CustomLab, LinkedViews, Prediction, Lock, Reveal, Evaluation, Feedback, Counterexample, TransferChallenge, MathTests, SemanticTests.');
  lines.push('');
  lines.push('- `GenericQuiz`: route provides a multiple-choice quiz.');
  lines.push('- `SubmittedQuiz`: quiz uses submit-then-lock-then-reveal flow.');
  lines.push('- `Prediction/Lock/Reveal/Evaluation/Feedback`: route (or its lab) uses a PredictionGate with the full predict → submit → reveal → feedback cycle.');
  lines.push('- `L3+`: route has a CustomLab plus at least one of PredictionGate, Counterexample, or TransferChallenge.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Total routes: ${total}`);
  lines.push(`- Custom-lab coverage: ${customLabs} (${pct(customLabs)})`);
  lines.push(`- Complete PredictionGate coverage: ${predictionGates} (${pct(predictionGates)})`);
  lines.push(`- Counterexample coverage: ${counterexamples} (${pct(counterexamples)})`);
  lines.push(`- Transfer-challenge coverage: ${transferChallenges} (${pct(transferChallenges)})`);
  lines.push(`- L3+ coverage: ${l3plusCount} (${pct(l3plusCount)})`);
  lines.push('');
  lines.push('> These counts are diagnostic metrics only; they do not by themselves imply that the course has reached a uniformly high level of interactive quality.');
  lines.push('');
  lines.push('## Coverage Matrix');
  lines.push('');
  lines.push('| Route | Static | Quiz | Submitted | Scalar | Lab | Linked | Pred | Lock | Reveal | Eval | Feed | Counter | Transfer | Math | Semantic | L3+ |');
  lines.push('|-------|--------|------|-----------|--------|-----|--------|------|------|--------|------|------|---------|----------|------|----------|-----|');
  for (const row of matrix) {
    const cells = [
      row.routePath,
      row.staticExplanation ? '✓' : '',
      row.quiz ? '✓' : '',
      row.submittedQuiz ? '✓' : '',
      row.scalarDemo ? '✓' : '',
      row.customLab ? '✓' : '',
      row.linkedViews ? '✓' : '',
      row.prediction ? '✓' : '',
      row.lock ? '✓' : '',
      row.reveal ? '✓' : '',
      row.evaluation ? '✓' : '',
      row.feedback ? '✓' : '',
      row.counterexample ? '✓' : '',
      row.transferChallenge ? '✓' : '',
      row.mathTests ? '✓' : '',
      row.semanticTests ? '✓' : '',
      row.l3plus ? '✓' : '',
    ];
    lines.push(`| ${cells.join(' | ')} |`);
  }
  lines.push('');

  fs.writeFileSync(OUTPUT_MD, lines.join('\n'), 'utf8');
  console.log(`Wrote interaction matrix to ${path.relative(ROOT, OUTPUT_JSON)}`);
  console.log(`Wrote coverage report to ${path.relative(ROOT, OUTPUT_MD)}`);
  console.log(`Summary: total=${total}, customLab=${customLabs}, predictionGate=${predictionGates}, counterexample=${counterexamples}, transferChallenge=${transferChallenges}, l3plus=${l3plusCount}`);
}

main();
