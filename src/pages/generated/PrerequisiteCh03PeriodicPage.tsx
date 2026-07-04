import { useMemo, useState } from 'react';
import { BookOpen, RotateCw, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';

function besselI0(kappa: number) {
  let sum = 1;
  let term = 1;
  for (let n = 1; n <= 40; n++) {
    term *= (kappa / 2) * (kappa / 2) / (n * n);
    sum += term;
    if (term < 1e-12) break;
  }
  return sum;
}

export default function PrerequisiteCh03PeriodicPage() {
  const sectionPath = '/prerequisite/ch03/periodic';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [kappa, setKappa] = useState(2);

  const { pathD, fillD, peak } = useMemo(() => {
    const W = 400;
    const H = 200;
    const margin = { top: 10, right: 20, bottom: 30, left: 45 };
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;
    const thetaMin = -Math.PI;
    const thetaMax = Math.PI;
    const i0 = besselI0(kappa);
    const density = (theta: number) => Math.exp(kappa * Math.cos(theta)) / (2 * Math.PI * i0);
    const pMax = density(0);

    const sx = (t: number) => margin.left + ((t - thetaMin) / (thetaMax - thetaMin)) * innerW;
    const sy = (p: number) => margin.top + innerH - (p / (pMax * 1.1)) * innerH;

    let d = '';
    const N = 150;
    for (let i = 0; i <= N; i++) {
      const t = thetaMin + (i / N) * (thetaMax - thetaMin);
      const p = density(t);
      d += `${i === 0 ? 'M' : 'L'} ${sx(t).toFixed(1)} ${sy(p).toFixed(1)} `;
    }
    const fill = `${d} L ${sx(thetaMax).toFixed(1)} ${sy(0).toFixed(1)} L ${sx(thetaMin).toFixed(1)} ${sy(0).toFixed(1)} Z`;
    return { pathD: d, fillD: fill, peak: pMax };
  }, [kappa]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <RotateCw className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          周期变量（如角度、方向）不能用普通高斯直接建模；Von Mises 分布是圆周上的自然类比。
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
            title="Von Mises 分布"
            description="在圆周上定义的位置-尺度分布，集中参数 κ 控制分布尖锐程度；κ=0 时退化为圆周均匀分布。"
          />
          <ConceptCard
            title="圆周矩"
            description="用复指数或 (cos θ, sin θ) 计算均值，避免 0°/360° 不连续问题。"
          />
          <ConceptCard
            title="与高斯的关系"
            description="当 κ 很大时，Von Mises 在峰值附近近似高斯；小 κ 时则接近均匀。"
          />
          <ConceptCard
            title="应用领域"
            description="广泛用于风向、分子取向、机器人姿态、时间序列相位等角度数据建模。"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">关键公式</h2>
        </div>
        <FormulaCard
          title="Von Mises 密度"
          formula={String.raw`p(\theta \mid \theta_0, \kappa) = \frac{1}{2\pi I_0(\kappa)} \exp\bigl\{ \kappa \cos(\theta - \theta_0) \bigr\}`}
          description="θ₀ 为平均方向，κ 为集中参数，I₀ 为零阶修正 Bessel 函数。"
        />
        <FormulaCard
          title="修正 Bessel 函数 I₀"
          formula={String.raw`I_0(\kappa) = \sum_{n=0}^{\infty} \frac{1}{(n!)^2}\left(\frac{\kappa}{2}\right)^{2n}`}
          description="级数形式保证概率密度积分为 1。"
        />
      </section>

      <InteractiveDemo title="Von Mises 分布形状随 κ 变化">
        <div className="space-y-6">
          <p className="text-sm text-gray-700">
            调节集中参数 <KaTeX math={String.raw`\kappa`} />，观察 Von Mises 分布如何从均匀分布逐渐变成尖锐的单峰。
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                集中参数 κ
              </label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{kappa.toFixed(2)}</span>
            </div>
            <Slider value={[kappa]} min={0} max={8} step={0.1} onValueChange={(v) => setKappa(v[0])} />
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <svg viewBox="0 0 400 200" className="w-full h-auto">
              <rect x={45} y={10} width={335} height={160} fill="#f8fafc" />
              <text x={212} y={190} textAnchor="middle" fontSize={10} fill="#6b7280">θ</text>
              <text x={18} y={95} textAnchor="middle" fontSize={10} fill="#6b7280" transform="rotate(-90 18 95)">p(θ)</text>
              <path d={fillD} fill="#dbeafe" opacity={0.6} />
              <path d={pathD} fill="none" stroke="#2563eb" strokeWidth={2.5} />
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">峰值密度 p(θ₀)</div>
              <div className="text-2xl font-bold text-blue-700">{peak.toFixed(3)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <KaTeX math={String.raw`p(\theta_0) = \frac{e^{\kappa}}{2\pi I_0(\kappa)}`} />
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
        )}
      </nav>
    </div>
  );
}
