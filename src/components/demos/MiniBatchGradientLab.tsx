import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import PredictionGate from '@/components/PredictionGate';
import { Slider } from '@/components/ui/slider';
import {
  generateGradientPopulation,
  mean,
  populationStandardDeviation,
  rootMeanSquaredError,
  sampleMeanEstimates,
  standardError,
} from '@/lib/math/batchGradient';

const WIDTH = 620;
const HEIGHT = 250;
const MARGIN = { top: 18, right: 18, bottom: 38, left: 48 };
const PLOT_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

export default function MiniBatchGradientLab() {
  const [batchSize, setBatchSize] = useState(8);
  const [seed, setSeed] = useState(17);
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const population = useMemo(
    () => generateGradientPopulation(512, 1.5, 1, 2024),
    [],
  );
  const fullGradient = mean(population);
  const populationStd = populationStandardDeviation(population);
  const estimates = useMemo(
    () => sampleMeanEstimates(population, batchSize, 80, seed),
    [population, batchSize, seed],
  );
  const empiricalRmse = rootMeanSquaredError(estimates, fullGradient);
  const predictedSe = standardError(populationStd, batchSize);
  const domain = 2.2;
  const toX = (value: number) => {
    const raw = MARGIN.left + ((value - (fullGradient - domain)) / (2 * domain)) * PLOT_WIDTH;
    return Math.min(WIDTH - MARGIN.right, Math.max(MARGIN.left, raw));
  };

  return (
    <InteractiveDemo title="Mini-batch 实验：计算量与梯度噪声">
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-gray-700">
          将每个样本贡献的标量梯度视为一个总体，从中反复抽取大小为 B 的 mini-batch。
          点越集中，batch 均值越接近全数据梯度；但标准误只按 1/√B 缩小，因此统计收益会递减。
        </p>

        <PredictionGate
          resetKey="chapter04-mini-batch"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="把 batch size 从 B 扩大到 100B，梯度均值的标准误通常缩小多少倍？"
          hint="独立样本均值的方差与 B 成反比。"
          options={[
            { value: 'ten', label: '缩小 10 倍' },
            { value: 'hundred', label: '缩小 100 倍' },
            { value: 'unchanged', label: '完全不变' },
          ]}
          evaluatePrediction={(answer) => ({
            correct: answer === 'ten',
            category: 'mini-batch 标准误',
            feedback: answer === 'ten'
              ? '正确：SE=σ/√B，所以 B×100 只让标准误 ÷10。'
              : '均值的方差是 σ²/B，标准误是方差开根号后的 σ/√B。',
          })}
          revealContent={
            <p className="text-sm text-gray-700">
              这个 1/√B 规律假设 batch 内样本近似独立同分布；强相关、未打乱的数据会破坏这一简单估计。
            </p>
          }
        />

        {submitted && (
          <div className="space-y-5" aria-label="mini-batch 梯度实验控制区">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span className="flex justify-between">
                  <span>batch size B</span>
                  <span className="font-mono">{batchSize}</span>
                </span>
                <Slider
                  value={[batchSize]}
                  min={1}
                  max={128}
                  step={1}
                  onValueChange={([value]) => setBatchSize(value)}
                />
              </label>
              <button
                type="button"
                onClick={() => setSeed((value) => value + 1)}
                className="rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                重抽 batches（种子 {seed}）
              </button>
            </div>

            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full rounded-lg border bg-gray-50">
              <line
                x1={toX(fullGradient)}
                x2={toX(fullGradient)}
                y1={MARGIN.top}
                y2={HEIGHT - MARGIN.bottom}
                stroke="#059669"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
              {estimates.map((estimate, index) => (
                <circle
                  key={`${seed}-${index}`}
                  cx={toX(estimate)}
                  cy={MARGIN.top + 10 + (index % 10) * (PLOT_HEIGHT - 20) / 9}
                  r="4"
                  fill="#2563eb"
                  opacity="0.55"
                />
              ))}
              <text x={toX(fullGradient) + 6} y={MARGIN.top + 12} fontSize="11" fill="#047857">
                全数据梯度
              </text>
              <rect
                x={MARGIN.left}
                y={MARGIN.top}
                width={PLOT_WIDTH}
                height={PLOT_HEIGHT}
                fill="none"
                stroke="#9ca3af"
              />
            </svg>

            <div className="grid gap-3 sm:grid-cols-3 text-center">
              <div className="rounded-lg bg-emerald-50 p-3">
                <div className="text-xs text-gray-600">全数据梯度</div>
                <div className="font-bold text-emerald-800">{fullGradient.toFixed(3)}</div>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <div className="text-xs text-gray-600">80 次抽样的 RMSE</div>
                <div className="font-bold text-blue-800">{empiricalRmse.toFixed(3)}</div>
              </div>
              <div className="rounded-lg bg-violet-50 p-3">
                <div className="text-xs text-gray-600">理论标准误 σ/√B</div>
                <div className="font-bold text-violet-800">{predictedSe.toFixed(3)}</div>
              </div>
            </div>

            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              同一 batch size 下的具体误差会随抽样改变，但重复实验的典型尺度应接近 σ/√B。
              增大 B 还会改变硬件吞吐和每轮更新次数，不能只依据统计误差选择 batch size。
            </p>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
