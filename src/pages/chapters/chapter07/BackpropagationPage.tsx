import { useState, useMemo } from 'react';
import { ShieldAlert, GitBranch, CheckCircle2, Play, RotateCcw } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';
import { Slider } from '@/components/ui/slider';

export default function BackpropagationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第七章 · 深度学习
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">反向传播</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          反向传播是训练神经网络的核心算法。它利用链式法则高效计算损失函数对每一层参数的梯度，
          从而指导参数更新。
        </p>

        {/* Copyright Notice */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      {/* Chain rule */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <GitBranch className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">链式法则</h2>
        </div>
        <p className="text-gray-700 mb-4">
          神经网络的损失 <KaTeX math={String.raw`L`} /> 对某一层参数 <KaTeX math={String.raw`w`} /> 的梯度，
          可以通过链式法则分解为各层之间的局部梯度乘积：
        </p>

        <FormulaCard
          title="链式法则"
          formula={
            <KaTeX
              math={String.raw`\frac{\partial L}{\partial w} = \frac{\partial L}{\partial a} \cdot \frac{\partial a}{\partial z} \cdot \frac{\partial z}{\partial w}`}
              display
            />
          }
          description="其中 z = wx + b，a = f(z)，L 是最终损失。"
        />

        <p className="text-gray-700 mb-4">
          反向传播的关键在于：先做一次前向传播计算所有中间值，然后从输出层开始，
          逐层将梯度反向传递回输入层。
        </p>
      </section>

      {/* Interactive demo: computation graph */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：计算图与梯度流动</h2>
        <p className="text-gray-700 mb-4">
          下面是一个简单的计算图：<KaTeX math={String.raw`z = w x + b`} />，<KaTeX math={String.raw`a = \sigma(z)`} />，
          <KaTeX math={String.raw`L = (a - y)^2`} />。调整输入，观察前向值与反向梯度的变化；
          也可以点击“反向传播”按钮，逐步看梯度如何从损失节点流回参数节点。
        </p>
        <ComputationGraphDemo />
      </section>

      {/* Multi-layer backprop demo */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">多层网络：梯度如何逐层传递</h2>
        <p className="text-gray-700 mb-4">
          当网络变深时，输出层的梯度会沿着每条路径继续向后传播。下面的两层网络展示了
          <KaTeX math={String.raw`\partial L / \partial W^{[2]}`} /> 与 <KaTeX math={String.raw`\partial L / \partial W^{[1]}`} /> 的传递关系。
        </p>
        <MultiLayerBackpropDemo />
      </section>

      {/* Why efficient */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">为什么反向传播高效？</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">复用中间结果</h3>
            <p className="text-sm text-gray-700">
              前向传播时保存的激活值和线性输出，在反向传播时直接复用，避免重复计算。
            </p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">逐层传递</h3>
            <p className="text-sm text-gray-700">
              每层的梯度只依赖于后一层的梯度和本层的局部梯度，计算复杂度与网络层数线性相关。
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-violet-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-violet-800">
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">●</span>
            <span>反向传播利用链式法则计算梯度。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">●</span>
            <span>先前向传播保存中间结果，再反向传递梯度。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">●</span>
            <span>它是神经网络能够高效训练的关键。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 单神经元计算图：前向 + 反向传播                                          */
/* -------------------------------------------------------------------------- */
function ComputationGraphDemo() {
  const [x, setX] = useState([2.0]);
  const [w, setW] = useState([1.5]);
  const [b, setB] = useState([-1.0]);
  const [y, setY] = useState([0.8]);
  const [step, setStep] = useState(0); // 0: forward only, 1: dL, 2: add da, 3: add dz, 4: full

  const z = w[0] * x[0] + b[0];
  const a = 1 / (1 + Math.exp(-z));
  const loss = Math.pow(a - y[0], 2);

  const dL_da = 2 * (a - y[0]);
  const da_dz = a * (1 - a);
  const dz_dw = x[0];
  const dz_db = 1;

  const dL_dz = dL_da * da_dz;
  const dL_dw = dL_dz * dz_dw;
  const dL_db = dL_dz * dz_db;

  const width = 760;
  const height = 360;
  const padding = 40;

  const nodes = {
    x: { cx: 90, cy: 240, label: 'x', value: x[0], grad: 0 },
    w: { cx: 90, cy: 120, label: 'w', value: w[0], grad: step >= 4 ? dL_dw : 0 },
    b: { cx: 90, cy: 180, label: 'b', value: b[0], grad: step >= 4 ? dL_db : 0 },
    z: { cx: 300, cy: 180, label: 'z', value: z, grad: step >= 3 ? dL_dz : 0 },
    a: { cx: 470, cy: 180, label: 'a', value: a, grad: step >= 2 ? dL_da : 0 },
    y: { cx: 470, cy: 280, label: 'y', value: y[0], grad: 0 },
    L: { cx: 640, cy: 180, label: 'L', value: loss, grad: step >= 1 ? 1 : 0 },
  };

  const edges = useMemo(
    () => [
      { from: 'x', to: 'z', label: String.raw`\partial z/\partial x = w`, value: w[0], showGrad: step >= 3 },
      { from: 'w', to: 'z', label: String.raw`\partial z/\partial w = x`, value: x[0], showGrad: step >= 4 },
      { from: 'b', to: 'z', label: String.raw`\partial z/\partial b = 1`, value: 1, showGrad: step >= 4 },
      { from: 'z', to: 'a', label: String.raw`\partial a/\partial z`, value: da_dz, showGrad: step >= 2 },
      { from: 'a', to: 'L', label: String.raw`\partial L/\partial a`, value: dL_da, showGrad: step >= 1 },
      { from: 'y', to: 'L', label: String.raw`\partial L/\partial y`, value: -dL_da, showGrad: step >= 1 },
    ],
    [step, w, x, da_dz, dL_da]
  );

  function arrowPath(x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;
    const startR = 32;
    const endR = 32;
    const sx = x1 + ux * startR;
    const sy = y1 + uy * startR;
    const ex = x2 - ux * endR;
    const ey = y2 - uy * endR;
    return { sx, sy, ex, ey };
  }

  const nodeKeys = Object.keys(nodes) as Array<keyof typeof nodes>;

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-5">
      {/* controls */}
      <div className="grid md:grid-cols-4 gap-4 text-sm">
        <div>
          <label className="flex justify-between text-gray-700 mb-1">
            <span>输入 x</span>
            <span className="text-blue-600">{x[0].toFixed(2)}</span>
          </label>
          <Slider min={-3} max={3} step={0.1} value={x} onValueChange={setX} />
        </div>
        <div>
          <label className="flex justify-between text-gray-700 mb-1">
            <span>权重 w</span>
            <span className="text-blue-600">{w[0].toFixed(2)}</span>
          </label>
          <Slider min={-3} max={3} step={0.1} value={w} onValueChange={setW} />
        </div>
        <div>
          <label className="flex justify-between text-gray-700 mb-1">
            <span>偏置 b</span>
            <span className="text-blue-600">{b[0].toFixed(2)}</span>
          </label>
          <Slider min={-3} max={3} step={0.1} value={b} onValueChange={setB} />
        </div>
        <div>
          <label className="flex justify-between text-gray-700 mb-1">
            <span>标签 y</span>
            <span className="text-blue-600">{y[0].toFixed(2)}</span>
          </label>
          <Slider min={0} max={1} step={0.05} value={y} onValueChange={setY} />
        </div>
      </div>

      {/* step buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setStep(0)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            step === 0 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          1. 前向传播
        </button>
        <button
          onClick={() => setStep(1)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            step >= 1 ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          2. ∂L/∂a
        </button>
        <button
          onClick={() => setStep(2)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            step >= 2 ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          3. ∂L/∂z
        </button>
        <button
          onClick={() => setStep(4)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors flex items-center gap-1 ${
            step >= 4 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Play className="w-4 h-4" /> 4. 完整反向传播
        </button>
        <button
          onClick={() => setStep(0)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" /> 重置
        </button>
      </div>

      {/* graph */}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-white rounded-lg border border-gray-200" style={{ maxHeight: 360 }}>
        {/* edges */}
        {edges.map((e, idx) => {
          const from = nodes[e.from as keyof typeof nodes];
          const to = nodes[e.to as keyof typeof nodes];
          const { sx, sy, ex, ey } = arrowPath(from.cx, from.cy, to.cx, to.cy);
          const isActive = e.showGrad;
          return (
            <g key={idx}>
              <line
                x1={sx}
                y1={sy}
                x2={ex}
                y2={ey}
                stroke={isActive ? '#7c3aed' : '#d1d5db'}
                strokeWidth={isActive ? 3 : 2}
                markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
              />
              {isActive && (
                <g>
                  <rect
                    x={(sx + ex) / 2 - 44}
                    y={(sy + ey) / 2 - 14}
                    width={88}
                    height={24}
                    rx={4}
                    fill="#f3e8ff"
                    stroke="#7c3aed"
                    strokeWidth={1}
                  />
                  <foreignObject x={(sx + ex) / 2 - 42} y={(sy + ey) / 2 - 13} width={84} height={22}>
                    <div className="text-[10px] text-violet-800 text-center leading-[22px]">
                      <KaTeX math={String.raw`${e.label}=${e.value.toFixed(2)}`} />
                    </div>
                  </foreignObject>
                </g>
              )}
            </g>
          );
        })}

        {/* nodes */}
        {nodeKeys.map((key) => {
          const n = nodes[key];
          const hasGrad = Math.abs(n.grad) > 1e-9;
          return (
            <g key={key}>
              <circle cx={n.cx} cy={n.cy} r={28} fill={hasGrad ? '#f3e8ff' : '#eff6ff'} stroke={hasGrad ? '#7c3aed' : '#2563eb'} strokeWidth={2} />
              <text x={n.cx} y={n.cy - 4} textAnchor="middle" fontSize={14} fontWeight={600} fill={hasGrad ? '#5b21b6' : '#1e40af'}>
                {n.label}
              </text>
              <text x={n.cx} y={n.cy + 10} textAnchor="middle" fontSize={11} fill="#374151">
                {n.value.toFixed(2)}
              </text>
              {hasGrad && (
                <g>
                  <rect x={n.cx - 34} y={n.cy + 34} width={68} height={20} rx={4} fill="#ffffff" stroke="#7c3aed" strokeWidth={1} />
                  <foreignObject x={n.cx - 32} y={n.cy + 35} width={64} height={18}>
                    <div className="text-[10px] text-violet-800 text-center leading-[18px]">
                      <KaTeX math={String.raw`\partial L/\partial ${n.label}=${n.grad.toFixed(2)}`} />
                    </div>
                  </foreignObject>
                </g>
              )}
            </g>
          );
        })}

        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#d1d5db" />
          </marker>
          <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#7c3aed" />
          </marker>
        </defs>
      </svg>

      {/* formula cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-sm">
          <p className="font-medium text-gray-700 mb-2">前向计算</p>
          <div className="space-y-1 text-gray-600 font-mono text-xs">
            <p>z = {w[0].toFixed(2)} × {x[0].toFixed(2)} + ({b[0].toFixed(2)}) = {z.toFixed(3)}</p>
            <p>a = σ({z.toFixed(3)}) = {a.toFixed(3)}</p>
            <p>L = ({a.toFixed(3)} − {y[0].toFixed(2)})² = {loss.toFixed(3)}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-sm">
          <p className="font-medium text-gray-700 mb-2">反向梯度</p>
          <div className="space-y-1 text-gray-600 font-mono text-xs">
            <p>∂L/∂a = {dL_da.toFixed(3)}</p>
            <p>∂L/∂z = {dL_da.toFixed(3)} × {da_dz.toFixed(3)} = {dL_dz.toFixed(3)}</p>
            <p>∂L/∂w = {dL_dz.toFixed(3)} × {dz_dw.toFixed(3)} = {dL_dw.toFixed(3)}</p>
            <p>∂L/∂b = {dL_dz.toFixed(3)} × 1 = {dL_db.toFixed(3)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 两层网络反向传播演示                                                      */
/* -------------------------------------------------------------------------- */
function MultiLayerBackpropDemo() {
  const [x, setX] = useState([1.0]);
  const [w1, setW1] = useState([1.2]);
  const [b1, setB1] = useState([-0.5]);
  const [w2, setW2] = useState([1.5]);
  const [b2, setB2] = useState([0.0]);
  const [y, setY] = useState([1.0]);
  const [step, setStep] = useState(0);

  const z1 = w1[0] * x[0] + b1[0];
  const a1 = Math.max(0, z1);
  const z2 = w2[0] * a1 + b2[0];
  const a2 = 1 / (1 + Math.exp(-z2));
  const loss = Math.pow(a2 - y[0], 2);

  const dL_da2 = 2 * (a2 - y[0]);
  const da2_dz2 = a2 * (1 - a2);
  const dL_dz2 = dL_da2 * da2_dz2;
  const dL_dw2 = dL_dz2 * a1;
  const dL_db2 = dL_dz2;

  const dL_da1 = dL_dz2 * w2[0];
  const reluPrime = z1 > 0 ? 1 : 0;
  const dL_dz1 = dL_da1 * reluPrime;
  const dL_dw1 = dL_dz1 * x[0];
  const dL_db1 = dL_dz1;

  const width = 820;
  const height = 340;

  const nodes = {
    x: { cx: 60, cy: 170, label: 'x', value: x[0], grad: 0 },
    w1: { cx: 160, cy: 80, label: 'W⁽¹⁾', value: w1[0], grad: step >= 5 ? dL_dw1 : 0 },
    b1: { cx: 160, cy: 260, label: 'b⁽¹⁾', value: b1[0], grad: step >= 5 ? dL_db1 : 0 },
    z1: { cx: 260, cy: 170, label: 'z₁', value: z1, grad: step >= 4 ? dL_dz1 : 0 },
    a1: { cx: 380, cy: 170, label: 'a₁', value: a1, grad: step >= 3 ? dL_da1 : 0 },
    w2: { cx: 480, cy: 80, label: 'W⁽²⁾', value: w2[0], grad: step >= 5 ? dL_dw2 : 0 },
    b2: { cx: 480, cy: 260, label: 'b⁽²⁾', value: b2[0], grad: step >= 5 ? dL_db2 : 0 },
    z2: { cx: 580, cy: 170, label: 'z₂', value: z2, grad: step >= 2 ? dL_dz2 : 0 },
    a2: { cx: 700, cy: 170, label: 'a₂', value: a2, grad: step >= 1 ? dL_da2 : 0 },
    y: { cx: 700, cy: 260, label: 'y', value: y[0], grad: 0 },
    L: { cx: 760, cy: 170, label: 'L', value: loss, grad: step >= 0 ? 1 : 0 },
  };

  const edges = useMemo(
    () => [
      { from: 'x', to: 'z1', label: '×', show: step >= 0 },
      { from: 'w1', to: 'z1', label: '×', show: step >= 0 },
      { from: 'b1', to: 'z1', label: '+', show: step >= 0 },
      { from: 'z1', to: 'a1', label: 'ReLU', show: step >= 0 },
      { from: 'a1', to: 'z2', label: '×', show: step >= 0 },
      { from: 'w2', to: 'z2', label: '×', show: step >= 0 },
      { from: 'b2', to: 'z2', label: '+', show: step >= 0 },
      { from: 'z2', to: 'a2', label: 'σ', show: step >= 0 },
      { from: 'a2', to: 'L', label: '−', show: step >= 0 },
      { from: 'y', to: 'L', label: '−', show: step >= 0 },
    ],
    [step]
  );

  const gradientEdges = useMemo(
    () => [
      { from: 'L', to: 'a2', label: String.raw`\partial L/\partial a_2`, value: dL_da2, show: step >= 1 },
      { from: 'a2', to: 'z2', label: String.raw`\partial a_2/\partial z_2`, value: da2_dz2, show: step >= 2 },
      { from: 'z2', to: 'a1', label: String.raw`\partial z_2/\partial a_1`, value: w2[0], show: step >= 3 },
      { from: 'a1', to: 'z1', label: String.raw`\partial a_1/\partial z_1`, value: reluPrime, show: step >= 4 },
      { from: 'z1', to: 'w1', label: String.raw`\partial z_1/\partial W^{[1]}`, value: x[0], show: step >= 5 },
      { from: 'z1', to: 'b1', label: String.raw`\partial z_1/\partial b^{[1]}`, value: 1, show: step >= 5 },
    ],
    [step, dL_da2, da2_dz2, w2, reluPrime, x]
  );

  function arrowPath(x1: number, y1: number, x2: number, y2: number, offset = 28) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;
    return {
      sx: x1 + ux * offset,
      sy: y1 + uy * offset,
      ex: x2 - ux * offset,
      ey: y2 - uy * offset,
    };
  }

  const nodeKeys = Object.keys(nodes) as Array<keyof typeof nodes>;

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-5">
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <label className="flex justify-between text-gray-700 mb-1">
            <span>输入 x</span>
            <span className="text-blue-600">{x[0].toFixed(2)}</span>
          </label>
          <Slider min={-2} max={2} step={0.1} value={x} onValueChange={setX} />
        </div>
        <div>
          <label className="flex justify-between text-gray-700 mb-1">
            <span>第一层权重 W⁽¹⁾</span>
            <span className="text-blue-600">{w1[0].toFixed(2)}</span>
          </label>
          <Slider min={-2} max={2} step={0.1} value={w1} onValueChange={setW1} />
        </div>
        <div>
          <label className="flex justify-between text-gray-700 mb-1">
            <span>第一层偏置 b⁽¹⁾</span>
            <span className="text-blue-600">{b1[0].toFixed(2)}</span>
          </label>
          <Slider min={-2} max={2} step={0.1} value={b1} onValueChange={setB1} />
        </div>
        <div>
          <label className="flex justify-between text-gray-700 mb-1">
            <span>第二层权重 W⁽²⁾</span>
            <span className="text-blue-600">{w2[0].toFixed(2)}</span>
          </label>
          <Slider min={-2} max={2} step={0.1} value={w2} onValueChange={setW2} />
        </div>
        <div>
          <label className="flex justify-between text-gray-700 mb-1">
            <span>第二层偏置 b⁽²⁾</span>
            <span className="text-blue-600">{b2[0].toFixed(2)}</span>
          </label>
          <Slider min={-2} max={2} step={0.1} value={b2} onValueChange={setB2} />
        </div>
        <div>
          <label className="flex justify-between text-gray-700 mb-1">
            <span>标签 y</span>
            <span className="text-blue-600">{y[0].toFixed(2)}</span>
          </label>
          <Slider min={0} max={1} step={0.05} value={y} onValueChange={setY} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {[0, 1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              step === s ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {s === 0 && '前向'}
            {s === 1 && '∂L/∂a₂'}
            {s === 2 && '∂L/∂z₂'}
            {s === 3 && '∂L/∂a₁'}
            {s === 4 && '∂L/∂z₁'}
            {s === 5 && '∂L/∂W⁽¹⁾, ∂L/∂b⁽¹⁾'}
          </button>
        ))}
        <button
          onClick={() => setStep(0)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" /> 重置
        </button>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-white rounded-lg border border-gray-200" style={{ maxHeight: 340 }}>
        {/* forward edges */}
        {edges.map((e, idx) => {
          const from = nodes[e.from as keyof typeof nodes];
          const to = nodes[e.to as keyof typeof nodes];
          const { sx, sy, ex, ey } = arrowPath(from.cx, from.cy, to.cx, to.cy);
          return (
            <g key={`f-${idx}`}>
              <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#d1d5db" strokeWidth={2} markerEnd="url(#arrowhead-bp)" />
              <text x={(sx + ex) / 2} y={(sy + ey) / 2 - 6} textAnchor="middle" fontSize={11} fill="#6b7280">
                {e.label}
              </text>
            </g>
          );
        })}

        {/* backward gradient edges */}
        {gradientEdges.map((e, idx) => {
          if (!e.show) return null;
          const from = nodes[e.from as keyof typeof nodes];
          const to = nodes[e.to as keyof typeof nodes];
          const { sx, sy, ex, ey } = arrowPath(from.cx, from.cy, to.cx, to.cy);
          return (
            <g key={`g-${idx}`}>
              <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#7c3aed" strokeWidth={3} strokeDasharray="5 4" markerEnd="url(#arrowhead-bp-active)" />
              <rect x={(sx + ex) / 2 - 48} y={(sy + ey) / 2 + 4} width={96} height={22} rx={4} fill="#f3e8ff" stroke="#7c3aed" strokeWidth={1} />
              <foreignObject x={(sx + ex) / 2 - 46} y={(sy + ey) / 2 + 5} width={92} height={20}>
                <div className="text-[10px] text-violet-800 text-center leading-[20px]">
                  <KaTeX math={String.raw`${e.label}=${e.value.toFixed(2)}`} />
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* nodes */}
        {nodeKeys.map((key) => {
          const n = nodes[key];
          const hasGrad = Math.abs(n.grad) > 1e-9;
          return (
            <g key={key}>
              <circle cx={n.cx} cy={n.cy} r={26} fill={hasGrad ? '#f3e8ff' : '#ffffff'} stroke={hasGrad ? '#7c3aed' : '#2563eb'} strokeWidth={2} />
              <text x={n.cx} y={n.cy - 4} textAnchor="middle" fontSize={13} fontWeight={600} fill={hasGrad ? '#5b21b6' : '#1e40af'}>
                {n.label}
              </text>
              <text x={n.cx} y={n.cy + 10} textAnchor="middle" fontSize={11} fill="#374151">
                {n.value.toFixed(2)}
              </text>
              {hasGrad && (
                <g>
                  <rect x={n.cx - 38} y={n.cy + 32} width={76} height={18} rx={4} fill="#ffffff" stroke="#7c3aed" strokeWidth={1} />
                  <text x={n.cx} y={n.cy + 45} textAnchor="middle" fontSize={10} fill="#5b21b6">
                    {key === 'x' ? '' : `∂L/∂${n.label}=${n.grad.toFixed(2)}`}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        <defs>
          <marker id="arrowhead-bp" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#d1d5db" />
          </marker>
          <marker id="arrowhead-bp-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#7c3aed" />
          </marker>
        </defs>
      </svg>

      <div className="bg-white rounded-lg p-4 border border-gray-200 text-sm">
        <p className="font-medium text-gray-700 mb-2">当前步骤说明</p>
        {step === 0 && <p className="text-gray-600">前向传播：计算每一层的 z 与 a，直到损失 L。</p>}
        {step === 1 && <p className="text-gray-600">从输出开始：先求损失对输出的梯度 ∂L/∂a₂。</p>}
        {step === 2 && <p className="text-gray-600">穿过 Sigmoid：∂L/∂z₂ = ∂L/∂a₂ · ∂a₂/∂z₂，同时可得到 ∂L/∂W⁽²⁾ 与 ∂L/∂b⁽²⁾。</p>}
        {step === 3 && <p className="text-gray-600">传向隐藏层：∂L/∂a₁ = ∂L/∂z₂ · ∂z₂/∂a₁。</p>}
        {step === 4 && <p className="text-gray-600">穿过 ReLU：∂L/∂z₁ = ∂L/∂a₁ · ∂a₁/∂z₁（ReLU 在负数处导数为 0，梯度消失）。</p>}
        {step === 5 && <p className="text-gray-600">到达第一层参数：∂L/∂W⁽¹⁾ = ∂L/∂z₁ · ∂z₁/∂W⁽¹⁾，∂L/∂b⁽¹⁾ = ∂L/∂z₁ · 1。</p>}
      </div>
    </div>
  );
}
