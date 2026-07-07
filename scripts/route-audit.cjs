const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APP_TSX = path.join(ROOT, 'src', 'App.tsx');
const MANIFEST_TS = path.join(ROOT, 'src', 'course', 'manifest.ts');
const appSrc = fs.readFileSync(APP_TSX, 'utf8');
const manifestSrc = fs.readFileSync(MANIFEST_TS, 'utf8');

// Parse manifest: path -> { title, status, bishop chapter/section }
const manifestMap = new Map();
const sectionRe = /\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*path:\s*"([^"]+)",\s*status:\s*"([^"]+)"/g;
let m;
while ((m = sectionRe.exec(manifestSrc)) !== null) {
  manifestMap.set(m[3], { title: m[2], status: m[4] });
}

// Parse imports from App.tsx
const importMap = new Map();
const importRe = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"];/g;
while ((m = importRe.exec(appSrc)) !== null) {
  importMap.set(m[1], m[2]);
}

// Parse route -> component name from sectionComponents block
const startIdx = appSrc.indexOf('const sectionComponents');
const endIdx = appSrc.indexOf('};', startIdx) + 2;
const block = appSrc.slice(startIdx, endIdx);
const routeRe = /'([^']+)':\s*([A-Za-z0-9_]+)/g;
const routes = [];
while ((m = routeRe.exec(block)) !== null) {
  routes.push({ path: m[1], component: m[2] });
}

function findComponentFile(componentName, importPath) {
  if (!importPath) return null;
  let relative = importPath;
  if (relative.startsWith('./')) {
    relative = path.join('src/App.tsx', relative).replace(/\\/g, '/');
    relative = relative.replace('src/App.tsx/', 'src/');
  } else if (relative.startsWith('@/')) {
    relative = relative.replace('@/', 'src/');
  }
  const candidate = path.join(ROOT, relative) + '.tsx';
  if (fs.existsSync(candidate)) return candidate;
  return null;
}

function isLegacyComponent(componentName, componentSrc) {
  if (/^Chapter\d+/.test(componentName)) return true;
  if (!componentSrc) return false;
  return /from\s+['"]@\/pages\/chapters\/chapter\d+/.test(componentSrc);
}

// Legacy components that are intentionally reused for correct Bishop routes.
const ALLOWED_LEGACY = new Set([
  '/ch01/overview',
  '/ch01/linear-regression',
  '/ch02/overview',
  '/ch02/generative-classifiers',
  '/ch02/discriminative-classifiers',
  '/ch03/overview',
  '/ch03/limitations-of-fixed-basis-functions',
  '/ch03/multilayer-networks',
  '/ch03/deep-networks',
  '/ch06/overview',
  '/ch06/weight-decay',
  '/ch06/learning-curves',
  '/ch12/k-means-clustering',
  '/ch12/mixtures-of-gaussians',
  '/ch12/expectation-maximization',
]);

function extractVisibleTitle(componentSrc) {
  if (!componentSrc) return '';
  const h1Match = componentSrc.match(/<h1[^>]*>(?:[^<]*<[^/][^>]*>)?([^<]+)/);
  if (h1Match) return h1Match[1].trim();
  const summaryMatch = componentSrc.match(/summary=\{[`"]([^`"]+)/);
  if (summaryMatch) return summaryMatch[1].trim();
  const titleMatch = componentSrc.match(/title:\s*"([^"]+)"/);
  if (titleMatch) return titleMatch[1].trim();
  return '';
}

function extractBishopChapterSection(componentSrc) {
  if (!componentSrc) return { chapter: '', section: '' };
  const chapterMatch = componentSrc.match(/bishopChapter[=:]\s*["']?(Ch\s*\d+|[\d\.]+)["']?/i);
  const sectionMatch = componentSrc.match(/bishopSection[=:]\s*["']([^"']+)["']/i);
  return {
    chapter: chapterMatch ? chapterMatch[1] : '',
    section: sectionMatch ? sectionMatch[1] : '',
  };
}

const rows = routes.map((r) => {
  const manifestEntry = manifestMap.get(r.path);
  const importPath = importMap.get(r.component);
  const componentFile = findComponentFile(r.component, importPath);
  const componentSrc = componentFile ? fs.readFileSync(componentFile, 'utf8') : '';
  const visibleTitle = extractVisibleTitle(componentSrc) || manifestEntry?.title || '';
  const bishop = extractBishopChapterSection(componentSrc);
  const usesLegacy = isLegacyComponent(r.component, componentSrc);

  const issues = [];
  if (!manifestEntry) {
    issues.push('Route not in manifest');
  }
  if (usesLegacy && !ALLOWED_LEGACY.has(r.path)) {
    issues.push('Uses legacy component');
  }
  if (/第[一二三四五六七八九十]+章/.test(visibleTitle) || /第\s*\d+\s*章/.test(visibleTitle)) {
    issues.push('Page contains old Chinese chapter numbering');
  }

  return {
    routePath: r.path,
    bishopChapter: bishop.chapter,
    bishopSection: bishop.section,
    componentName: r.component,
    visibleTitle,
    usesLegacy,
    issue: issues.join('; ') || 'OK',
  };
});

const header = '| routePath | bishopChapter | bishopSection | componentName | visibleTitle | usesLegacyComponent | issue |\n|---|---|---|---|---|---|---|\n';
const body = rows.map((r) => `| ${r.routePath} | ${r.bishopChapter} | ${r.bishopSection} | ${r.componentName} | ${r.visibleTitle} | ${r.usesLegacy} | ${r.issue} |`).join('\n');
const summary = `\n\nTotal routes: ${rows.length}\nOK: ${rows.filter((r) => r.issue === 'OK').length}\nWith issues: ${rows.filter((r) => r.issue !== 'OK').length}\n`;
const report = header + body + summary;

fs.writeFileSync(path.join(ROOT, 'route_audit_report.md'), report, 'utf8');
console.log(`Route audit written to route_audit_report.md (${rows.length} routes, ${rows.filter((r) => r.issue !== 'OK').length} issues)`);
