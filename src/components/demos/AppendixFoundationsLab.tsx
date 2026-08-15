import { useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import PredictionGate, { type Evaluation } from '@/components/PredictionGate';
import { Slider } from '@/components/ui/slider';

type AppendixKey = 'a' | 'b' | 'c';

function TraceCycleLab() {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [s, setS] = useState(1);

  const cyclicTrace = 2 + s;
  const swappedTrace = 2 + 3 * s;
  const evaluate = (value: string): Evaluation => ({
    correct: value === 'cyclic-only',
    category: '迹的循环性质',
    feedback: value === 'cyclic-only'
      ? '正确。迹保持循环置换 ABC→BCA→CAB，但矩阵不可任意交换，BAC 一般不同。'
      : '矩阵乘法不交换；迹只允许整段循环移动，不能把 A 与 B 任意对调。',
  });

  return (
    <InteractiveDemo title="附录 A 实验：循环置换不等于任意交换">
      <div className="space-y-6 text-sm text-gray-700">
        <PredictionGate
          resetKey="appendix-a-trace-cycle"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="对三个一般方阵 A、B、C，Tr(ABC) 是否对任意排列都保持不变？"
          hint="教材式 (A.9) 列出的三个次序有什么共同点？"
          evaluatePrediction={evaluate}
          options={[
            { value: 'all', label: '是，任意排列都保持' },
            { value: 'cyclic-only', label: '否，只有循环置换恒保持' },
            { value: 'none', label: '否，连循环置换也不保持' },
          ]}
          revealContent={<p>循环置换保持每个因子的相对先后关系；交换两个相邻因子会破坏这个次序。</p>}
        />

        {revealed && (
          <div aria-label="迹循环置换实验区" className="space-y-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>矩阵 A 的非对角元素 s</span><span>{s.toFixed(1)}</span>
              </div>
              <Slider value={[s]} min={0.5} max={2} step={0.1} onValueChange={([value]) => setS(value)} />
            </div>
            <div className="overflow-x-auto rounded-lg border bg-white p-3">
              <KaTeX math={`A=\\begin{pmatrix}1&${s.toFixed(1)}\\\\0&2\\end{pmatrix},\\;B=\\begin{pmatrix}2&1\\\\1&0\\end{pmatrix},\\;C=\\begin{pmatrix}1&0\\\\0&3\\end{pmatrix}`} display />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs text-emerald-700">循环置换</p>
                <p className="font-mono font-semibold">Tr(ABC)=Tr(BCA)=Tr(CAB)={cyclicTrace.toFixed(2)}</p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs text-amber-700">交换 A、B</p>
                <p className="font-mono font-semibold">Tr(BAC)={swappedTrace.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}

function VariationBoundaryLab() {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [k, setK] = useState(1);
  const residualFactor = 1 - k * k;

  const evaluate = (value: string): Evaluation => ({
    correct: value === 'must-vanish',
    category: '变分边界条件',
    feedback: value === 'must-vanish'
      ? '正确。固定 y 的端点意味着允许的扰动 η 在边界为零，分部积分的边界项才消失。'
      : '若 η 在边界不为零，分部积分会留下边界项，必须额外处理自然边界条件。',
  });

  return (
    <InteractiveDemo title="附录 B 实验：边界条件如何进入 Euler–Lagrange 方程">
      <div className="space-y-6 text-sm text-gray-700">
        <PredictionGate
          resetKey="appendix-b-boundary"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="推导式 (B.8) 时，若 y 的端点固定，扰动 η(x) 在积分边界必须满足什么？"
          hint="y+εη 仍要保持与 y 相同的端点值。"
          evaluatePrediction={evaluate}
          options={[
            { value: 'must-vanish', label: 'η 在边界必须为 0' },
            { value: 'arbitrary', label: 'η 在边界可以任意非零' },
            { value: 'constant-one', label: 'η 在整个区间必须恒为 1' },
          ]}
          revealContent={<p>教材由式 (B.6) 到 (B.7) 的关键正是分部积分和固定端点；少掉这个前提，Euler–Lagrange 方程仍不构成完整边界值问题。</p>}
        />

        {revealed && (
          <div aria-label="Euler-Lagrange 残差实验区" className="space-y-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <p>取教材示例 <KaTeX math="G=y^2+(y')^2" />，Euler–Lagrange 方程为 <KaTeX math="y-y''=0" />。用候选族 <KaTeX math="y=e^{kx}" /> 检查残差：</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600"><span>指数系数 k</span><span>{k.toFixed(2)}</span></div>
              <Slider value={[k]} min={-2} max={2} step={0.05} onValueChange={([value]) => setK(value)} />
            </div>
            <div className={`rounded-lg border p-4 ${Math.abs(residualFactor) < 1e-9 ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
              <KaTeX math={`y-y''=(1-k^2)e^{kx}=${residualFactor.toFixed(3)}e^{${k.toFixed(2)}x}`} display />
              <p className="text-center text-xs text-gray-600">{Math.abs(residualFactor) < 1e-9 ? '残差为零：该候选满足微分方程。' : '残差非零：该候选不是驻函数解。'}</p>
            </div>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}

function LagrangeGeometryLab() {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [x1, setX1] = useState(0.5);
  const x2 = 1 - x1;
  const objective = 1 - x1 * x1 - x2 * x2;
  const tangentDerivative = 2 - 4 * x1;

  const evaluate = (value: string): Evaluation => ({
    correct: value === 'half-half',
    category: '等式约束驻点',
    feedback: value === 'half-half'
      ? '正确。对称性与驻点方程都给出 x₁=x₂，再由 x₁+x₂=1 得到 (1/2,1/2)。'
      : '候选点必须先满足 x₁+x₂=1；沿约束线比较目标可见均分时平方和最小，因此 f 最大。',
  });

  return (
    <InteractiveDemo title="附录 C 实验：沿约束曲面寻找驻点">
      <div className="space-y-6 text-sm text-gray-700">
        <PredictionGate
          resetKey="appendix-c-stationary-point"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="最大化 f=1−x₁²−x₂²，约束 x₁+x₂−1=0。驻点在哪里？"
          hint="目标与约束对 x₁、x₂ 都是对称的。"
          evaluatePrediction={evaluate}
          options={[
            { value: 'half-half', label: '(x₁,x₂)=(1/2,1/2)' },
            { value: 'one-zero', label: '(x₁,x₂)=(1,0)' },
            { value: 'zero-zero', label: '(x₁,x₂)=(0,0)' },
          ]}
          revealContent={<p>教材式 (C.6)–(C.8) 同时求解 ∇x𝓛=0 与 ∂𝓛/∂λ=0，得到 x₁=x₂=1/2、λ=1。</p>}
        />

        {revealed && (
          <div aria-label="拉格朗日约束实验区" className="space-y-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600"><span>沿 x₁+x₂=1 移动</span><span>x₁={x1.toFixed(2)}，x₂={x2.toFixed(2)}</span></div>
              <Slider value={[x1]} min={-0.5} max={1.5} step={0.05} onValueChange={([value]) => setX1(value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border bg-white p-3"><p className="text-xs text-gray-500">约束残差</p><p className="font-mono font-semibold">{(x1 + x2 - 1).toFixed(2)}</p></div>
              <div className="rounded-lg border bg-white p-3"><p className="text-xs text-gray-500">目标 f</p><p className="font-mono font-semibold">{objective.toFixed(3)}</p></div>
              <div className="rounded-lg border bg-white p-3"><p className="text-xs text-gray-500">沿约束方向导数</p><p className="font-mono font-semibold">{tangentDerivative.toFixed(3)}</p></div>
            </div>
            <p className="text-xs text-gray-600">x₁=0.5 时沿约束线的导数为 0；此时 ∇f 与 ∇g 平行，正是拉格朗日乘子几何条件。</p>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}

export default function AppendixFoundationsLab({ appendix }: { appendix: AppendixKey }) {
  if (appendix === 'a') return <TraceCycleLab />;
  if (appendix === 'b') return <VariationBoundaryLab />;
  return <LagrangeGeometryLab />;
}
