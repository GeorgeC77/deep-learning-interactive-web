import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import KaTeX from '@/components/KaTeX';
import PredictionGate, { type Evaluation } from '@/components/PredictionGate';
import {
  type FlowArchitecture,
  buildRepresentativeJacobian,
  isLowerTriangular,
  isTriangular,
  logDetTriangular,
  hutchinsonTraceEstimate,
  trace,
  estimatedLogDetChange,
  samplingCost,
  densityEvalCost,
} from '@/lib/math/flowArchitecture';

const ARCHITECTURE_OPTIONS: { value: FlowArchitecture; label: string }[] = [
  { value: 'coupling', label: 'Coupling flow' },
  { value: 'autoregressive', label: 'Autoregressive flow' },
  { value: 'continuous', label: 'Continuous flow (FFJORD)' },
];

const ARCHITECTURE_LABELS: Record<FlowArchitecture, string> = {
  coupling: 'Coupling flow',
  autoregressive: 'Autoregressive flow',
  continuous: 'Continuous flow',
};

export default function FlowArchitectureLab() {
  const [architecture, setArchitecture] = useState<FlowArchitecture>('coupling');
  const [dim, setDim] = useState(4);
  const [numSamples, setNumSamples] = useState(32);
  const [seed, setSeed] = useState(123);
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const J = useMemo(
    () => buildRepresentativeJacobian(architecture, dim, seed),
    [architecture, dim, seed],
  );

  const isLower = useMemo(() => isLowerTriangular(J), [J]);
  const isTri = useMemo(() => isTriangular(J), [J]);
  const trueTrace = useMemo(() => trace(J), [J]);
  const estimatedTrace = useMemo(
    () => hutchinsonTraceEstimate(J, numSamples),
    [J, numSamples],
  );
  const exactLogDet = useMemo(
    () => (isTri ? logDetTriangular(J) : null),
    [J, isTri],
  );
  const estimatedLogDet = useMemo(
    () => estimatedLogDetChange(J, numSamples),
    [J, numSamples],
  );

  const handleArchitectureChange = (value: string) => {
    setArchitecture(value as FlowArchitecture);
    setSubmitted(false);
    setRevealed(false);
    setPrediction('');
  };

  const handleDimChange = (value: number) => {
    setDim(value);
    setSubmitted(false);
    setRevealed(false);
    setPrediction('');
  };

  const evaluatePrediction = (pred: string): Evaluation => {
    const normalized = pred.trim().toLowerCase();
    const correctKeywords = ['连续', 'continuous', 'ffjord', '连续流', '自由形式'];
    const isCorrect = correctKeywords.some((kw) => normalized.includes(kw));

    if (isCorrect) {
      return {
        correct: true,
        category: '正确',
        feedback: 'Continuous normalizing flows (FFJORD) 只需要估计 Jacobian 的 trace，因此向量场 f 可以是任意的自由形式神经网络。',
      };
    }

    if (normalized.includes('coupling') || normalized.includes('耦合')) {
      return {
        correct: false,
        category: '混淆了 coupling',
        feedback: 'Coupling flow 必须保持一部分维度不变，并约束变换网络只依赖未变维度，因此不是自由形式的。',
      };
    }

    if (normalized.includes('autoregressive') || normalized.includes('自回归')) {
      return {
        correct: false,
        category: '混淆了 autoregressive',
        feedback: 'Autoregressive flow 必须满足严格的三角形依赖顺序，每个维度只能依赖之前的维度，因此也不是自由形式的。',
      };
    }

    return {
      correct: false,
      category: '需要再思考',
      feedback: '只有 continuous flow / FFJORD 允许 f 为自由形式神经网络，因为它只需要 trace(J) 而无需完整 Jacobian 的结构约束。',
    };
  };

  return (
    <InteractiveDemo title="流架构对比实验：Jacobian、采样与密度计算">
      <div className="space-y-6">
        <div className="text-sm text-gray-600">
          比较三种 2D 正态化流架构的 Jacobian 结构、采样复杂度与密度计算复杂度，并体验
          FFJORD 中使用的 Hutchinson trace 估计。
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">选择架构</span>
            <RadioGroup
              value={architecture}
              onValueChange={handleArchitectureChange}
              className="space-y-2"
            >
              {ARCHITECTURE_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.value} id={`arch-${opt.value}`} />
                  <Label htmlFor={`arch-${opt.value}`} className="text-sm text-gray-700">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>维度 D</span>
              <span>{dim}</span>
            </div>
            <Slider value={[dim]} min={2} max={12} step={1} onValueChange={([v]) => handleDimChange(v)} />
            <div className="text-xs text-gray-500">Coupling / Autoregressive 的 Jacobian 条目随 D 线性增长；Continuous 随 D² 增长。</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Hutchinson 样本数 M</span>
              <span>{numSamples}</span>
            </div>
            <Slider
              value={[numSamples]}
              min={1}
              max={256}
              step={1}
              onValueChange={([v]) => setNumSamples(v)}
            />
            <div className="text-xs text-gray-500">仅对 Continuous flow 的 trace 估计有效。</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSeed((s) => (s + 1) % 10000)}
          >
            重新生成随机 Jacobian
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {ARCHITECTURE_LABELS[architecture]} Jacobian
              </span>
              <span className="text-xs text-gray-500">
                {isLower ? 'lower-triangular' : isTri ? 'triangular' : 'dense'}
              </span>
            </div>
            <JacobianSvg J={J} />
          </div>

          <div className="bg-white border rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium text-gray-700">当前架构指标</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 rounded p-2">
                <div className="text-xs text-gray-500">True trace</div>
                <div className="font-mono font-medium">{trueTrace.toFixed(3)}</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-xs text-gray-500">Hutchinson trace (M={numSamples})</div>
                <div className="font-mono font-medium">{estimatedTrace.toFixed(3)}</div>
              </div>
              {exactLogDet !== null ? (
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-xs text-gray-500">Exact log|det J|</div>
                  <div className="font-mono font-medium">{exactLogDet.toFixed(3)}</div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-xs text-gray-500">Estimated Δ log-det</div>
                  <div className="font-mono font-medium">{estimatedLogDet.toFixed(3)}</div>
                </div>
              )}
              <div className="bg-gray-50 rounded p-2">
                <div className="text-xs text-gray-500">Jacobian 条目数</div>
                <div className="font-mono font-medium">{dim * dim}</div>
              </div>
            </div>

            {architecture === 'continuous' && (
              <div className="text-xs text-gray-600 space-y-1">
                <div>
                  对 dense Jacobian 直接求 log-det 需要 O(D³) 或 O(D²·T)，高维时不可行。
                </div>
                <div>
                  FFJORD 只估计 <KaTeX math="\operatorname{tr}\!\left(\frac{\partial f}{\partial x}\right)" />，
                  将每次前向/反向计算降到 O(D)。
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 border rounded-lg p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-700 border-b">
                <th className="pb-2 font-medium">架构</th>
                <th className="pb-2 font-medium">Jacobian 结构</th>
                <th className="pb-2 font-medium">采样复杂度</th>
                <th className="pb-2 font-medium">密度评估复杂度</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {ARCHITECTURE_OPTIONS.map((opt) => {
                const s = samplingCost(opt.value, dim);
                const d = densityEvalCost(opt.value, dim);
                const isActive = opt.value === architecture;
                return (
                  <tr
                    key={opt.value}
                    className={isActive ? 'bg-blue-50' : ''}
                  >
                    <td className="py-2 font-medium text-gray-800">{opt.label}</td>
                    <td className="py-2">
                      {opt.value === 'coupling' && 'lower / block-triangular'}
                      {opt.value === 'autoregressive' && 'triangular'}
                      {opt.value === 'continuous' && 'dense'}
                    </td>
                    <td className="py-2 font-mono">{s.bigO}</td>
                    <td className="py-2 font-mono">{d.bigO}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-gray-700 space-y-2">
          <div>
            <strong>Coupling flow：</strong>把变量分成两部分，前半直接复制，后半通过只依赖前半的网络变换；
            Jacobian 呈下三角（或块下三角），log-det 为对角块行列式的乘积。
          </div>
          <div>
            <strong>Autoregressive flow：</strong>每个输出维度只依赖按顺序的前面维度；Jacobian 严格三角，
            行列式同样是对角元素的乘积。
          </div>
          <div>
            <strong>Continuous flow：</strong>通过 ODE <KaTeX math="\frac{dx}{dt}=f(x,t)" /> 定义变换；
            <KaTeX math="f" /> 可以是任意神经网络，log-det 变化由
            <KaTeX math="\operatorname{tr}(\partial f/\partial x)" /> 沿时间积分得到。
          </div>
          <KaTeX
            math={String.raw`\ln p_1(x(1)) = \ln p_0(x(0)) - \int_0^1 \operatorname{tr}\!\left(\frac{\partial f}{\partial x}(x(t),t)\right)\,dt`}
            display
            className="bg-white border rounded-lg p-3"
          />
        </div>

        <PredictionGate
          resetKey={`${architecture}-${dim}`}
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((r) => !r)}
          canReveal={submitted}
          question="哪种流架构允许向量场 f 是自由形式（free-form）神经网络而无需可逆层设计？"
          hint="思考哪种架构不需要完整计算 dense Jacobian，而只需要它的 trace。"
          evaluatePrediction={evaluatePrediction}
          revealContent={
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <strong>答案：Continuous flow / FFJORD。</strong>
              </div>
              <div>
                Coupling 与 autoregressive flow 都依赖特殊的网络结构（耦合层或自回归掩码）来保证 Jacobian
                是三角/块三角的，从而快速计算行列式。Continuous flow 则不同：它通过 Hutchinson 估计
                <KaTeX math="\operatorname{tr}(\partial f/\partial x)" />，
                因此向量场 <KaTeX math="f" /> 可以是任何可微神经网络。
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium mb-2">反例：维度扩展与计算复杂度对比（迁移/转移挑战）</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white border rounded p-2">
                    <div className="text-gray-500">Coupling entries</div>
                    <div className="font-mono font-medium">{dim * dim}</div>
                  </div>
                  <div className="bg-white border rounded p-2">
                    <div className="text-gray-500">Autoregressive entries</div>
                    <div className="font-mono font-medium">{dim * dim}</div>
                  </div>
                  <div className="bg-white border rounded p-2">
                    <div className="text-gray-500">Continuous dense entries</div>
                    <div className="font-mono font-medium">{dim * dim}</div>
                  </div>
                </div>
                <div className="mt-2">
                  虽然三种架构的完整 Jacobian 都有 D² 个元素，但 coupling/autoregressive 的非零元素只有 O(D) 个，
                  而 continuous flow 是稠密的。FFJORD 用 trace 估计把每次 ODE 步的 Jacobian 开销从 O(D²) 降到 O(M·D)。
                </div>
              </div>
            </div>
          }
        />
      </div>
    </InteractiveDemo>
  );
}

function JacobianSvg({ J }: { J: number[][] }) {
  const n = J.length;
  const size = Math.min(280, 36 * n);
  const cellSize = size / n;
  const maxAbs = Math.max(
    1e-6,
    ...J.flat().map((v) => Math.abs(v)),
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="border rounded bg-white"
    >
      {J.map((row, i) =>
        row.map((val, j) => {
          const intensity = Math.abs(val) / maxAbs;
          const isDiag = i === j;
          const fill = isDiag
            ? `rgba(239, 68, 68, ${0.2 + 0.6 * intensity})`
            : intensity > 0.01
              ? `rgba(59, 130, 246, ${0.3 + 0.5 * intensity})`
              : '#f9fafb';
          return (
            <rect
              key={`${i}-${j}`}
              x={j * cellSize}
              y={i * cellSize}
              width={cellSize - 1}
              height={cellSize - 1}
              fill={fill}
              stroke="#e5e7eb"
              strokeWidth={0.5}
            />
          );
        }),
      )}
    </svg>
  );
}
