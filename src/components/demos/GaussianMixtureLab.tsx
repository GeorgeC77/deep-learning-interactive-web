import { useCallback, useMemo, useState } from 'react';
import PredictionGate, { type Evaluation } from '@/components/PredictionGate';
import { Slider } from '@/components/ui/slider';
import {
  componentContributions,
  mixtureDensity1D,
  mixtureMoments1D,
  responsibilities1D,
  type Gaussian1DComponent,
} from '@/lib/math/gmm';

const MEANS = [-1.5, 1.5] as const;
const SIGMAS = [0.7, 1.2] as const;

export default function GaussianMixtureLab() {
  const [x, setX] = useState(0);
  const [firstWeight, setFirstWeight] = useState(0.35);
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const components = useMemo<Gaussian1DComponent[]>(
    () => [
      { weight: firstWeight, mean: MEANS[0], sigma: SIGMAS[0] },
      { weight: 1 - firstWeight, mean: MEANS[1], sigma: SIGMAS[1] },
    ],
    [firstWeight],
  );
  const contributions = useMemo(() => componentContributions(x, components), [x, components]);
  const responsibilities = useMemo(() => responsibilities1D(x, components), [x, components]);
  const density = useMemo(() => mixtureDensity1D(x, components), [x, components]);
  const moments = useMemo(() => mixtureMoments1D(components), [components]);
  const correctComponent = responsibilities[0] >= responsibilities[1] ? 0 : 1;
  const resetKey = `${x.toFixed(2)}-${firstWeight.toFixed(2)}`;

  const resetGate = useCallback(() => {
    setPrediction('');
    setSubmitted(false);
    setRevealed(false);
  }, []);

  const changeX = (value: number) => {
    setX(value);
    resetGate();
  };

  const changeWeight = (value: number) => {
    setFirstWeight(value);
    resetGate();
  };

  const evaluatePrediction = (answer: string): Evaluation => {
    const selected = Number(answer);
    if (selected === correctComponent) {
      return {
        correct: true,
        category: '联合考虑先验与似然',
        feedback: '责任度比较的是 πₖN(x|μₖ,σₖ²)，而不只是“离哪个均值更近”。',
      };
    }

    const nearest = Math.abs(x - MEANS[0]) <= Math.abs(x - MEANS[1]) ? 0 : 1;
    return {
      correct: false,
      category: selected === nearest ? '只看均值距离' : '忽略归一化贡献',
      feedback: '请把分量在 x 处的高斯密度乘以混合权重，再比较两个未归一化贡献。',
    };
  };

  return (
    <div className="space-y-6" aria-label="高斯混合责任度实验">
      <p className="text-sm leading-relaxed text-gray-700">
        固定两个高斯分量的均值与标准差，先调节观测位置和先验混合权重，再预测哪个分量对该样本承担更大责任。提交后才会显示软分配结果。
      </p>

      <div className="grid gap-4 rounded-xl border bg-gray-50 p-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700">观测位置 x = {x.toFixed(2)}</label>
          <Slider
            className="mt-3"
            value={[x]}
            min={-4}
            max={4}
            step={0.1}
            disabled={submitted}
            onValueChange={([value]) => changeX(value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">分量 1 权重 π₁ = {firstWeight.toFixed(2)}</label>
          <Slider
            className="mt-3"
            value={[firstWeight]}
            min={0.1}
            max={0.9}
            step={0.05}
            disabled={submitted}
            onValueChange={([value]) => changeWeight(value)}
          />
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
          分量 1：μ₁={MEANS[0]}，σ₁={SIGMAS[0]}，π₁={firstWeight.toFixed(2)}
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          分量 2：μ₂={MEANS[1]}，σ₂={SIGMAS[1]}，π₂={(1 - firstWeight).toFixed(2)}
        </div>
      </div>

      <PredictionGate
        resetKey={resetKey}
        prediction={prediction}
        onPredictionChange={setPrediction}
        submitted={submitted}
        onSubmit={() => setSubmitted(true)}
        revealed={revealed}
        onReveal={() => setRevealed((value) => !value)}
        canReveal={submitted}
        question="哪个高斯分量对当前样本的后验责任度更大？"
        hint="先算各自的未归一化贡献 πₖN(x|μₖ,σₖ²)，再归一化。窄分量在均值附近可能拥有更高峰值。"
        options={[
          { value: '0', label: '分量 1 的责任度更大' },
          { value: '1', label: '分量 2 的责任度更大' },
        ]}
        evaluatePrediction={evaluatePrediction}
        revealContent={
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid gap-3 md:grid-cols-2">
              {responsibilities.map((responsibility, index) => (
                <div key={index} className="rounded-lg border bg-gray-50 p-3">
                  <div className="flex justify-between"><span>分量 {index + 1}</span><strong>{(responsibility * 100).toFixed(1)}%</strong></div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
                    <div className={index === 0 ? 'h-full bg-blue-500' : 'h-full bg-emerald-500'} style={{ width: `${responsibility * 100}%` }} />
                  </div>
                  <p className="mt-2 font-mono text-xs">πₖNₖ(x) = {contributions[index].toFixed(5)}</p>
                </div>
              ))}
            </div>
            <p className="rounded-lg bg-indigo-50 p-3 font-mono text-indigo-900">
              p(x) = ΣₖπₖNₖ(x) = {density.toFixed(5)}；E[X] = {moments.mean.toFixed(3)}；Var[X] = {moments.variance.toFixed(3)}
            </p>
            <p>责任度之和为 {responsibilities.reduce((sum, value) => sum + value, 0).toFixed(6)}。改变标签编号不会改变混合密度，这正是 GMM 的标签不可识别性。</p>
          </div>
        }
      />
    </div>
  );
}
