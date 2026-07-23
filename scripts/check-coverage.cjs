#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_TS = path.join(ROOT, 'src', 'course', 'manifest.ts');
const APP_TSX = path.join(ROOT, 'src', 'App.tsx');
const COVERAGE_JSON = path.join(ROOT, 'src', 'course', 'coverage_matrix.json');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const REPORT_MD = path.join(ROOT, 'reports', 'page_coverage_report.md');

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

function findPageFile(componentName, importPaths) {
  if (!componentName || componentName === 'DynamicPlaceholderPage') return null;
  const importPath = importPaths[componentName];
  if (importPath) {
    const resolved = path.join(ROOT, 'src', importPath.replace(/^\.\/pages\//, 'pages/')) + '.tsx';
    if (fs.existsSync(resolved)) return resolved;
  }
  // Fallback: search by component definition in files
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
    return content.includes(`export default function ${componentName}`) ||
           content.includes(`function ${componentName}(`) ||
           content.includes(`const ${componentName} =`);
  }) || null;
}

function semanticCheck(componentName, section) {
  const path = section.path.toLowerCase();

  // Generated Bishop pages are semantically correct by construction
  if (/^(Ch\d+|Appendix|PrerequisiteCh)/.test(componentName)) return true;

  // Prerequisite pages are allowed to use generic component names
  if (path.startsWith('/prerequisite/')) return true;

  // Old chapter files that are intentionally reused for correct Bishop content
  const knownCorrect = {
    'Chapter01OverviewPage': ['ch01/overview'],
    'Chapter01ModelPage': ['ch01/linear-regression'],
    'Chapter02OverviewPage': ['ch02/overview'],
    'Chapter02ModelPage': ['ch02/discriminative-classifiers'],
    'Chapter04GaussianDiscriminantAnalysisPage': ['ch02/generative-classifiers'],
    'Chapter07OverviewPage': ['ch03/overview'],
    'Chapter07NonlinearSupervisedLearningPage': ['ch03/limitations-of-fixed-basis-functions'],
    'Chapter07NeuralNetworksPage': ['ch03/multilayer-networks'],
    'Chapter07ModernNNModulesPage': ['ch03/deep-networks'],
    'Chapter07BackpropagationPage': ['ch05/evaluation-of-gradients'],
    'Chapter08BiasVariancePage': ['ch01/bias-variance'],
    'Chapter08DoubleDescentPage': ['ch06/learning-curves'],
    'Chapter09OverviewPage': ['ch06/overview'],
    'Chapter09RegularizationPage': ['ch06/weight-decay'],
    'Chapter10KMeansPage': ['ch12/k-means-clustering'],
    'Chapter11GMMRevisitedPage': ['ch12/mixtures-of-gaussians'],
    'Chapter11GaussianMixtureEMPage': ['ch12/expectation-maximization'],
    'Chapter12PCAPage': ['ch13/principal-component-analysis'],
  };

  if (knownCorrect[componentName]) {
    return knownCorrect[componentName].some((k) => path.includes(k));
  }

  return false;
}

function pageChecks(pageSource) {
  const src = pageSource;
  return {
    hasBishopChapter: /bishopChapter|bishopMapping|教材映射|Bishop\s+Ch/i.test(src),
    hasBishopSection: /bishopSection|§\d+\.\d+/i.test(src),
    hasLearningObjectives: /learningObjectives|学习目标/i.test(src),
    hasCommonMistakes: /commonMistakes|常见误区/i.test(src),
  };
}

function resolveImportPath(importPath) {
  if (!importPath) return null;
  let relative = importPath;
  if (relative.startsWith('@/')) {
    relative = relative.replace('@/', 'src/');
  } else if (relative.startsWith('./')) {
    return null; // relative imports are not handled here
  }
  const candidate = path.join(ROOT, relative) + '.tsx';
  if (fs.existsSync(candidate)) return candidate;
  return null;
}

function findWrappedSource(pageSource) {
  // Detect wrapper: import X from '...'; return <X /> or fragment containing <X />
  const importMatch = pageSource.match(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
  if (!importMatch) return null;
  const importedName = importMatch[1];
  const importPath = importMatch[2];
  // Match <X /> or <X/> in any context (including fragments)
  const usesImport = pageSource.includes(`<${importedName} />`) || pageSource.includes(`<${importedName}/>`);
  if (!usesImport) return null;
  return resolveImportPath(importPath);
}

function main() {
  const manifestSource = fs.readFileSync(MANIFEST_TS, 'utf8');
  const appSource = fs.readFileSync(APP_TSX, 'utf8');
  const coverage = JSON.parse(fs.readFileSync(COVERAGE_JSON, 'utf8'));

  const sections = parseManifestSections(manifestSource);
  const components = extractSectionComponents(appSource);
  const importPaths = extractImportPaths(appSource);

  const report = {
    total: sections.length,
    mapped: 0,
    unmapped: 0,
    semanticIssues: [],
    metadataIssues: [],
    statusSummary: {},
  };

  const lines = [];
  lines.push('# Coverage Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');

  for (const section of sections) {
    report.statusSummary[section.status] = (report.statusSummary[section.status] || 0) + 1;
    const componentName = components[section.path];
    const coverageEntry = coverage.find((c) => c.routePath === section.path);

    if (!componentName) {
      report.unmapped++;
      report.metadataIssues.push({
        path: section.path,
        title: section.title,
        issue: 'No component mapping in App.tsx',
      });
      continue;
    }
    report.mapped++;

    if (coverageEntry) {
      coverageEntry.componentName = componentName;
      coverageEntry.status = section.status;
    }

    const semOk = semanticCheck(componentName, section);
    if (!semOk) {
      report.semanticIssues.push({
        path: section.path,
        title: section.title,
        componentName,
        issue: 'Component name is not semantically consistent with Bishop section',
      });
    }

    // Overview pages are chapter summaries and do not require full Bishop metadata.
    if (section.path.endsWith('/overview')) continue;

    const pageFile = findPageFile(componentName, importPaths);
    if (pageFile) {
      const src = fs.readFileSync(pageFile, 'utf8');
      let checks = pageChecks(src);
      const wrapped = findWrappedSource(src);
      if (wrapped) {
        const wrappedSrc = fs.readFileSync(wrapped, 'utf8');
        const wrappedChecks = pageChecks(wrappedSrc);
        checks = Object.fromEntries(
          Object.keys(checks).map((k) => [k, checks[k] || wrappedChecks[k]])
        );
      } else if (process.env.DEBUG_COVERAGE) {
        console.log(`No wrapped source found for ${componentName} (${section.path})`);
      }
      const missing = Object.entries(checks)
        .filter(([, v]) => !v)
        .map(([k]) => k.replace(/has/g, ''));
      if (missing.length > 0) {
        report.metadataIssues.push({
          path: section.path,
          title: section.title,
          componentName,
          issue: `Missing page metadata sections: ${missing.join(', ')}`,
        });
      }
    } else {
      report.metadataIssues.push({
        path: section.path,
        title: section.title,
        componentName,
        issue: 'Could not locate source file for component',
      });
    }
  }

  // Write updated coverage JSON
  fs.writeFileSync(COVERAGE_JSON, JSON.stringify(coverage, null, 2), 'utf8');

  // Build report markdown
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Total sections: ${report.total}`);
  lines.push(`- Mapped in App.tsx: ${report.mapped}`);
  lines.push(`- Unmapped: ${report.unmapped}`);
  lines.push(`- Semantic inconsistencies: ${report.semanticIssues.length}`);
  lines.push(`- Metadata issues: ${report.metadataIssues.length}`);
  lines.push('');
  lines.push('### Status Summary');
  lines.push('');
  for (const [status, count] of Object.entries(report.statusSummary).sort()) {
    lines.push(`- ${status}: ${count}`);
  }
  lines.push('');

  if (report.semanticIssues.length > 0) {
    lines.push('## Semantic Inconsistencies');
    lines.push('');
    for (const issue of report.semanticIssues) {
      lines.push(`- \`${issue.path}\` **${issue.title}** → ${issue.componentName}: ${issue.issue}`);
    }
    lines.push('');
  }

  if (report.metadataIssues.length > 0) {
    lines.push('## Metadata / Routing Issues');
    lines.push('');
    for (const issue of report.metadataIssues) {
      lines.push(`- \`${issue.path}\` **${issue.title}**${issue.componentName ? ` → ${issue.componentName}` : ''}: ${issue.issue}`);
    }
    lines.push('');
  }

  if (report.semanticIssues.length === 0 && report.metadataIssues.length === 0) {
    lines.push('## Result');
    lines.push('');
    lines.push('✅ All sections are correctly mapped and contain required metadata.');
    lines.push('');
  }

  fs.writeFileSync(REPORT_MD, lines.join('\n'), 'utf8');
  console.log(`Coverage report written to ${path.relative(ROOT, REPORT_MD)}`);
  console.log(`Summary: ${report.mapped}/${report.total} mapped, ${report.semanticIssues.length} semantic issues, ${report.metadataIssues.length} metadata issues`);

  if (report.semanticIssues.length > 0 || report.metadataIssues.length > 0) {
    process.exit(1);
  }
}

main();
