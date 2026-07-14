import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { getAllSections } from '../src/course/manifest.ts';

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

function resolveComponentFile(importSource: string): string {
  if (!importSource) return '';
  const rel = importSource.replace(/^\.\//, '');
  return `src/${rel}.tsx`;
}

const P0_SEMANTIC_REGEXES: RegExp[] = [
  /降维就是找映射，生成就是逆映射/,
  /定位对分类决策最重要的区域/,
  /置换等变与任意尺寸/,
  /由于只含卷积操作/,
  /若不整除才出现下采样/,
  /伪多头/,
];

const SEMANTIC_TEMPLATE_REGEXES: RegExp[] = [
  /只是术语，没有独立建模意义/,
  /忽视其前提假设/,
  /结果与预期不符应优先排查前提/,
  /介绍.*的定义、关键公式与典型应用场景/,
  /只是.*术语/,
  /不需要任何.*假设即可/,
  /只要.*足够.*就不重要/,
];

const TEMPLATE_REGEXES: RegExp[] = [
  /与本节讨论的问题完全无关/,
  /在任何情况下都不需要额外假设即可使用/,
  /只要样本量足够大，前提假设就不重要/,
  /结果与直觉相反/,
  /写出本节.*核心公式/,
  /比较本节.*前面.*结论/,
  /把不同小节的概念混为一谈/,
  /只看公式形式而不验证/,
  /忽略其中某一项/,
  /违背直觉/,
  /推导本节/,
  /验证本节概念/,
  /对比本节结论/,
  /先前章节结论/,
  /相邻小节的前提假设/,
  /只记忆公式形式/,
];

interface Issue {
  routePath: string;
  componentFile: string;
  kind: 'P0 semantic' | 'template phrase' | 'semantic template';
  detail: string;
}

const issues: Issue[] = [];

const teachingReadyRoutes = getAllSections().filter((s) => s.status === 'teaching-ready');

for (const sec of teachingReadyRoutes) {
  const componentName = routeComponentMap[sec.path] ?? '';
  const importSource = importMap[componentName] ?? '';
  const componentFile = resolveComponentFile(importSource);
  if (!componentFile || !fs.existsSync(componentFile)) {
    issues.push({ routePath: sec.path, componentFile, kind: 'P0 semantic', detail: 'No generated component file found' });
    continue;
  }

  const text = fs.readFileSync(componentFile, 'utf8');

  for (const re of P0_SEMANTIC_REGEXES) {
    if (re.test(text)) {
      issues.push({ routePath: sec.path, componentFile, kind: 'P0 semantic', detail: re.source });
    }
  }

  for (const re of TEMPLATE_REGEXES) {
    if (re.test(text)) {
      issues.push({ routePath: sec.path, componentFile, kind: 'template phrase', detail: re.source });
    }
  }

  for (const re of SEMANTIC_TEMPLATE_REGEXES) {
    if (re.test(text)) {
      issues.push({ routePath: sec.path, componentFile, kind: 'semantic template', detail: re.source });
    }
  }
}

// SHA consistency check
let shaMismatch = false;
try {
  const headSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  const manifest = JSON.parse(fs.readFileSync('reports/validation_manifest.json', 'utf8')) as {
    sourceCommitSha?: string;
  };
  if (manifest.sourceCommitSha && manifest.sourceCommitSha !== headSha) {
    shaMismatch = true;
    console.warn(`⚠️ validation_manifest.json SHA (${manifest.sourceCommitSha}) does not match HEAD (${headSha}).`);
  }
} catch {
  // ignore if git or manifest unavailable
}

console.log(`Teaching-ready routes: ${teachingReadyRoutes.length}`);
for (const sec of teachingReadyRoutes) {
  console.log(`  - ${sec.path}: ${sec.title}`);
}

if (issues.length === 0 && !shaMismatch) {
  console.log('✅ All teaching-ready routes pass the semantic gate.');
  process.exit(0);
}

if (issues.length > 0) {
  console.error(`\n❌ ${issues.length} issue(s) found on teaching-ready routes:\n`);
  for (const issue of issues) {
    console.error(`[${issue.kind}] ${issue.routePath}`);
    console.error(`  file: ${issue.componentFile}`);
    console.error(`  detail: ${issue.detail}\n`);
  }
}

if (shaMismatch) {
  console.error('❌ validation_manifest SHA mismatch. Re-run the full validation pipeline before marking routes teaching-ready.');
}

process.exit(1);
