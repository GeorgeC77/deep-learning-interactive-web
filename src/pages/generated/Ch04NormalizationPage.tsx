import { useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, RefreshCw, Scale, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

function generateMatrix(seed: number): number[][] {
  const rows = 4;
  const cols = 3;
  const data: number[][] = [];
  let s = seed;
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      s = (s * 9301 + 49297) % 233280;
      const rnd = s / 233280;
      row.push(rnd * 6 - 2);
    }
    data.push(row);
  }
  return data;
}

function normalizeBatch(data: number[][]) {
  const rows = data.length;
  const cols = data[0].length;
  const eps = 1e-6;
  const out: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let c = 0; c < cols; c++) {
    let sum = 0;
    for (let r = 0; r < rows; r++) sum += data[r][c];
    const mean = sum / rows;
    let varSum = 0;
    for (let r = 0; r < rows; r++) varSum += (data[r][c] - mean) ** 2;
    const std = Math.sqrt(varSum / rows + eps);
    for (let r = 0; r < rows; r++) out[r][c] = (data[r][c] - mean) / std;
  }
  return out;
}

function normalizeLayer(data: number[][]) {
  const rows = data.length;
  const cols = data[0].length;
  const eps = 1e-6;
  const out: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let r = 0; r < rows; r++) {
    let sum = 0;
    for (let c = 0; c < cols; c++) sum += data[r][c];
    const mean = sum / cols;
    let varSum = 0;
    for (let c = 0; c < cols; c++) varSum += (data[r][c] - mean) ** 2;
    const std = Math.sqrt(varSum / cols + eps);
    for (let c = 0; c < cols; c++) out[r][c] = (data[r][c] - mean) / std;
  }
  return out;
}

function barChart(data: number[][], title: string, yMin: number, yMax: number) {
  const W = 320;
  const H = 160;
  const margin = { top: 24, right: 10, bottom: 30, left: 40 };
  const innerW = W - margin.left - margin.right;
  const innerH = H - margin.top - margin.bottom;
  const rows = data.length;
  const cols = data[0].length;
  const groupW = innerW / rows;
  const barW = groupW / (cols + 1);
  const colors = ['#2563eb', '#10b981', '#f59e0b'];

  const yScale = (v: number) => margin.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
  const zeroY = yScale(0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <h4 className="text-sm font-semibold text-gray-700 text-center mb-2">{title}</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <rect x={margin.left} y={margin.top} width={innerW} height={innerH} fill="#f8fafc" />
        <line x1={margin.left} y1={zeroY} x2={margin.left + innerW} y2={zeroY} stroke="#9ca3af" strokeWidth={1} />
        {data.map((row, r) =>
          row.map((v, c) => {
            const x = margin.left + r * groupW + (c + 0.5) * barW;
            const y = v >= 0 ? yScale(v) : zeroY;
            const h = Math.abs(yScale(v) - zeroY);
            return <rect key={`${r}-${c}`} x={x} y={y} width={barW * 0.8} height={h} fill={colors[c]} opacity={0.85} rx={2} />;
          })
        )}
        <text x={margin.left + innerW / 2} y={H - 4} textAnchor="middle" fontSize={9} fill="#6b7280">样本</text>
        <text x={12} y={H / 2} textAnchor="middle" fontSize={9} fill="#6b7280" transform={`rotate(-90 12 ${H / 2})`}>值</text>
      </svg>
      <div className="flex justify-center gap-4 text-xs mt-1">
        {['特征 1', '特征 2', '特征 3'].map((label, i) => (
          <span key={label} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors[i] }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Ch04NormalizationPage() {
  const sectionPath = '/ch04/normalization';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [scale, setScale] = useState(1);
  const [shift, setShift] = useState(0);
  const [seed, setSeed] = useState(1);

  const baseData = useMemo(() => generateMatrix(seed), [seed]);
  const data = useMemo(
    () => baseData.map((row) => row.map((v) => v * scale + shift)),
    [baseData, scale, shift]
  );
  const batchNorm = useMemo(() => normalizeBatch(data), [data]);
  const layerNorm = useMemo(() => normalizeLayer(data), [data]);

  const dataMin = Math.min(-1, ...data.flat());
  const dataMax = Math.max(6, ...data.flat());

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Scale className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          归一化稳定输入分布与内部激活，使网络可以使用更大学习率、更快收敛，并降低对初始化的敏感度。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="数据归一化"
            description="将输入特征缩放为零均值、单位方差，使各维度对损失的贡献均衡，加速优化。"
          />
          <ConceptCard
            title="内部协变量漂移"
            description="深层网络中前面层参数变化会改变后续层输入分布，归一化可缓解此问题。"
          />
          <ConceptCard
            title="批归一化"
            description="对每个 mini-batch 的激活做归一化，并通过可学习的缩放平移恢复表达能力。"
          />
          <ConceptCard
            title="层归一化"
            description="沿特征维度归一化，不依赖 batch 大小，广泛用于 RNN 与 Transformer。"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">关键公式</h2>
        </div>
        <FormulaCard
          title="数据标准化"
          formula={String.raw`\hat{x} = \frac{x - \mu}{\sigma}`}
          description="μ 与 σ 通常为训练集上的均值与标准差。"
        />
        <FormulaCard
          title="批归一化"
          formula={String.raw`\hat{x}_{nj} = \frac{x_{nj} - \mu_j}{\sqrt{\sigma_j^2 + \epsilon}} \, , \quad y_{nj} = \gamma_j \hat{x}_{nj} + \beta_j`}
          description="沿 batch 维度对每个特征 j 归一化，再通过 γ、β 进行缩放和平移。"
        />
        <FormulaCard
          title="层归一化"
          formula={String.raw`\hat{x}_{ni} = \frac{x_{ni} - \mu_n}{\sqrt{\sigma_n^2 + \epsilon}} \, , \quad y_{ni} = \gamma_i \hat{x}_{ni} + \beta_i`}
          description="沿特征维度对每个样本 n 归一化，同样保留可学习的缩放平移。"
        />
      </section>

      <InteractiveDemo title="批归一化与层归一化可视化">
        <div className="space-y-6">
          <p className="text-sm text-gray-700">
            调节原始数据的缩放与平移，观察批归一化（按特征归一化）和层归一化（按样本归一化）如何将数值重新拉回到可比范围。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  缩放
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{scale.toFixed(2)}</span>
              </div>
              <Slider value={[scale]} min={0.5} max={3} step={0.1} onValueChange={(v) => setScale(v[0])} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  平移
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{shift.toFixed(1)}</span>
              </div>
              <Slider value={[shift]} min={-2} max={4} step={0.2} onValueChange={(v) => setShift(v[0])} />
            </div>
          </div>
          <div className="flex justify-start">
            <Button variant="outline" onClick={() => setSeed((s) => s + 1)} className="gap-2">
              <RefreshCw className="w-4 h-4" /> 重新生成数据
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {barChart(data, '原始数据', dataMin, dataMax)}
            {barChart(batchNorm, '批归一化', -2.5, 2.5)}
            {barChart(layerNorm, '层归一化', -2.5, 2.5)}
          </div>
        </div>
      </InteractiveDemo>

      <nav className="flex flex-wrap justify-between gap-4">
        {prevSection ? (
          <Link
            to={prevSection.path}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {prevSection.title}
          </Link>
        ) : (
          <div />
        )}
        {nextSection && (
          <Link
            to={nextSection.path}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {nextSection.title}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </nav>
    </div>
  );
}
