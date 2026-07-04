import { useState } from 'react';
import { BookOpen, Calculator, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import SectionNavigation from '@/components/SectionNavigation';
import { getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch05/automatic-differentiation';

type Mode = 'forward-x' | 'forward-y' | 'reverse';

export default function Ch05AutomaticDifferentiationPage() {
  const section = getSectionByPath(SECTION_PATH);
  const [x, setX] = useState(2.0);
  const [y, setY] = useState(3.0);
  const [mode, setMode] = useState<Mode>('reverse');

  // Forward values
  const sinx = Math.sin(x);
  const prod = x * y;
  const f = sinx + prod;

  // Forward mode derivatives
  const dsinx_dx = Math.cos(x);
  const dprod_dx = y;
  const df_dx = dsinx_dx + dprod_dx;
  const df_dy = x;

  // Reverse mode adjoints
  const fBar = 1;
  const sinxBar = fBar;
  const prodBar = fBar;
  const xBar = dsinx_dx * sinxBar + dprod_dx * prodBar;
  const yBar = x * prodBar;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Calculator className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '自动微分'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          自动微分将复杂函数拆分为基本运算，通过记录计算图并在图上执行前向或反向模式传播，机械地获得任意阶导数，是现代深度学习框架的核心能力。
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
            title="计算图与拓扑序"
            description="每个基本运算都是图中的一个节点，节点按依赖关系排序；反向传播必须按逆拓扑序访问节点。"
          />
          <ConceptCard
            title="前向模式"
            description="为每个变量引入切分量 \dot{v}，沿着前向顺序同时计算函数值和方向导数，适合输入少输出多的场景。"
          />
          <ConceptCard
            title="反向模式"
            description="先完成前向计算保存中间值，再从输出节点反向传播伴随变量 \bar{v}，一次即可得到所有输入梯度。"
          />
          <ConceptCard
            title="计算效率"
            description="反向模式的时间复杂度通常与函数求值同阶，空间复杂度为图的大小，是训练深层网络的关键。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">前向模式与反向模式</h2>
        <FormulaCard
          title="前向模式（切分传播）"
          formula={String.raw`\dot{v}_i = \sum_{j\in\text{pa}(i)} \frac{\partial v_i}{\partial v_j}\,\dot{v}_j`}
          description="每个节点的切分量等于其局部导数与父节点切分量的加权和。"
        />
        <FormulaCard
          title="反向模式（伴随传播）"
          formula={String.raw`\bar{v}_j = \sum_{i\in\text{ch}(j)} \bar{v}_i\,\frac{\partial v_i}{\partial v_j}`}
          description="每个节点的伴随变量等于其所有子节点伴随变量经局部导数加权后的和。"
        />
        <FormulaCard
          title="向量-雅可比积"
          formula={String.raw`\text{VJP: } \bar{x}^{\!T} = \bar{y}^{\!T} \frac{\partial y}{\partial x}`}
          description="反向模式在节点层面执行向量-雅可比积，避免显式构造完整 Jacobian。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：前向与反向模式计算图">
        <div className="space-y-6">
          <p className="text-gray-700">
            以函数 <KaTeX math={String.raw`f(x,y)=x\,y+\sin x`} /> 为例。点击下方按钮切换前向模式（分别对 x 或 y 求导）与反向模式，观察每个节点上的数值与导数/伴随变化。
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={mode === 'forward-x' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('forward-x')}
            >
              前向模式：对 x 求导
            </Button>
            <Button
              variant={mode === 'forward-y' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('forward-y')}
            >
              前向模式：对 y 求导
            </Button>
            <Button
              variant={mode === 'reverse' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('reverse')}
            >
              反向模式
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  输入 x
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{x.toFixed(2)}</span>
              </div>
              <Slider value={[x]} min={0.5} max={4} step={0.1} onValueChange={(v) => setX(v[0])} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  输入 y
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{y.toFixed(2)}</span>
              </div>
              <Slider value={[y]} min={0.5} max={4} step={0.1} onValueChange={(v) => setY(v[0])} />
            </div>
          </div>

          {/* Computation graph */}
          <div className="flex flex-col items-center gap-4 py-4 overflow-x-auto">
            <div className="flex items-center gap-6">
              <Node
                label="x"
                value={x}
                extra={
                  mode === 'forward-x' ? 1 : mode === 'forward-y' ? 0 : xBar
                }
                extraLabel={mode === 'reverse' ? 'x̄' : 'ẋ'}
                highlight
              />
              <Node label="y" value={y} extra={mode === 'forward-x' ? 0 : mode === 'forward-y' ? 1 : yBar} extraLabel={mode === 'reverse' ? 'ȳ' : 'ẏ'} />
            </div>
            <div className="flex items-center gap-8">
              <Node
                label="sin x"
                value={sinx}
                extra={mode === 'forward-x' ? dsinx_dx : mode === 'forward-y' ? 0 : sinxBar}
                extraLabel={mode === 'reverse' ? 's̄in x' : 'siṅ x'}
              />
              <Node
                label="x·y"
                value={prod}
                extra={mode === 'forward-x' ? dprod_dx : mode === 'forward-y' ? df_dy : prodBar}
                extraLabel={mode === 'reverse' ? 'x·ȳ' : 'x·ẏ'}
              />
            </div>
            <Node
              label="f"
              value={f}
              extra={mode === 'forward-x' ? df_dx : mode === 'forward-y' ? df_dy : fBar}
              extraLabel={mode === 'reverse' ? 'f̄' : 'ḟ'}
              highlight
            />
          </div>

          <FormulaCard
            title="当前模式结果"
            formula={
              mode === 'forward-x'
                ? String.raw`\frac{\partial f}{\partial x}=\cos x+y=${df_dx.toFixed(3)}`
                : mode === 'forward-y'
                  ? String.raw`\frac{\partial f}{\partial y}=x=${df_dy.toFixed(3)}`
                  : String.raw`\bar{x}=\frac{\partial f}{\partial x}=${xBar.toFixed(3)},\quad \bar{y}=\frac{\partial f}{\partial y}=${yBar.toFixed(3)}`
            }
            description="反向模式下一次遍历即可同时得到所有输入梯度，而前向模式每次只能沿一个输入方向求导。"
          />
        </div>
      </InteractiveDemo>

      <SectionNavigation sectionPath={SECTION_PATH} />
    </div>
  );
}

function Node({
  label,
  value,
  extra,
  extraLabel,
  highlight = false,
}: {
  label: string;
  value: number;
  extra: number;
  extraLabel: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-w-[7rem] px-4 py-3 rounded-lg border text-sm ${
        highlight ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'
      }`}
    >
      <div className="font-semibold text-gray-900">{label}</div>
      <div className="text-gray-600">v = {value.toFixed(3)}</div>
      <div className="text-blue-600 font-mono">
        {extraLabel} = {extra.toFixed(3)}
      </div>
    </div>
  );
}
