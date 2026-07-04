import { useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, GitBranch, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';

function gaussianPdf(x: number, mu: number, sigma: number) {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

export default function Ch03MixtureDensityNetworksPage() {
  const sectionPath = '/ch03/mixture-density-networks';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [pi1, setPi1] = useState(0.5);
  const [separation, setSeparation] = useState(2);

  const { mixturePath, comp1Path, comp2Path, fillD } = useMemo(() => {
    const W = 400;
    const H = 200;
    const margin = { top: 10, right: 20, bottom: 30, left: 40 };
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;
    const xMin = -5;
    const xMax = 5;
    const mu1 = -separation / 2;
    const mu2 = separation / 2;
    const sigma = 0.6;
    const pi2 = 1 - pi1;

    const density = (x: number) => pi1 * gaussianPdf(x, mu1, sigma) + pi2 * gaussianPdf(x, mu2, sigma);
    const maxP = Math.max(density(mu1), density(mu2), density(0)) * 1.1;

    const sx = (x: number) => margin.left + ((x - xMin) / (xMax - xMin)) * innerW;
    const sy = (p: number) => margin.top + innerH - (p / maxP) * innerH;

    let mix = '';
    let c1 = '';
    let c2 = '';
    const N = 120;
    for (let i = 0; i <= N; i++) {
      const x = xMin + (i / N) * (xMax - xMin);
      const cmd = i === 0 ? 'M' : 'L';
      mix += `${cmd} ${sx(x).toFixed(1)} ${sy(density(x)).toFixed(1)} `;
      c1 += `${cmd} ${sx(x).toFixed(1)} ${sy(pi1 * gaussianPdf(x, mu1, sigma)).toFixed(1)} `;
      c2 += `${cmd} ${sx(x).toFixed(1)} ${sy(pi2 * gaussianPdf(x, mu2, sigma)).toFixed(1)} `;
    }
    const fill = `${mix} L ${sx(xMax).toFixed(1)} ${sy(0).toFixed(1)} L ${sx(xMin).toFixed(1)} ${sy(0).toFixed(1)} Z`;
    return { mixturePath: mix, comp1Path: c1, comp2Path: c2, fillD: fill };
  }, [pi1, separation]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <GitBranch className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          混合密度网络用神经网络输出条件混合分布的参数，从而建模多峰、非单值的逆问题映射。
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
            title="条件混合分布"
            description="网络同时预测混合系数、均值与方差，输出完整的条件概率密度，而非单一预测值。"
          />
          <ConceptCard
            title="机器人运动学示例"
            description="同一末端位置可能对应多个关节角，单值回归会取平均导致错误解；混合分布可表示多个可行解。"
          />
          <ConceptCard
            title="似然训练"
            description="直接最大化条件对数似然，网络自动学习何时需要多峰输出以及各分量的参数。"
          />
          <ConceptCard
            title="混合系数约束"
            description="混合系数 πₖ(x) 通过 softmax 输出，保证非负且和为 1。"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">关键公式</h2>
        </div>
        <FormulaCard
          title="条件混合密度"
          formula={String.raw`p(t \mid x) = \sum_{k=1}^{K} \pi_k(x) \, \mathcal{N}\bigl(t \mid \mu_k(x), \sigma_k^2(x)\bigr)`}
          description="神经网络的输出同时参数化 K 个高斯分量的权重、均值和方差。"
        />
        <FormulaCard
          title="对数似然损失"
          formula={String.raw`E = -\sum_{n} \ln p(t_n \mid x_n)`}
          description="直接对条件密度取负对数似然；网络通过梯度下降学习混合参数。"
        />
      </section>

      <InteractiveDemo title="两个高斯分量的混合密度">
        <div className="space-y-6">
          <p className="text-sm text-gray-700">
            调节混合系数 <KaTeX math={String.raw`\pi_1`} /> 与两个分量中心的间距，观察条件密度如何在单峰与双峰之间切换。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  混合系数 π₁
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{pi1.toFixed(2)}</span>
              </div>
              <Slider value={[pi1]} min={0} max={1} step={0.05} onValueChange={(v) => setPi1(v[0])} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  分量间距
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{separation.toFixed(1)}</span>
              </div>
              <Slider value={[separation]} min={0} max={4} step={0.1} onValueChange={(v) => setSeparation(v[0])} />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <svg viewBox="0 0 400 200" className="w-full h-auto">
              <rect x={40} y={10} width={340} height={160} fill="#f8fafc" />
              <text x={210} y={190} textAnchor="middle" fontSize={10} fill="#6b7280">t</text>
              <text x={15} y={95} textAnchor="middle" fontSize={10} fill="#6b7280" transform="rotate(-90 15 95)">p(t|x)</text>
              <path d={fillD} fill="#dbeafe" opacity={0.5} />
              <path d={comp1Path} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 2" />
              <path d={comp2Path} fill="none" stroke="#10b981" strokeWidth={2} strokeDasharray="4 2" />
              <path d={mixturePath} fill="none" stroke="#2563eb" strokeWidth={2.5} />
            </svg>
            <div className="flex justify-center gap-6 text-xs mt-2">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500 border-dashed border-t border-amber-500" /> 分量 1</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 border-dashed border-t border-emerald-500" /> 分量 2</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-600" /> 混合密度</span>
            </div>
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
