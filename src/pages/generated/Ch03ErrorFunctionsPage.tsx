import { useMemo, useState } from 'react';
import { Activity, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';

export default function Ch03ErrorFunctionsPage() {
  const sectionPath = '/ch03/error-functions';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [noise, setNoise] = useState(0.1);

  const { ce, mse } = useMemo(() => {
    const p = 0.8;
    const ce = -((1 - noise) * Math.log(p) + noise * Math.log(1 - p));
    const mse = (1 - noise) * (1 - p) * (1 - p) + noise * p * p;
    return { ce, mse };
  }, [noise]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Activity className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          误差函数将网络输出与目标之间的差距量化为可优化的标量；不同任务（回归、分类）对应不同的概率假设与损失。
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
            title="回归：平方误差"
            description="假设目标噪声服从高斯分布，最大似然等价于最小化输出与目标的平方距离。"
          />
          <ConceptCard
            title="二分类：交叉熵"
            description="对二元标签使用 sigmoid 输出，最大似然导出交叉熵损失；鼓励模型输出接近真实标签概率。"
          />
          <ConceptCard
            title="多分类：Softmax 交叉熵"
            description="多类输出通过 softmax 得到概率分布，损失鼓励正确类别的对数概率最大化。"
          />
          <ConceptCard
            title="概率解释"
            description="每种误差函数都可视为某种条件分布下的负对数似然；改变分布假设即可得到不同损失。"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">关键公式</h2>
        </div>
        <FormulaCard
          title="回归平方误差"
          formula={String.raw`E = \frac{1}{2} \sum_{n=1}^{N} \bigl\| y(x_n, \mathbf{w}) - t_n \bigr\|^2`}
          description="对高斯噪声假设下的最大似然估计；系数 1/2 与导数消去。"
        />
        <FormulaCard
          title="二分类交叉熵"
          formula={String.raw`E = -\sum_{n} \bigl[ t_n \ln y_n + (1-t_n) \ln(1-y_n) \bigr]`}
          description="tₙ ∈ {0,1}，yₙ 为 sigmoid 输出。"
        />
        <FormulaCard
          title="多分类 Softmax 交叉熵"
          formula={String.raw`E = -\sum_{n} \sum_{k} t_{nk} \ln y_{nk}`}
          description="t_{nk} 为 one-hot 标签，y_{nk} 为 softmax 概率。"
        />
      </section>

      <InteractiveDemo title="标签噪声对误差函数的影响">
        <div className="space-y-6">
          <p className="text-sm text-gray-700">
            假设模型对正类给出固定预测 <KaTeX math={String.raw`y=0.8`} />。
            通过调节标签噪声比例 <KaTeX math={String.raw`\varepsilon`} />，观察交叉熵与平方误差的期望变化。
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                标签噪声 ε
              </label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{noise.toFixed(2)}</span>
            </div>
            <Slider value={[noise]} min={0} max={0.5} step={0.01} onValueChange={(v) => setNoise(v[0])} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">交叉熵期望</div>
              <div className="text-2xl font-bold text-blue-700">{ce.toFixed(3)}</div>
            </div>
            <div className="bg-rose-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">平方误差期望</div>
              <div className="text-2xl font-bold text-rose-700">{mse.toFixed(3)}</div>
            </div>
          </div>
          <FormulaCard
            title="带噪声的期望损失"
            formula={String.raw`\mathbb{E}[E] = -(1-\varepsilon)\ln 0.8 - \varepsilon \ln 0.2`}
            description="噪声越大，损失越大；交叉熵对错误预测惩罚更重。"
          />
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
