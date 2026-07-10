const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APP_TSX = path.join(ROOT, 'src', 'App.tsx');

function extractImports(source) {
  const imports = [];
  const regex = /import\s+(\w+)\s+from\s+'([^']+)';/g;
  let m;
  while ((m = regex.exec(source)) !== null) {
    imports.push({ componentName: m[1], importPath: m[2] });
  }
  return imports;
}

function extractRoutes(source) {
  const map = {};
  const regex = /'([^']+)':\s*(\w+),/g;
  let m;
  while ((m = regex.exec(source)) !== null) {
    map[m[2]] = m[1]; // componentName -> path
  }
  return map;
}

function inferBishop(pathStr) {
  const parts = pathStr.replace(/^\//, '').split('/');
  if (parts[0] === 'appendix') return { chapter: `Appendix ${parts[1].toUpperCase()}`, section: '' };
  if (parts[0] === 'prerequisite') {
    return { chapter: `Ch ${Number(parts[1].replace('ch', ''))}`, section: parts[2] };
  }
  const manifestNum = Number(parts[0].replace('ch', ''));
  const bishopMap = {
    1: 'Ch 4', 2: 'Ch 5', 3: 'Ch 6', 4: 'Ch 7', 5: 'Ch 8',
    6: 'Ch 9', 7: 'Ch 10', 8: 'Ch 11', 9: 'Ch 12', 10: 'Ch 13',
    11: 'Ch 14', 12: 'Ch 15', 13: 'Ch 16', 14: 'Ch 17', 15: 'Ch 18',
    16: 'Ch 19', 17: 'Ch 20',
  };
  const sectionMatch = parts[1]?.match(/^\d+\.\d+$/);
  return {
    chapter: bishopMap[manifestNum] || `Ch ${manifestNum}`,
    section: sectionMatch ? parts[1] : '',
  };
}

function inferTitle(sectionPath) {
  const last = sectionPath.split('/').pop();
  return last.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

function generateMetadata(sectionPath, title) {
  const { chapter, section } = inferBishop(sectionPath);
  return {
    bishopChapter: chapter,
    bishopSection: section,
    learningObjectives: [
      `理解 ${title} 的核心概念与直观含义。`,
      `掌握与本小节相关的关键公式与算法流程。`,
      `能够在简单示例中应用所学方法并识别常见误区。`,
    ],
    commonMistakes: [
      '只记忆公式而忽略其背后的概率或优化假设。',
      '混淆相近概念的定义与适用场景。',
      '在应用时忽视数据分布与模型假设的匹配。',
    ],
    quiz: [
      {
        question: `关于“${title}”，下列说法最准确的是？`,
        options: [
          `它是本小节需要掌握的核心主题。`,
          '它与当前章节完全无关。',
          '它只适用于无限大数据集。',
          '它不需要任何数学基础。',
        ],
        correctIndex: 0,
        explanation: `${title} 是本小节的核心内容，理解其动机、公式与应用场景是学习目标。`,
      },
      {
        question: '学习本小节时，最重要的提醒是什么？',
        options: [
          '只看结论，忽略推导。',
          '理解概念背后的直觉与假设。',
          '直接套用代码，不必关心理论。',
          '只记忆英文术语。',
        ],
        correctIndex: 1,
        explanation: '理解直觉和假设有助于在遇到新问题时正确选择与扩展方法。',
      },
    ],
  };
}

function makeUsage(metadata) {
  const quizStr = metadata.quiz.map((q) => `      {\n        question: ${JSON.stringify(q.question)},\n        options: [${q.options.map((o) => JSON.stringify(o)).join(', ')}],\n        correctIndex: ${q.correctIndex},\n        explanation: ${JSON.stringify(q.explanation)},\n      }`).join(',\n');

  return `\n      <SectionMetadata\n        bishopChapter={${JSON.stringify(metadata.bishopChapter)}}\n        ${metadata.bishopSection ? `bishopSection={${JSON.stringify(metadata.bishopSection)}}\n        ` : ''}learningObjectives={[${metadata.learningObjectives.map((o) => JSON.stringify(o)).join(', ')}]}\n        commonMistakes={[${metadata.commonMistakes.map((m) => JSON.stringify(m)).join(', ')}]}\n        quiz={[\n${quizStr}\n        ]}\n      />\n`;
}

function wrapReturn(source, usage) {
  // Find the outer return statement and wrap its JSX in a fragment, then append usage
  const returnMatch = source.match(/return\s*\(\s*([\s\S]*)\);\s*\}\s*$/);
  if (!returnMatch) {
    // Try without trailing semicolon before closing brace
    const returnMatch2 = source.match(/return\s*\(\s*([\s\S]*)\)\s*\}\s*$/);
    if (!returnMatch2) return null;
  }
  const inner = returnMatch ? returnMatch[1] : returnMatch2[1];
  const wrapped = `return (\n    <>\n${inner.trimEnd()}\n${usage}    </>\n  );`;
  return source.replace(/return\s*\(\s*[\s\S]*\);?\s*\}\s*$/, wrapped + '\n}');
}

function main() {
  const appSource = fs.readFileSync(APP_TSX, 'utf8');
  const imports = extractImports(appSource);
  const routes = extractRoutes(appSource);

  let modified = 0;
  for (const { componentName, importPath } of imports) {
    const sectionPath = routes[componentName];
    if (!sectionPath) continue;
    // Only process non-generated manual pages that need metadata
    if (importPath.includes('/generated/')) continue;
    if (componentName === 'HomePage' || componentName === 'Layout' || componentName === 'DynamicPlaceholderPage') continue;

    const filePath = path.join(ROOT, 'src', importPath) + '.tsx';
    if (!fs.existsSync(filePath)) {
      console.log(`  skip (not found): ${filePath}`);
      continue;
    }

    let source = fs.readFileSync(filePath, 'utf8');
    if (source.includes('SectionMetadata')) {
      console.log(`  skip (already has metadata): ${path.relative(ROOT, filePath)}`);
      continue;
    }

    const title = inferTitle(sectionPath);
    const metadata = generateMetadata(sectionPath, title);
    const usage = makeUsage(metadata);
    const newSource = wrapReturn(source, usage);
    if (!newSource) {
      console.log(`  skip (could not wrap return): ${path.relative(ROOT, filePath)}`);
      continue;
    }

    // Add import for SectionMetadata if not present
    let finalSource = newSource;
    if (!finalSource.includes('import SectionMetadata')) {
      finalSource = `import SectionMetadata from '@/components/SectionMetadata';\n${finalSource}`;
    }

    fs.writeFileSync(filePath, finalSource, 'utf8');
    modified++;
    console.log(`  updated: ${path.relative(ROOT, filePath)}`);
  }

  console.log(`Modified ${modified} files.`);
}

main();
