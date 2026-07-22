import SectionMetadata from '@/components/SectionMetadata';
import { useState, useMemo, useCallback, useRef } from 'react';
import type { MouseEvent } from 'react';
import { BarChart3, Waves, Activity, ShieldAlert, BookOpen, RefreshCw } from 'lucide-react';
import KaTeX from '../../../components/KaTeX';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';
import InteractiveDemo from '../../../components/InteractiveDemo';
import InteractivePanel from '../../../components/InteractivePanel';

function gaussian(u: number): number {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u);
}

function generateData(): number[] {
  const data: number[] = [];
  for (let i = 0; i < 20; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const mode = Math.random() < 0.5 ? -1.5 : 1.5;
    data.push(mode + z * 0.8);
  }
  return data.sort((a, b) => a - b);
}

function kde(x: number, data: number[], h: number): number {
  if (data.length === 0) return 0;
  let sum = 0;
  for (const xi of data) sum += gaussian((x - xi) / h);
  return sum / (data.length * h);
}

export default function NonparametricMethodsPage() {
  const [data, setData] = useState<number[]>(() => generateData());
  const [h, setH] = useState(0.6);
  const svgRef = useRef<SVGSVGElement>(null);

  const xMin = -5;
  const xMax = 5;
  const grid = useMemo(() => {
    const arr: { x: number; p: number }[] = [];
    for (let x = xMin; x <= xMax; x += 0.05) arr.push({ x, p: kde(x, data, h) });
    return arr;
  }, [data, h, xMin, xMax]);

  const maxP = Math.max(...grid.map((d) => d.p), 0.05);

  const width = 560;
  const height = 260;
  const pad = { top: 20, right: 20, bottom: 50, left: 55 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const xScale = useCallback((x: number) => pad.left + ((x - xMin) / (xMax - xMin)) * innerW, [pad.left, xMin, xMax, innerW]);
  const yScale = useCallback((p: number) => pad.top + innerH - (p / maxP) * innerH, [pad.top, innerH, maxP]);

  const pathD = grid.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.x)} ${yScale(d.p)}`).join(' ');

  const handleSvgClick = (e: MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left;
    const x = xMin + (px / rect.width) * (xMax - xMin);
    if (x >= xMin && x <= xMax) {
      setData((prev) => [...prev, x].sort((a, b) => a - b));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center">
            <Waves className="w-9 h-9 text-sky-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">3.4 非参数方法</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          非参数方法不假设数据来自某个固定参数族，而是让数据本身决定分布的形状。直方图、核密度估计与 k 近邻是其中的代表。
        </p>
        <p className="mt-6 text-sm text-amber-800 flex items-center justify-center gap-1">
          <ShieldAlert className="w-4 h-4" />
          本页为依据 Bishop & Bishop 教材知识体系制作的原创教学解释与交互演示。教材原文、原图及习题解答版权归原作者和出版方所有。
        </p>
      </section>

      {/* Concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-sky-600" />
          <h2 className="text-2xl font-bold text-gray-900">三种非参数估计</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <ConceptCard
            icon={<BarChart3 className="w-5 h-5" />}
            title="直方图"
            description={
              <>
                把空间划分为若干箱子，用每个箱子内的样本比例估计局部概率密度。简单易用，但对箱宽与边界敏感。
              </>
            }
          />
          <ConceptCard
            icon={<Waves className="w-5 h-5" />}
            title="核密度估计（KDE）"
            description={
              <>
                在每个数据点处放置一个平滑的核函数，叠加后得到连续密度估计。带宽 h 控制平滑程度。
              </>
            }
          />
          <ConceptCard
            icon={<Activity className="w-5 h-5" />}
            title="k-近邻（KNN）"
            description={
              <>
                固定近邻数 k，通过包含 k 个点的局部体积来估计密度。适合多峰、不规则分布。
              </>
            }
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-sky-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心公式</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormulaCard
            title="核密度估计"
            formula={
              <KaTeX
                math={String.raw`p(x)=\frac{1}{N}\sum_{n=1}^{N}\frac{1}{h}K\!\left(\frac{x-x_n}{h}\right)`}
                display
              />
            }
            description="K(·) 是满足归一化条件的核函数，h 为带宽。"
          />
          <FormulaCard
            title="高斯核"
            formula={
              <KaTeX
                math={String.raw`K(u)=\frac{1}{\sqrt{2\pi}}\exp\!\left(-\frac{u^2}{2}\right)`}
                display
              />
            }
            description="最常用的核函数之一，处处光滑，导数连续。"
          />
        </div>
        <div className="mt-4">
          <FormulaCard
            title="k-近邻密度估计"
            formula={
              <KaTeX
                math={String.raw`p(x)\approx\frac{k}{N\,V(x)}`}
                display
              />
            }
            description={
              <>
                V(x) 是以 x 为中心、刚好包含 k 个最近邻点的区域体积。k 太小估计方差大，k 太大偏差大。
              </>
            }
          />
        </div>
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：一维核密度估计">
        <p className="text-gray-700 mb-4">
          点击图表可添加数据点，或点击“随机生成”。拖动带宽 h，观察 KDE 曲线在欠平滑与过平滑之间的变化。
        </p>
        <InteractivePanel
          hint="红色竖线表示样本点位置，蓝色曲线为高斯核密度估计。"
          chart={
            <svg
              ref={svgRef}
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto cursor-crosshair"
              style={{ maxHeight: 320 }}
              onClick={handleSvgClick}
            >
              {/* axes */}
              <line
                x1={pad.left}
                y1={pad.top + innerH}
                x2={pad.left + innerW}
                y2={pad.top + innerH}
                stroke="#9ca3af"
                strokeWidth={1.5}
              />
              <line
                x1={pad.left}
                y1={pad.top}
                x2={pad.left}
                y2={pad.top + innerH}
                stroke="#9ca3af"
                strokeWidth={1.5}
              />
              {/* x ticks */}
              {[-4, -2, 0, 2, 4].map((x) => (
                <g key={x}>
                  <line
                    x1={xScale(x)}
                    y1={pad.top + innerH}
                    x2={xScale(x)}
                    y2={pad.top + innerH + 5}
                    stroke="#9ca3af"
                  />
                  <text
                    x={xScale(x)}
                    y={pad.top + innerH + 20}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#6b7280"
                  >
                    {x}
                  </text>
                </g>
              ))}
              {/* y ticks */}
              {[0, maxP / 2, maxP].map((p, i) => (
                <g key={i}>
                  <line
                    x1={pad.left - 5}
                    y1={yScale(p)}
                    x2={pad.left}
                    y2={yScale(p)}
                    stroke="#9ca3af"
                  />
                  <text
                    x={pad.left - 8}
                    y={yScale(p) + 3}
                    textAnchor="end"
                    fontSize={10}
                    fill="#6b7280"
                  >
                    {p.toFixed(2)}
                  </text>
                </g>
              ))}
              {/* rug plot */}
              {data.map((x, i) => (
                <line
                  key={i}
                  x1={xScale(x)}
                  y1={pad.top + innerH}
                  x2={xScale(x)}
                  y2={pad.top + innerH + 12}
                  stroke="#ef4444"
                  strokeWidth={2}
                  opacity={0.8}
                />
              ))}
              {/* KDE curve */}
              <path
                d={pathD}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x={pad.left + innerW / 2}
                y={height - 8}
                textAnchor="middle"
                fontSize={12}
                fill="#374151"
              >
                x
              </text>
            </svg>
          }
          controls={
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  带宽 h = <span className="font-mono text-blue-700">{h.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min={0.05}
                  max={2}
                  step={0.05}
                  value={h}
                  onChange={(e) => setH(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <p className="text-xs text-gray-500 mt-1">h 越小曲线越“崎岖”，h 越大曲线越平滑。</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setData(generateData())}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  随机生成
                </button>
                <button
                  onClick={() => setData([])}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  清空
                </button>
              </div>
              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 text-sm text-sky-900 space-y-1">
                <p>
                  样本数 N = <span className="font-mono font-semibold">{data.length}</span>
                </p>
                <p>
                  当前带宽对应核的标准差 σ = <span className="font-mono font-semibold">{h.toFixed(2)}</span>
                </p>
              </div>
            </div>
          }
        />
      </InteractiveDemo>
    
      <SectionMetadata
        bishopChapter={"Ch 3"}
        bishopSection={"nonparametric"}
        learningObjectives={["理解 Nonparametric 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
              />
</div>
  );
}
