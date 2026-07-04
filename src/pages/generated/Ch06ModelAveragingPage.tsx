import { useMemo, useState } from 'react';
import { BookOpen, ShieldAlert, SlidersHorizontal, Users, RefreshCw } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import SectionNavigation from '@/components/SectionNavigation';
import { getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch06/model-averaging';

const INPUT = [1.0, 0.5, -0.5, -1.0];
const WEIGHTS = [
  [0.2, -0.3, 0.1, 0.4],
  [-0.1, 0.5, -0.2, 0.3],
  [0.3, 0.1, -0.4, -0.2],
  [0.4, -0.2, 0.3, 0.1],
  [-0.3, 0.2, 0.5, -0.1],
  [0.1, 0.3, -0.1, 0.5],
  [-0.2, -0.1, 0.4, 0.2],
  [0.5, -0.4, 0.2, -0.3],
];

export default function Ch06ModelAveragingPage() {
  const section = getSectionByPath(SECTION_PATH);
  const [keepProb, setKeepProb] = useState(0.6);
  const [seed, setSeed] = useState(1);

  const { mask, droppedOut, expected } = useMemo(() => {
    const rng = mulberry32(seed);
    const mask = WEIGHTS.map(() => (rng() < keepProb ? 1 : 0));
    const expected = WEIGHTS.map((w) => dot(w, INPUT));
    const droppedOut = expected.map((z, i) => mask[i] * z);
    return { mask, droppedOut, expected };
  }, [keepProb, seed]);

  const trainOutput = droppedOut.reduce((a, b) => a + b, 0);
  const testOutput = expected.reduce((a, b) => a + b, 0);
  const scaledOutput = trainOutput / Math.max(keepProb, 1e-6);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Users className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '模型平均'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          模型平均通过组合多个模型的预测降低方差；Dropout 训练时随机失活神经元，等价于对指数级子网络做隐式模型平均，测试时通过缩放近似整体平均。
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
            title="委员会机器"
            description="独立训练多个模型并平均它们的输出，通常能降低方差、提升泛化性能。"
          />
          <ConceptCard
            title="Dropout 作为子网络平均"
            description="每次前向传播随机丢弃一部分神经元，等价于采样一个稀疏子网络；训练过程平均了这些子网络。"
          />
          <ConceptCard
            title="测试时缩放"
            description="预测时保留全部神经元并将权重乘以保留概率 p，近似训练时所有子网络输出的期望。"
          />
          <ConceptCard
            title="方差缩减"
            description="模型平均的误差方差随集成数量增加而下降，Dropout 在单模型中实现了类似的正则化效果。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">平均与 Dropout</h2>
        <FormulaCard
          title="委员会平均"
          formula={String.raw`y_{\text{avg}} = \frac{1}{M} \sum_{m=1}^{M} y_m(\mathbf{x})`}
          description="多个独立模型的预测取平均，偏差基本不变而方差显著降低。"
        />
        <FormulaCard
          title="Bernoulli 掩码"
          formula={String.raw`\mathbf{r} \sim \text{Bernoulli}(p),\quad \tilde{\mathbf{h}} = \mathbf{r} \odot \mathbf{h}`}
          description="以保留概率 p 生成掩码 r，逐元素作用于隐藏层输出 h。"
        />
        <FormulaCard
          title="测试时缩放"
          formula={String.raw`\mathbf{h}_{\text{test}} = p \, \mathbf{h}`}
          description="推理时使用完整网络并乘以 p，使输出期望与训练时一致。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：Dropout 掩码与有效网络">
        <div className="space-y-6">
          <p className="text-gray-700">
            观察单层隐藏层在不同保留概率下的随机掩码。绿色神经元被保留，灰色神经元被丢弃；右侧显示训练输出、缩放后输出与无 Dropout 的期望输出。
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                保留概率 p
              </label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{keepProb.toFixed(2)}</span>
            </div>
            <Slider value={[keepProb]} min={0.1} max={1} step={0.1} onValueChange={(v) => setKeepProb(v[0])} />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-sm font-medium text-gray-700">隐藏层掩码：</div>
            <div className="flex flex-wrap gap-2">
              {mask.map((m, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono border ${
                    m ? 'bg-green-100 border-green-300 text-green-800' : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}
                  title={m ? '保留' : '丢弃'}
                >
                  {m ? 1 : 0}
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">训练输出</div>
              <div className="text-2xl font-bold text-blue-700">{trainOutput.toFixed(3)}</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">缩放后输出（测试）</div>
              <div className="text-2xl font-bold text-amber-700">{scaledOutput.toFixed(3)}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">无 Dropout 期望</div>
              <div className="text-2xl font-bold text-green-700">{testOutput.toFixed(3)}</div>
            </div>
          </div>

          <FormulaCard
            title="当前输出"
            formula={String.raw`\sum_i r_i\,(\mathbf{w}_i^{\!T}\mathbf{x}) = ${trainOutput.toFixed(3)},\quad \frac{1}{p}\sum_i r_i\,(\mathbf{w}_i^{\!T}\mathbf{x}) = ${scaledOutput.toFixed(3)}`}
            description="测试时除以保留概率 p，使 Dropout 网络的输出期望接近完整网络。"
          />

          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              重新采样掩码
            </Button>
          </div>
        </div>
      </InteractiveDemo>

      <SectionNavigation sectionPath={SECTION_PATH} />
    </div>
  );
}

function dot(a: number[], b: number[]) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
