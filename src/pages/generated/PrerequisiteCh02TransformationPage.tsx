import { useMemo, useState } from 'react';
import { BookOpen, ShieldAlert, Shuffle, SlidersHorizontal } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function normalPdf(x: number) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export default function PrerequisiteCh02TransformationPage() {
  const sectionPath = '/prerequisite/ch02/transformation';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [a, setA] = useState(1);

  const { originalPath, transformedPath, fillPath, jacobian } = useMemo(() => {
    const W = 400;
    const H = 200;
    const margin = { top: 10, right: 20, bottom: 30, left: 40 };
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;
    const xMin = -3;
    const xMax = 3;
    const yMax = 0.55;

    const sx = (x: number) => margin.left + ((x - xMin) / (xMax - xMin)) * innerW;
    const sy = (p: number) => margin.top + innerH - (p / yMax) * innerH;

    let orig = '';
    let trans = '';
    let fill = '';
    const N = 120;
    for (let i = 0; i <= N; i++) {
      const x = xMin + (i / N) * (xMax - xMin);
      const px = normalPdf(x);
      const py = normalPdf(x / a) / a;
      const cmd = i === 0 ? 'M' : 'L';
      orig += `${cmd} ${sx(x).toFixed(1)} ${sy(px).toFixed(1)} `;
      trans += `${cmd} ${sx(x).toFixed(1)} ${sy(py).toFixed(1)} `;
    }
    fill = trans + `L ${sx(xMax).toFixed(1)} ${sy(0).toFixed(1)} L ${sx(xMin).toFixed(1)} ${sy(0).toFixed(1)} Z`;

    return { originalPath: orig, transformedPath: trans, fillPath: fill, jacobian: 1 / a };
  }, [a]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Shuffle className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          密度变换描述随机变量经过可逆函数映射后，新变量的概率密度如何由原密度与 Jacobian 行列式共同决定。
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
            title="一元变量替换"
            description="对单调可逆变换 y = g(x)，新密度等于原密度在反函数处的取值乘以导数绝对值的倒数，保证概率守恒。"
          />
          <ConceptCard
            title="多元密度变换"
            description="多维情形下用 Jacobian 行列式刻画体积元的伸缩；总概率在变换前后仍然为 1。"
          />
          <ConceptCard
            title="体积元解释"
            description="Jacobian 的绝对值反映了变换对无穷小体积的放大或缩小程度，密度随之反向缩放。"
          />
          <ConceptCard
            title="标准化流"
            description="现代生成模型通过可逆神经网络变换，将简单分布逐步映射为复杂数据分布，核心是密度变换公式。"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">关键公式</h2>
        </div>
        <FormulaCard
          title="一元变换"
          formula={String.raw`p_y(y) = p_x\bigl(g^{-1}(y)\bigr) \left| \frac{dx}{dy} \right|`}
          description="其中 x = g^{-1}(y)。导数绝对值的倒数补偿了变量伸缩导致的概率密度变化。"
        />
        <FormulaCard
          title="多元变换"
          formula={String.raw`p_y(\mathbf{y}) = p_x(\mathbf{x}) \left| \det \frac{\partial \mathbf{x}}{\partial \mathbf{y}} \right|`}
          description="矩阵 Jacobian 的行列式刻画多维体积元的变化，绝对值保证密度非负。"
        />
      </section>

      <InteractiveDemo title="线性缩放对密度的影响">
        <div className="space-y-6">
          <p className="text-sm text-gray-700">
            设 <KaTeX math={String.raw`y = a x`} />，且 <KaTeX math={String.raw`x \sim \mathcal{N}(0,1)`} />。
            观察缩放系数 <KaTeX math="a" /> 如何改变变换后密度 <KaTeX math={String.raw`p_y(y)`} /> 的形状与 Jacobian 因子。
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                缩放系数 a
              </label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{a.toFixed(2)}</span>
            </div>
            <Slider value={[a]} min={0.2} max={3} step={0.05} onValueChange={(v) => setA(v[0])} />
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <svg viewBox="0 0 400 200" className="w-full h-auto">
              <rect x={40} y={10} width={340} height={160} fill="#f8fafc" />
              <text x={200} y={190} textAnchor="middle" fontSize={10} fill="#6b7280">y</text>
              <text x={15} y={100} textAnchor="middle" fontSize={10} fill="#6b7280" transform="rotate(-90 15 100)">密度</text>
              <path d={fillPath} fill="#dbeafe" opacity={0.6} />
              <path d={originalPath} fill="none" stroke="#9ca3af" strokeWidth={2} strokeDasharray="4 4" />
              <path d={transformedPath} fill="none" stroke="#2563eb" strokeWidth={2.5} />
            </svg>
            <div className="flex justify-center gap-6 text-xs mt-2">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-gray-400 border-dashed border-t border-gray-400" /> 原密度 <KaTeX math={String.raw`p_x(x)`} /></span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-600" /> 变换后 <KaTeX math={String.raw`p_y(y)`} /></span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">Jacobian 因子</div>
              <div className="text-2xl font-bold text-blue-700">{jacobian.toFixed(3)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <KaTeX math={String.raw`p_y(y) = p_x\left(\frac{y}{a}\right)\cdot\frac{1}{a}`} />
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
