import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import KaTeX from '@/components/KaTeX';
import PredictionGate, { type Evaluation } from '@/components/PredictionGate';
import { ganMetrics } from '@/lib/math/gan';

const PRESETS = [
  { label: 'discriminator too strong', labelZh: '判别器过强（D≈0）', a: -5 },
  { label: 'balanced game', labelZh: '势均力敌（D≈0.5）', a: 0 },
  { label: 'discriminator confident real', labelZh: '判别器确信生成样本为真（D≈1）', a: 5 },
];

const A_MIN = -5;
const A_MAX = 5;
const A_STEP = 0.01;

function fmt(x: number): string {
  return Number.isFinite(x) ? x.toFixed(3) : '—';
}

function MagnitudeBar({ value, colorClass }: { value: number; colorClass: string }) {
  const magnitude = Math.abs(value);
  // Cap the displayed bar so extreme values do not overflow the container.
  const widthPct = Math.min(100, magnitude * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-3 bg-gray-200 rounded overflow-hidden">
        <div
          className={`h-full ${colorClass}`}
          style={{ width: `${widthPct}%` }}
        />
      </div>
      <span className="w-20 text-right text-xs text-gray-600">{fmt(value)}</span>
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 text-center">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-lg font-bold text-blue-700">{fmt(value)}</div>
    </div>
  );
}

export default function GANGradientLab() {
  const [a, setA] = useState(0);
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const [deltaA, setDeltaA] = useState(0);
  const [transferPrediction, setTransferPrediction] = useState('');
  const [transferSubmitted, setTransferSubmitted] = useState(false);
  const [transferRevealed, setTransferRevealed] = useState(false);

  const metrics = useMemo(() => ganMetrics(a), [a]);
  const transferMetrics = useMemo(() => ganMetrics(a + deltaA), [a, deltaA]);

  const handlePreset = (nextA: number) => {
    setA(nextA);
    setPrediction('');
    setSubmitted(false);
    setRevealed(false);
  };

  const evaluateMainPrediction = (pred: string): Evaluation => {
    if (pred === 'non-saturating') {
      return {
        correct: true,
        category: '正确',
        feedback: '答对了。当 D 接近 0 时，non-saturating 损失的导数约为 -1，而 minimax 导数接近 0。',
      };
    }
    if (pred === 'minimax') {
      return {
        correct: false,
        category: '方向相反',
        feedback: '当 D 接近 0 时，minimax 导数 -D 也接近 0，梯度会消失；non-saturating 导数 -(1-D) 仍接近 -1。',
      };
    }
    return {
      correct: false,
      category: '需要更明确',
      feedback: '请选择 minimax 或 non-saturating。正确答案是 non-saturating。',
    };
  };

  const evaluateTransferPrediction = (pred: string): Evaluation => {
    const lower = pred.toLowerCase();
    const change = transferMetrics.gradNonSaturatingLogit - metrics.gradNonSaturatingLogit;
    const positive = change > 0;
    const negative = change < 0;

    const saidPositive =
      lower.includes('更不负') ||
      lower.includes('增大') ||
      lower.includes('增加') ||
      lower.includes('positive') ||
      lower.includes('less negative');
    const saidNegative =
      lower.includes('更负') ||
      lower.includes('减小') ||
      lower.includes('减少') ||
      lower.includes('negative') ||
      lower.includes('more negative');

    if ((positive && saidPositive && !saidNegative) || (negative && saidNegative && !saidPositive)) {
      return {
        correct: true,
        category: '正确',
        feedback: `正确。当 a 增大时 D 增大，(1-D) 减小，梯度 ${positive ? '变得不那么负（增大）' : '变得更负（减小）'}。`,
      };
    }
    return {
      correct: false,
      category: '方向判断',
      feedback: `实际上，当 a 增加 Δa 时，D 会增大，因此 |dL_NS/da| = 1-D 会减小，梯度变得更不负（变化量为正）。`,
    };
  };

  return (
    <InteractiveDemo title="GAN 梯度实验：minimax vs non-saturating">
      <div className="space-y-6 text-sm text-gray-700">
        <div>
          设判别器对生成样本的输出为 <KaTeX math={String.raw`D(G(z)) = \sigma(a)`} />，其中{' '}
          <KaTeX math="a" /> 是判别器最后一层的 logit。两种生成器损失为：
        </div>
        <div className="flex flex-wrap gap-4 text-gray-800">
          <span className="font-mono bg-gray-100 rounded px-2 py-1">
            <KaTeX math={String.raw`L_{\text{MM}} = \log(1-D)`} />
          </span>
          <span className="font-mono bg-gray-100 rounded px-2 py-1">
            <KaTeX math={String.raw`L_{\text{NS}} = -\log D`} />
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            判别器 logit <KaTeX math="a" />: {a.toFixed(2)}
            <span className="ml-2 text-gray-500">
              (D = {fmt(metrics.D)})
            </span>
          </label>
          <Slider
            value={[a]}
            min={A_MIN}
            max={A_MAX}
            step={A_STEP}
            onValueChange={([v]) => setA(v)}
          />
          <div className="flex flex-wrap gap-2 pt-1">
            {PRESETS.map((p) => (
              <Button
                key={p.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset(p.a)}
              >
                {p.labelZh}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricBox label="D(G(z))" value={metrics.D} />
          <MetricBox label="minimax L_MM" value={metrics.minimax} />
          <MetricBox label="non-saturating L_NS" value={metrics.nonSaturating} />
          <MetricBox label="a" value={metrics.a} />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="font-medium text-gray-800">梯度大小对比</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-4">损失</th>
                  <th className="py-2 pr-4">
                    导数 <KaTeX math={String.raw`\partial L/\partial a`} />
                  </th>
                  <th className="py-2 pr-4">
                    下降方向 <KaTeX math={String.raw`-\partial L/\partial a`} />
                  </th>
                  <th className="py-2 pr-4">期望 Δa</th>
                  <th className="py-2 pr-4">期望 ΔD</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium">minimax</td>
                  <td className="py-2 pr-4">
                    <MagnitudeBar value={metrics.gradMinimaxLogit} colorClass="bg-rose-500" />
                  </td>
                  <td className="py-2 pr-4">
                    <MagnitudeBar value={-metrics.gradMinimaxLogit} colorClass="bg-rose-300" />
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs">{fmt(-metrics.gradMinimaxLogit)}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{fmt(metrics.D * (1 - metrics.D) * (-metrics.gradMinimaxLogit))}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">non-saturating</td>
                  <td className="py-2 pr-4">
                    <MagnitudeBar value={metrics.gradNonSaturatingLogit} colorClass="bg-emerald-500" />
                  </td>
                  <td className="py-2 pr-4">
                    <MagnitudeBar value={-metrics.gradNonSaturatingLogit} colorClass="bg-emerald-300" />
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs">{fmt(-metrics.gradNonSaturatingLogit)}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{fmt(metrics.D * (1 - metrics.D) * (-metrics.gradNonSaturatingLogit))}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-xs text-gray-500">
            负导数意味着梯度下降会提高 logit a，从而提高 D(G(z))。 descent direction = -∂L/∂a。
          </div>
        </div>

        <PredictionGate
          resetKey={a}
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((r) => !r)}
          canReveal={submitted}
          question="当 D(G(z)) 接近 0 时，哪种生成器损失的导数 ∂L/∂a 更负：minimax 还是 non-saturating？"
          hint="观察左侧表格在 D 接近 0 时的导数：minimax 是 -D，non-saturating 是 -(1-D)。"
          evaluatePrediction={evaluateMainPrediction}
          options={[
            { value: 'non-saturating', label: 'non-saturating' },
            { value: 'minimax', label: 'minimax' },
          ]}
          revealContent={
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                当 <KaTeX math={String.raw`D \to 0`} /> 时：
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  minimax 梯度{' '}
                  <KaTeX math={String.raw`\partial L_{\text{MM}}/\partial a = -D \to 0`} />，
                  因此生成器几乎学不到信号；
                </li>
                <li>
                  non-saturating 梯度{' '}
                  <KaTeX math={String.raw`\partial L_{\text{NS}}/\partial a = -(1-D) \to -1`} />，
                  仍有强烈的更新信号。
                </li>
              </ul>
              <div>
                点击“判别器过强”预设即可看到这个反例：minimax 梯度几乎消失，而 non-saturating
                梯度仍接近 -1。
              </div>
            </div>
          }
        />

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="font-bold text-gray-900">迁移挑战：logit 偏移对梯度的影响</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              logit 偏移 <KaTeX math={String.raw`\Delta a`} />: {deltaA.toFixed(2)}
            </label>
            <Slider
              value={[deltaA]}
              min={-2}
              max={2}
              step={0.01}
              onValueChange={([v]) => setDeltaA(v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MetricBox label="当前 dL_NS/da" value={metrics.gradNonSaturatingLogit} />
            <MetricBox label="偏移后 dL_NS/da" value={transferMetrics.gradNonSaturatingLogit} />
          </div>

          <PredictionGate
            resetKey={`${a}-${deltaA}`}
            prediction={transferPrediction}
            onPredictionChange={setTransferPrediction}
            submitted={transferSubmitted}
            onSubmit={() => setTransferSubmitted(true)}
            revealed={transferRevealed}
            onReveal={() => setTransferRevealed((r) => !r)}
            canReveal={transferSubmitted}
            question={`当前 a = ${a.toFixed(2)}，若把 logit 增加 Δa = ${deltaA.toFixed(2)}，non-saturating 梯度会变得更负还是更不负？`}
            hint="回忆 dL_NS/da = -(1-D)，而 D = σ(a) 随 a 增大而增大。"
            evaluatePrediction={evaluateTransferPrediction}
            revealContent={
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  偏移后 <KaTeX math={`a' = ${(a + deltaA).toFixed(2)}`} />，
                  对应 <KaTeX math={`D' = \\sigma(a') = ${fmt(transferMetrics.D)}`} />。
                </div>
                <div>
                  因为 <KaTeX math="D" /> 随 <KaTeX math="a" /> 单调递增，
                  所以 <KaTeX math="1-D" /> 随 <KaTeX math="a" /> 递减，
                  进而 <KaTeX math={String.raw`\partial L_{\text{NS}}/\partial a = -(1-D)`} />{' '}
                  会变得<strong>更不负</strong>（绝对值减小）。
                </div>
              </div>
            }
          />
        </div>
      </div>
    </InteractiveDemo>
  );
}
