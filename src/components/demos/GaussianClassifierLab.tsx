import { useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import PredictionGate from '@/components/PredictionGate';
import { Slider } from '@/components/ui/slider';
import {
  binaryGaussianPosterior,
  sharedVarianceBoundary,
} from '@/lib/math/gaussianClassifier';

const MEAN_0 = -1.5;
const MEAN_1 = 1.5;

export default function GaussianClassifierLab() {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [x, setX] = useState(0);
  const [prior1, setPrior1] = useState(0.5);
  const [sd, setSd] = useState(1);

  const result = binaryGaussianPosterior(x, {
    mean0: MEAN_0,
    mean1: MEAN_1,
    sd0: sd,
    sd1: sd,
    prior1,
  });
  const boundary = sharedVarianceBoundary(MEAN_0, MEAN_1, sd, prior1);
  const predictedClass = result.posterior1 >= result.posterior0 ? 'C₁' : 'C₀';

  return (
    <InteractiveDemo title="高斯生成分类器：先验如何移动决策边界">
      <div className="space-y-6">
        <PredictionGate
          resetKey="gaussian-prior-boundary"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="C₁ 的均值在右侧。若只提高先验 p(C₁)，C₀/C₁ 的决策边界会向哪边移动？"
          hint="先验更大的类别会获得更大的决策区域。"
          options={[
            { value: 'left', label: '向左移动，C₁ 区域扩大' },
            { value: 'right', label: '向右移动，C₁ 区域缩小' },
            { value: 'same', label: '边界不变' },
          ]}
          evaluatePrediction={(answer) => ({
            correct: answer === 'left',
            category: '先验与边界',
            feedback:
              answer === 'left'
                ? '正确。更大的 C₁ 先验意味着需要更少的似然证据就能选择 C₁。'
                : '再看阈值公式：p(C₁) 增大时，log(p(C₀)/p(C₁)) 下降。',
          })}
          revealContent={
            <p className="text-sm text-gray-700">
              共享方差时，边界为{' '}
              <KaTeX math={String.raw`x^*=\frac{\mu_0+\mu_1}{2}+\frac{\sigma^2}{\mu_1-\mu_0}\log\frac{p(C_0)}{p(C_1)}`} />。
              提高 <KaTeX math="p(C_1)" /> 会使对数比下降，因此边界左移。
            </p>
          }
        />

        {submitted && (
          <div className="space-y-5" aria-label="高斯分类器实验控制区">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span className="flex justify-between"><span>观测 x</span><span className="font-mono">{x.toFixed(2)}</span></span>
                <Slider value={[x]} min={-4} max={4} step={0.05} onValueChange={([value]) => setX(value)} />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span className="flex justify-between"><span>先验 p(C₁)</span><span className="font-mono">{prior1.toFixed(2)}</span></span>
                <Slider value={[prior1]} min={0.05} max={0.95} step={0.05} onValueChange={([value]) => setPrior1(value)} />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span className="flex justify-between"><span>共享标准差 σ</span><span className="font-mono">{sd.toFixed(2)}</span></span>
                <Slider value={[sd]} min={0.4} max={2} step={0.05} onValueChange={([value]) => setSd(value)} />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-center">
              <div className="rounded-lg border bg-blue-50 p-3"><div className="text-xs text-gray-600">p(x|C₀)</div><div className="font-bold text-blue-800">{result.likelihood0.toFixed(3)}</div></div>
              <div className="rounded-lg border bg-red-50 p-3"><div className="text-xs text-gray-600">p(x|C₁)</div><div className="font-bold text-red-800">{result.likelihood1.toFixed(3)}</div></div>
              <div className="rounded-lg border bg-violet-50 p-3"><div className="text-xs text-gray-600">p(C₁|x)</div><div className="font-bold text-violet-800">{result.posterior1.toFixed(3)}</div></div>
              <div className="rounded-lg border bg-emerald-50 p-3"><div className="text-xs text-gray-600">当前决策</div><div className="font-bold text-emerald-800">{predictedClass}</div></div>
            </div>

            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
              当前边界 <strong>x* = {boundary.toFixed(3)}</strong>。固定均值后，拖动先验观察边界平移；拖动 σ
              观察类条件分布重叠增大时，先验对边界位置的影响被放大。
            </div>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
