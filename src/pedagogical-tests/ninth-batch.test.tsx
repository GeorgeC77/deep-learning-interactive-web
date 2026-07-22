import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { multiHeadAttention, matMul } from '@/lib/math/attention';
import { computeSamePadding } from '@/lib/math/conv';
import Ch09AttentionPage from '@/pages/generated/Ch09AttentionPage';
import Ch07ImageSegmentationPage from '@/pages/generated/Ch07ImageSegmentationPage';
import Ch07ConvolutionalFiltersPage from '@/pages/generated/Ch07ConvolutionalFiltersPage';
import Ch07VisualizingTrainedCnnsPage from '@/pages/generated/Ch07VisualizingTrainedCnnsPage';
import Ch13ProbabilisticLatentVariablesPage from '@/pages/generated/Ch13ProbabilisticLatentVariablesPage';
import Ch13OverviewPage from '@/pages/generated/Ch13OverviewPage';
import { getAllSections } from '@/course/manifest';
import fs from 'node:fs';

function makeW(rows: number, cols: number, seed: number): number[][] {
  const rng = mulberry32(seed);
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rng() - 0.5) * 0.4));
}

function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function routeComponentMap(): Record<string, string> {
  const appText = fs.readFileSync('src/App.tsx', 'utf8');
  const importMap: Record<string, string> = {};
  for (const m of appText.matchAll(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/g)) {
    importMap[m[1]] = m[2];
  }
  const scMatch = appText.match(/const sectionComponents: Record<string, React\.ComponentType> = \{([\s\S]*?)\n\};/);
  const map: Record<string, string> = {};
  if (scMatch) {
    for (const m of scMatch[1].matchAll(/['"]([^'"]+)['"]\s*:\s*(\w+),?/g)) {
      map[m[1]] = m[2];
    }
  }
  const result: Record<string, string> = {};
  for (const [path, componentName] of Object.entries(map)) {
    const src = importMap[componentName] ?? '';
    result[path] = `src/${src.replace(/^\.\//, '')}.tsx`;
  }
  return result;
}

const P0_SEMANTIC_REGEXES: RegExp[] = [
  /降维就是找映射，生成就是逆映射/,
  /定位对分类决策最重要的区域/,
  /置换等变与任意尺寸/,
  /由于只含卷积操作/,
  /若不整除才出现下采样/,
  /伪多头/,
];

describe('pedagogical invariants: ninth batch (attention / CNN / latent variables)', () => {
  afterEach(cleanup);
  it('multi-head attention has one distinct attention matrix per head', () => {
    const dModel = 4, dK = 2, N = 3;
    const X = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, (_, j) => (i + 1) * (j + 1)));
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);
    const result = multiHeadAttention(X, wq, wk, wv, wo, false);
    expect(result.headOutputs).toHaveLength(2);
    expect(result.headOutputs[0].attention).not.toEqual(result.headOutputs[1].attention);
  });

  it('multi-head final output includes W_O multiplication', () => {
    const dModel = 6, dK = 3, N = 3;
    const X = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, () => (i + 1)));
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);
    const result = multiHeadAttention(X, wq, wk, wv, wo, false);
    const expected = matMul(result.concat, wo);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < dModel; j++) {
        expect(result.finalOutput[i][j]).toBeCloseTo(expected[i][j], 8);
      }
    }
  });

  it('full 4D single-head attention is scaled by sqrt(4), not sqrt(2)', () => {
    const X = [[1, 0, 0, 0], [0, 1, 0, 0]];
    const wq = [[[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]];
    const wk = [[[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]];
    const wv = [[[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]];
    const wo = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    const result = multiHeadAttention(X, wq, wk, wv, wo, false);
    expect(result.headOutputs[0].scores[0][0]).toBeCloseTo(0.5, 8);
  });

  it('formula and code agree on W transpose: Q = X W_Q (column convention)', () => {
    const dModel = 4, dK = 2, N = 3;
    const X = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, (_, j) => (i + 1) * (j + 1)));
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);
    const result = multiHeadAttention(X, wq, wk, wv, wo, false);
    const expectedQ0 = matMul(X, wq[0]);
    expect(result.headOutputs[0].Q).toEqual(expectedQ0);
  });

  it('Ch09 advanced mode displays per-head Q/K/S/A/V/O and final W_O/Y', () => {
    render(
      <MemoryRouter>
        <Ch09AttentionPage />
      </MemoryRouter>,
    );
    const advancedSwitch = screen.getByRole('switch');
    fireEvent.click(advancedSwitch);

    expect(screen.getAllByText(/Head 1/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Head 2/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Concat/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Y = Concat · W_O/).length).toBeGreaterThan(0);
  });

  it('segmentation page does not claim arbitrary permutation equivariance', () => {
    render(
      <MemoryRouter>
        <Ch07ImageSegmentationPage />
      </MemoryRouter>,
    );
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/置换等变与可变空间尺寸/);
    expect(text).toMatch(/平移等变/);
    expect(text).toMatch(/任意像素置换不是/);
  });

  it('random pixel permutation produces non-zero equivariance error in the lab', () => {
    render(
      <MemoryRouter>
        <Ch07ImageSegmentationPage />
      </MemoryRouter>,
    );
    const permuteButton = screen.getByRole('button', { name: /随机像素置换/ });
    fireEvent.click(permuteButton);
    const errorText = screen.getByText(/等变误差/);
    expect(errorText).toBeTruthy();
    // The metric label's adjacent span holds the numeric value.
    const container = errorText.parentElement ?? errorText;
    const numeric = container.textContent?.match(/[\d.]+/);
    expect(numeric).toBeTruthy();
    expect(Number(numeric![0])).toBeGreaterThan(1e-6);
  });

  it('framework SAME with stride S returns ceil(I/S)', () => {
    const cases = [
      { I: 7, K: 3, S: 2 },
      { I: 8, K: 4, S: 3 },
      { I: 10, K: 5, S: 4 },
    ];
    for (const { I, K, S } of cases) {
      const { outputSize } = computeSamePadding(I, K, S);
      expect(outputSize).toBe(Math.ceil(I / S));
    }
  });

  it('even kernel can produce asymmetric framework SAME padding', () => {
    const result = computeSamePadding(7, 4, 1);
    expect(result.left).not.toBe(result.right);
  });

  it('discrete latent variables page includes mixture-component assignments', () => {
    render(
      <MemoryRouter>
        <Ch13ProbabilisticLatentVariablesPage />
      </MemoryRouter>,
    );
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/前者通常连续，后者离散/);
    expect(text).toMatch(/离散隐变量/);
    expect(text).toMatch(/高斯混合模型/);
    expect(text).toMatch(/混合模型聚类/);
  });

  it('Ch13 overview does not describe generation as a universal inverse mapping', () => {
    render(
      <MemoryRouter>
        <Ch13OverviewPage />
      </MemoryRouter>,
    );
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/降维就是找映射，生成就是逆映射/);
    expect(text).toMatch(/推断/);
    expect(text).toMatch(/生成/);
    expect(text).toMatch(/编码器与解码器不必互为逆映射/);
  });

  it('visualizing CNNs page describes saliency as local sensitivity', () => {
    render(
      <MemoryRouter>
        <Ch07VisualizingTrainedCnnsPage />
      </MemoryRouter>,
    );
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/定位对分类决策最重要的区域/);
    expect(text).toMatch(/局部敏感度/);
    expect(text).toMatch(/S_i = \|∂y_c\/∂x_i\|/);
  });

  it('visualizing CNNs page has no placeholder English concept cards', () => {
    render(
      <MemoryRouter>
        <Ch07VisualizingTrainedCnnsPage />
      </MemoryRouter>,
    );
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/介绍.*的定义、关键公式与典型应用场景/);
  });

  it('convolutional filters page has no placeholder English concept cards', () => {
    render(
      <MemoryRouter>
        <Ch07ConvolutionalFiltersPage />
      </MemoryRouter>,
    );
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/介绍.*的定义、关键公式与典型应用场景/);
  });

  it('teaching-ready routes cannot contain P0 semantic warnings', () => {
    const componentFiles = routeComponentMap();
    const teachingReady = getAllSections().filter((s) => s.status === 'teaching-ready');
    const offenders: string[] = [];
    for (const sec of teachingReady) {
      const file = componentFiles[sec.path];
      if (!file || !fs.existsSync(file)) continue;
      const text = fs.readFileSync(file, 'utf8');
      for (const re of P0_SEMANTIC_REGEXES) {
        if (re.test(text)) offenders.push(`${sec.path}: ${re.source}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
