import { useCallback, useMemo, useState } from 'react';
import PredictionGate, { type Evaluation } from '@/components/PredictionGate';
import { Slider } from '@/components/ui/slider';
import { gaussianKdeAt } from '@/lib/math/prerequisiteProbability';

const samples = [-1.4, -1.15, -0.9, 0.75, 1.0, 1.25];

export default function KdeBandwidthPredictionLab({ onUnlock }: { onUnlock?: () => void }) {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [bandwidth, setBandwidth] = useState(0.35);
  const changePrediction = useCallback((value: string) => setPrediction(value), []);
  const toggleReveal = useCallback(() => setRevealed((value) => !value), []);

  const path = useMemo(() => {
    const width = 620;
    const height = 180;
    const points = Array.from({ length: 121 }, (_, index) => {
      const x = -3 + index * 0.05;
      const density = gaussianKdeAt(samples, x, bandwidth);
      return `${(index / 120) * width},${height - Math.min(density, 0.8) / 0.8 * 150}`;
    });
    return `M ${points.join(' L ')}`;
  }, [bandwidth]);

  const evaluatePrediction = (answer: string): Evaluation => ({
    correct: answer === 'smooth',
    category: answer === 'sharp' ? '方向判断相反' : '正确识别偏差—方差权衡',
    feedback: answer === 'smooth'
      ? '更大的邻域平均了更多样本波动，但也可能合并相邻峰。'
      : '带宽越大，每个样本核覆盖越宽，局部尖峰会被平均而不是增强。',
  });

  return (
    <div className="space-y-4" aria-label="KDE 带宽预测实验">
      <PredictionGate
        resetKey="kde-bandwidth-direction"
        prediction={prediction}
        onPredictionChange={changePrediction}
        submitted={submitted}
        onSubmit={() => {
          setSubmitted(true);
          onUnlock?.();
        }}
        revealed={revealed}
        onReveal={toggleReveal}
        canReveal={submitted}
        question="保持样本不变，把 KDE 带宽 h 从 0.2 增大到 1.0，估计曲线通常会怎样？"
        hint="带宽决定一个样本会影响多宽的邻域。"
        options={[
          { value: 'smooth', label: '更平滑，方差降低但偏差可能升高' },
          { value: 'sharp', label: '出现更多尖峰，方差升高' },
          { value: 'same', label: '曲线完全不变' },
        ]}
        evaluatePrediction={evaluatePrediction}
        revealContent={
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">验证带宽 h = {bandwidth.toFixed(2)}</label>
            <Slider value={[bandwidth]} min={0.15} max={1.2} step={0.05} onValueChange={([value]) => setBandwidth(value)} />
            <svg viewBox="0 0 620 180" className="w-full rounded-lg bg-slate-50" role="img" aria-label="核密度曲线">
              <line x1="0" y1="170" x2="620" y2="170" stroke="#94a3b8" />
              <path d={path} fill="none" stroke="#7c3aed" strokeWidth="3" />
              {samples.map((sample, index) => (
                <circle key={`${sample}-${index}`} cx={((sample + 3) / 6) * 620} cy="170" r="4" fill="#dc2626" />
              ))}
            </svg>
            <p className="text-sm text-gray-700">拖动 h：小带宽保留两个样本簇的局部细节，大带宽逐渐把它们平滑为宽峰。</p>
          </div>
        }
      />
    </div>
  );
}
