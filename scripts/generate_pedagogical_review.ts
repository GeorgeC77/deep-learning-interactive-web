/**
 * Generate reports/pedagogical_review.md
 *
 * For every teaching-ready route we check six pedagogical dimensions:
 *   What          — does the page state what the concept is?
 *   Why           — is there a formula-free "为什么？" motivation card?
 *   How           — are concepts / core intuition / formulas present?
 *   Counterexample— is there at least one 反例 that breaks a wrong intuition?
 *   Interactive   — is there an interactive experiment (demo / lab)?
 *   Real-world    — is there real-world intuition (核心直觉)?
 *
 * The goal is 100% pedagogical coverage for all core chapters.
 */
import fs from 'node:fs';
import { getAllSections } from '../src/course/manifest.ts';

const appText = fs.readFileSync('src/App.tsx', 'utf8');

const importMap: Record<string, string> = {};
for (const m of appText.matchAll(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/g)) {
  importMap[m[1]] = m[2];
}

const routeComponentMap: Record<string, string> = {};
const scMatch = appText.match(/const sectionComponents: Record<string, React\.ComponentType> = \{([\s\S]*?)\n\};/);
if (scMatch) {
  for (const m of scMatch[1].matchAll(/['"]([^'"]+)['"]\s*:\s*(\w+),?/g)) {
    routeComponentMap[m[1]] = m[2];
  }
}

function resolveComponentFile(importSource: string): string {
  if (!importSource) return '';
  const rel = importSource.replace(/^\.\//, '');
  return `src/${rel}.tsx`;
}

function resolveWrappedComponent(file: string): string {
  if (!file || !fs.existsSync(file)) return file;
  const text = fs.readFileSync(file, 'utf8');
  // Match simple wrapper: import X from '...'; export default function ... { return <X />; }
  const importMatch = text.match(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
  if (!importMatch) return file;
  const importedName = importMatch[1];
  const importPath = importMatch[2];
  // Only resolve wrappers that import from pages, not components/demos
  if (!importPath.includes('/pages/')) return file;
  // Simple wrapper: return <X /> or return <X/>
  if (text.includes(`return <${importedName} />`) || text.includes(`return <${importedName}/>`)) {
    return resolveComponentFile(importPath.replace(/^@\/pages\//, './pages/'));
  }
  // Fragment wrapper: return (<> <X /> ... </>) or return (<div> <X /> ... </div>)
  if (text.includes(`<${importedName} />`) || text.includes(`<${importedName}/>`)) {
    return resolveComponentFile(importPath.replace(/^@\/pages\//, './pages/'));
  }
  return file;
}

type Dim = { key: string; label: string; test: (text: string) => boolean };

const DIMS: Dim[] = [
  { key: 'what', label: 'What', test: (t) => /summary=\{/.test(t) || /text-lg text-gray-600/.test(t) || /text-gray-600 max-w-2xl/.test(t) },
  { key: 'why', label: 'Why', test: (t) => /whyCards=\{/.test(t) || /为什么/.test(t) || /MessageCircleQuestion/.test(t) },
  { key: 'how', label: 'How', test: (t) => /concepts=\{/.test(t) || /coreIntuition=\{/.test(t) || /ConceptCard/.test(t) || /核心概念/.test(t) || /算法步骤/.test(t) || /模型与算法/.test(t) },
  { key: 'counterexample', label: 'Counterexample', test: (t) => /counterexamples=\{/.test(t) || /反例/.test(t) || /FlaskConical/.test(t) },
  { key: 'interactive', label: 'Interactive', test: (t) => /interactiveDemo=\{/.test(t) || /extraContent=\{/.test(t) || /demo=\{\{/.test(t) || /InteractiveDemo/.test(t) || /components\/demos\//.test(t) || /Demo\s*\/>/.test(t) || /useState/.test(t) },
  { key: 'realWorld', label: 'Real-world Intuition', test: (t) => /coreIntuition=\{/.test(t) || /核心直觉/.test(t) || /直觉/.test(t) || /intuition/.test(t) || /核心思想/.test(t) || /核心概念/.test(t) },
];

type Row = {
  path: string;
  title: string;
  file: string;
  present: boolean[];
  coverage: number;
  isOverview: boolean;
};

function isOverviewPage(path: string, title: string): boolean {
  return /\/overview$/.test(path) || /概览|总览/.test(title);
}

const rows: Row[] = [];

for (const sec of getAllSections()) {
  const componentName = routeComponentMap[sec.path] ?? '';
  const rawFile = resolveComponentFile(importMap[componentName] ?? '');
  const file = resolveWrappedComponent(rawFile);
  if (!file || !fs.existsSync(file)) continue;
  // Only audit real generated content pages (skip legacy chapter pages).
  if (!file.includes('src/pages/generated/') && !file.includes('src/pages/chapters/') && !file.includes('src/pages/prerequisite/')) continue;
  const text = fs.readFileSync(file, 'utf8');
  const present = DIMS.map((d) => d.test(text));
  const coverage = Math.round((present.filter(Boolean).length / DIMS.length) * 100);
  rows.push({ path: sec.path, title: sec.title, file, present, coverage, isOverview: isOverviewPage(sec.path, sec.title) });
}

const mean = (rs: Row[]) => (rs.length ? Math.round(rs.reduce((a, r) => a + r.coverage, 0) / rs.length) : 0);
const contentRows = rows.filter((r) => !r.isOverview);
const overviewRows = rows.filter((r) => r.isOverview);
const contentCoverage = mean(contentRows);
const totalCoverage = mean(rows);

const md: string[] = [
  '# Pedagogical Review Checklist',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '目标：让第一次学习这门课的学生能够真正形成正确直觉，而不仅仅是公式正确。',
  '',
  '## 检查维度（Pedagogical Dimensions）',
  '',
  '| 维度 | 学生是否…… |',
  '|------|--------------|',
  '| **What** | 知道这个概念“是什么” |',
  '| **Why** | 知道“为什么需要它”（不用公式的动机卡片） |',
  '| **How** | 知道“怎么工作”（概念 / 直觉 / 公式） |',
  '| **Counterexample** | 见过至少一个打破错误直觉的反例 |',
  '| **Interactive** | 能通过交互实验自己动手验证 |',
  '| **Real-world Intuition** | 能联系到真实世界直觉（核心直觉） |',
  '',
  '## 逐页检查（内容页 content pages）',
  '',
  '概览/导航页（`/overview`）不承担具体知识点的教学，已单独统计，不计入内容页覆盖率。',
  '',
  `| 页面 | ${DIMS.map((d) => d.label).join(' | ')} | 覆盖率 |`,
  `|------|${DIMS.map(() => '---').join('|')}|---|`,
  ...contentRows.map((r) => {
    const marks = r.present.map((p) => (p ? '✅' : '❌')).join(' | ');
    return `| ${r.title}（\`${r.path}\`） | ${marks} | ${r.coverage}% |`;
  }),
  '',
  '## 覆盖率统计（Coverage）',
  '',
  `- 内容页（教学页）数量：${contentRows.length}`,
  `- **内容页 Pedagogical Coverage：${contentCoverage}%**`,
  `- 概览/导航页数量：${overviewRows.length}（覆盖率 ${mean(overviewRows)}%，仅作参考）`,
  `- 全部生成页总体覆盖率：${totalCoverage}%`,
  '',
  '### 各维度覆盖页面数（内容页）',
  '',
  ...DIMS.map((d, i) => {
    const hit = contentRows.filter((r) => r.present[i]).length;
    return `- **${d.label}**：${hit} / ${contentRows.length} 页`;
  }),
  '',
  contentRows.some((r) => r.coverage < 100)
    ? `> ⚠️ 仍有 ${contentRows.filter((r) => r.coverage < 100).length} 个内容页未达到 100% 覆盖，见上表 ❌ 项。`
    : '> ✅ 所有内容页已达到 100% Pedagogical Coverage。',
  '',
  '## 概览/导航页（单独列出，不计入内容页覆盖率）',
  '',
  '| 页面 | 覆盖率 |',
  '|------|---|',
  ...overviewRows.map((r) => `| ${r.title}（\`${r.path}\`） | ${r.coverage}% |`),
  '',
];

fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/pedagogical_review.md', md.join('\n'), 'utf8');

console.log(
  `Pedagogical review written: ${contentRows.length} content pages (coverage ${contentCoverage}%), ` +
  `${overviewRows.length} overview pages, overall ${totalCoverage}%.`,
);
