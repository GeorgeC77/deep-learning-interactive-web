import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Network, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, RefreshCw } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch13/nonlinear-latent-variable-models';

const APPROACHES = [
  {
    key: 'autoregressive',
    name: '自回归模型',
    density: '可计算',
    sampling: '顺序，较慢',
    training: '最大似然，稳定',
    note: '把联合分布分解为条件链，适合离散数据如文本。',
  },
  {
    key: 'flow',
    name: '流模型',
    density: '精确可计算',
    sampling: '一次性前向传播',
    training: '最大似然',
    note: '通过可逆神经网络把简单分布变换到数据分布。',
  },
  {
    key: 'gan',
    name: '生成对抗网络',
    density: '隐式',
    sampling: '一次性前向传播',
    training: '对抗，较难稳定',
    note: '用判别器引导生成器，不直接估计似然。',
  },
  {
    key: 'vae',
    name: '变分自编码器',
    density: '近似下界',
    sampling: '一次性前向传播',
    training: 'ELBO',
    note: '用摊销推断网络近似后验，适合连续隐变量。',
  },
];

const WIDTH = 560;
const HEIGHT = 320;
const MARGIN = { top: 24, right: 24, bottom: 40, left: 48 };

function generateCurveData(seed: number, amplitude: number) {
  let s = seed || 12345;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const n = 80;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const t = -3 + (6 * i) / (n - 1);
    const noise = 0.08 * (rand() - 0.5);
    points.push({ x: t, y: amplitude * Math.sin(t) + noise });
  }
  return points;
}

function scale(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function computePcaProjection(points: { x: number; y: number }[]) {
  const n = points.length;
  const meanX = points.reduce((a, p) => a + p.x, 0) / n;
  const meanY = points.reduce((a, p) => a + p.y, 0) / n;
  const centered = points.map((p) => ({ x: p.x - meanX, y: p.y - meanY }));
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  centered.forEach((p) => {
    sxx += p.x * p.x;
    syy += p.y * p.y;
    sxy += p.x * p.y;
  });
  const trace = sxx + syy;
  const det = sxx * syy - sxy * sxy;
  const lambda1 = (trace + Math.sqrt(trace * trace - 4 * det)) / 2;
  let vx = 1;
  let vy = 0;
  if (Math.abs(sxy) > 1e-9) {
    vy = (lambda1 - sxx) / sxy;
    const norm = Math.sqrt(1 + vy * vy);
    vx = 1 / norm;
    vy = vy / norm;
  } else if (syy > sxx) {
    vx = 0;
    vy = 1;
  }
  const projections = centered.map((p) => {
    const dot = p.x * vx + p.y * vy;
    return { x: meanX + dot * vx, y: meanY + dot * vy };
  });
  const reconstructionError = centered.reduce((acc, p, i) => {
    const dx = p.x - (projections[i].x - meanX);
    const dy = p.y - (projections[i].y - meanY);
    return acc + dx * dx + dy * dy;
  }, 0) / n;
  return { meanX, meanY, vx, vy, projections, reconstructionError };
}

export default function Ch13NonlinearLatentVariableModelsPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [amplitude, setAmplitude] = useState(1.2);
  const [seed, setSeed] = useState(1);
  const [selectedApproach, setSelectedApproach] = useState(APPROACHES[0].key);

  const points = useMemo(() => generateCurveData(seed, amplitude), [seed, amplitude]);
  const pca = useMemo(() => computePcaProjection(points), [points]);

  const xMin = -3.2;
  const xMax = 3.2;
  const yMin = -2.4;
  const yMax = 2.4;

  const lineStart = { x: pca.meanX - 3.5 * pca.vx, y: pca.meanY - 3.5 * pca.vy };
  const lineEnd = { x: pca.meanX + 3.5 * pca.vx, y: pca.meanY + 3.5 * pca.vy };

  const approach = APPROACHES.find((a) => a.key === selectedApproach) ?? APPROACHES[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Network className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {section?.title ?? '16.4 非线性隐变量模型'}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          真实数据往往集中在低维但弯曲的流形上。非线性隐变量模型用神经网络参数化解码器，
          从而捕捉复杂结构；但精确似然通常难以计算，催生了对四种主要生成建模方法的研究。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* Concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="非线性流形"
            description="数据分布常位于嵌入高维观测空间的低维弯曲流形上。线性方法如 PCA 只能发现全局线性子空间，难以刻画弯曲结构。"
          />
          <ConceptCard
            title="难解的边际似然"
            description={
              <>
                非线性解码器 <KaTeX math={String.raw`\boldsymbol{x}=f(\boldsymbol{z};\boldsymbol{\theta})+\boldsymbol{\epsilon}`} /> 使得
                后验 <KaTeX math={String.raw`p(\boldsymbol{z}\mid\boldsymbol{x})`} /> 不再具有高斯形式，边际似然积分通常没有解析解。
              </>
            }
          />
          <ConceptCard
            title="离散数据"
            description="当观测为离散值（如二值图像）时，常用 Bernoulli 或分类分布作为解码器，并通过交叉熵衡量重建质量。"
          />
          <ConceptCard
            title="四类生成方法"
            description="自回归模型、流模型、生成对抗网络（GAN）与变分自编码器（VAE）从不同角度绕过精确似然计算的困难。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">关键公式</h2>
        <div className="space-y-4">
          <FormulaCard
            title="非线性隐变量模型"
            formula={String.raw`
              \boldsymbol{x} = f(\boldsymbol{z}; \boldsymbol{\theta}) + \boldsymbol{\epsilon},
              \quad \boldsymbol{z} \sim p(\boldsymbol{z}),
              \quad \boldsymbol{\epsilon} \sim \mathcal{N}(\boldsymbol{0}, \sigma^2\boldsymbol{I})
            `}
            description="f 是神经网络参数化的非线性映射，把低维隐变量 z 变换到观测空间。"
          />
          <FormulaCard
            title="边际似然"
            formula={String.raw`
              p(\boldsymbol{x}) = \int p(\boldsymbol{x}\mid\boldsymbol{z};\boldsymbol{\theta})\,p(\boldsymbol{z})\,\mathrm{d}\boldsymbol{z}
            `}
            description="对非线性 f，该积分通常无法解析求出，直接最大化似然不可行。"
          />
          <FormulaCard
            title="离散观测的解码器"
            formula={String.raw`
              p(\boldsymbol{x}\mid\boldsymbol{z}) = \prod_{d=1}^{D} \mathrm{Bernoulli}\bigl(x_d\mid f_d(\boldsymbol{z};\boldsymbol{\theta})\bigr)
            `}
            description="对二值数据，解码器输出每个维度的成功概率，损失函数为交叉熵。"
          />
          <FormulaCard
            title="非线性模型的 ELBO"
            formula={String.raw`
              \mathcal{L}(\boldsymbol{\theta},\boldsymbol{\phi})
              = \mathbb{E}_{q_{\boldsymbol{\phi}}(\boldsymbol{z}\mid\boldsymbol{x})}\bigl[\ln p_{\boldsymbol{\theta}}(\boldsymbol{x}\mid\boldsymbol{z})\bigr]
              - D_{\mathrm{KL}}\bigl(q_{\boldsymbol{\phi}}(\boldsymbol{z}\mid\boldsymbol{x})\,\|\,p(\boldsymbol{z})\bigr)
            `}
            description="VAE 用推断网络 qφ 近似后验，通过重参数化技巧优化该下界。"
          />
        </div>
      </section>

      {/* Manifold demo */}
      <InteractiveDemo title="交互演示：非线性流形与线性 PCA 投影">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[65%]">
            <p className="text-sm text-gray-700 mb-3">
              蓝色点沿一维非正弦曲线分布。绿色直线表示 PCA 找到的第一个主成分方向；
              当曲线弯曲程度增加时，线性一维投影的重建误差会显著增大，而非线性隐变量模型仍可用一维隐变量很好地描述数据。
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden">
              <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" style={{ maxHeight: 360 }}>
                {/* Axes */}
                <line
                  x1={MARGIN.left}
                  y1={HEIGHT - MARGIN.bottom}
                  x2={WIDTH - MARGIN.right}
                  y2={HEIGHT - MARGIN.bottom}
                  stroke="#9ca3af"
                />
                <line
                  x1={MARGIN.left}
                  y1={MARGIN.top}
                  x2={MARGIN.left}
                  y2={HEIGHT - MARGIN.bottom}
                  stroke="#9ca3af"
                />
                {/* Zero lines */}
                <line
                  x1={scale(0, xMin, xMax, MARGIN.left, WIDTH - MARGIN.right)}
                  y1={MARGIN.top}
                  x2={scale(0, xMin, xMax, MARGIN.left, WIDTH - MARGIN.right)}
                  y2={HEIGHT - MARGIN.bottom}
                  stroke="#e5e7eb"
                  strokeDasharray="4,3"
                />
                <line
                  x1={MARGIN.left}
                  y1={scale(0, yMin, yMax, HEIGHT - MARGIN.bottom, MARGIN.top)}
                  x2={WIDTH - MARGIN.right}
                  y2={scale(0, yMin, yMax, HEIGHT - MARGIN.bottom, MARGIN.top)}
                  stroke="#e5e7eb"
                  strokeDasharray="4,3"
                />
                {/* PCA projection line */}
                <line
                  x1={scale(lineStart.x, xMin, xMax, MARGIN.left, WIDTH - MARGIN.right)}
                  y1={scale(lineStart.y, yMin, yMax, HEIGHT - MARGIN.bottom, MARGIN.top)}
                  x2={scale(lineEnd.x, xMin, xMax, MARGIN.left, WIDTH - MARGIN.right)}
                  y2={scale(lineEnd.y, yMin, yMax, HEIGHT - MARGIN.bottom, MARGIN.top)}
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="6,4"
                />
                {/* Data points */}
                {points.map((p, i) => (
                  <circle
                    key={`pt-${i}`}
                    cx={scale(p.x, xMin, xMax, MARGIN.left, WIDTH - MARGIN.right)}
                    cy={scale(p.y, yMin, yMax, HEIGHT - MARGIN.bottom, MARGIN.top)}
                    r={3}
                    fill="#3b82f6"
                    opacity={0.8}
                  />
                ))}
                {/* Axis labels */}
                <text
                  x={(WIDTH + MARGIN.left - MARGIN.right) / 2}
                  y={HEIGHT - 10}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#374151"
                >
                  潜在变量 z
                </text>
                <text
                  x={18}
                  y={HEIGHT / 2}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#374151"
                  transform={`rotate(-90, 18, ${HEIGHT / 2})`}
                >
                  观测维度 x₂
                </text>
                {/* Legend */}
                <g transform={`translate(${WIDTH - 150}, ${MARGIN.top})`}>
                  <rect width={130} height={54} rx={6} fill="white" stroke="#e5e7eb" />
                  <circle cx={16} cy={16} r={4} fill="#3b82f6" />
                  <text x={28} y={20} fontSize={10} fill="#374151">数据点</text>
                  <line x1={8} y1={38} x2={24} y2={38} stroke="#10b981" strokeWidth={2} strokeDasharray="4,3" />
                  <text x={28} y={42} fontSize={10} fill="#374151">PCA 主方向</text>
                </g>
              </svg>
            </div>
          </div>
          <div className="w-full lg:w-[35%] space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>曲线振幅（非线性程度）</span>
                <span className="font-mono">{amplitude.toFixed(1)}</span>
              </div>
              <Slider min={0} max={2} step={0.1} value={[amplitude]} onValueChange={([v]) => setAmplitude(v ?? 0)} />
              <p className="text-xs text-gray-500 mt-1">振幅越大，线性 PCA 越难用一维子空间描述数据</p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setSeed((s) => s + 1)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              重新采样
            </Button>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-xs text-gray-600">线性 PCA 一维重建误差</div>
              <div className="text-xl font-bold text-blue-700">{pca.reconstructionError.toFixed(3)}</div>
            </div>
          </div>
        </div>
      </InteractiveDemo>

      {/* Four approaches demo */}
      <InteractiveDemo title="交互演示：四种生成建模方法对比">
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            点击下方的按钮，查看自回归、流、GAN 与 VAE 在密度估计、采样速度与训练方式上的主要差异。
          </p>
          <div className="flex flex-wrap gap-2">
            {APPROACHES.map((a) => (
              <Button
                key={a.key}
                variant={selectedApproach === a.key ? 'default' : 'outline'}
                onClick={() => setSelectedApproach(a.key)}
              >
                {a.name}
              </Button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">密度估计</div>
              <div className="font-semibold text-gray-900">{approach.density}</div>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">采样方式</div>
              <div className="font-semibold text-gray-900">{approach.sampling}</div>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">训练目标</div>
              <div className="font-semibold text-gray-900">{approach.training}</div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700">
            {approach.note}
          </div>
        </div>
      </InteractiveDemo>

      {/* Navigation */}
      <section className="flex flex-wrap justify-between gap-4">
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
      </section>
    </div>
  );
}
