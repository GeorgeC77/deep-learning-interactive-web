import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import {
  binaryCrossEntropy,
  binaryCrossEntropyLogitGradient,
  binarySquaredError,
  binarySquaredErrorLogitGradient,
  sigmoidFromLogit,
} from '@/lib/math/neuralLosses';

type LossKey = 'crossEntropy' | 'squaredError';

export default function ErrorFunctionLab() {
  const [selected, setSelected] = useState<LossKey>('crossEntropy');
  const [logit, setLogit] = useState(0);
  const [target, setTarget] = useState<0 | 1>(1);
  const probability = sigmoidFromLogit(logit);
  const loss = selected === 'crossEntropy'
    ? binaryCrossEntropy(probability, target)
    : binarySquaredError(probability, target);
  const gradient = selected === 'crossEntropy'
    ? binaryCrossEntropyLogitGradient(logit, target)
    : binarySquaredErrorLogitGradient(logit, target);
  const points = useMemo(
    () => Array.from({ length: 241 }, (_, index) => {
      const a = -6 + index * 0.05;
      const p = sigmoidFromLogit(a);
      const value = selected === 'crossEntropy'
        ? binaryCrossEntropy(p, target)
        : binarySquaredError(p, target);
      return { a, value: Math.min(6, value) };
    }),
    [selected, target],
  );

  const width = 600;
  const height = 260;
  const margin = { top: 16, right: 16, bottom: 36, left: 44 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const toX = (value: number) => margin.left + ((value + 6) / 12) * plotWidth;
  const toY = (value: number) => margin.top + (1 - value / 6) * plotHeight;

  return (
    <InteractiveDemo title="误差函数实验：比较对 logit 的训练信号">
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-gray-700">
          为避免混淆，横轴使用 sigmoid 之前的 logit a，红色指标统一显示真正反向传播的量 ∂E/∂a。
          当标签 t=1 而 a 很负时，交叉熵仍给出接近 -1 的纠正信号；平方误差还要乘 sigmoid 导数，可能接近 0。
        </p>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setSelected('crossEntropy')} className={`rounded-lg border px-3 py-2 text-sm ${selected === 'crossEntropy' ? 'bg-emerald-600 text-white' : 'bg-white'}`}>二分类交叉熵</button>
          <button type="button" onClick={() => setSelected('squaredError')} className={`rounded-lg border px-3 py-2 text-sm ${selected === 'squaredError' ? 'bg-blue-600 text-white' : 'bg-white'}`}>sigmoid + 平方误差</button>
          <button type="button" onClick={() => setTarget(target === 1 ? 0 : 1)} className="rounded-lg border bg-white px-3 py-2 text-sm">切换标签：t={target}</button>
        </div>

        <label className="space-y-2 text-sm font-medium text-gray-700">
          <span className="flex justify-between"><span>logit a</span><span className="font-mono">{logit.toFixed(2)}</span></span>
          <Slider value={[logit]} min={-6} max={6} step={0.05} onValueChange={([value]) => setLogit(value)} />
        </label>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full rounded-lg border bg-gray-50">
          <polyline points={points.map((point) => `${toX(point.a)},${toY(point.value)}`).join(' ')} fill="none" stroke={selected === 'crossEntropy' ? '#059669' : '#2563eb'} strokeWidth="2.5" />
          <line x1={toX(logit)} y1={margin.top} x2={toX(logit)} y2={height - margin.bottom} stroke="#dc2626" strokeDasharray="4 3" />
          <circle cx={toX(logit)} cy={toY(Math.min(6, loss))} r="5" fill="#dc2626" />
          <rect x={margin.left} y={margin.top} width={plotWidth} height={plotHeight} fill="none" stroke="#9ca3af" />
        </svg>

        <div className="grid gap-3 sm:grid-cols-3 text-center">
          <div className="rounded-lg bg-violet-50 p-3"><div className="text-xs text-gray-600">概率 σ(a)</div><div className="font-bold text-violet-800">{probability.toFixed(5)}</div></div>
          <div className="rounded-lg bg-blue-50 p-3"><div className="text-xs text-gray-600">损失 E</div><div className="font-bold text-blue-800">{loss.toFixed(5)}</div></div>
          <div className="rounded-lg bg-red-50 p-3"><div className="text-xs text-gray-600">训练梯度 ∂E/∂a</div><div className="font-bold text-red-800">{gradient.toFixed(5)}</div></div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
