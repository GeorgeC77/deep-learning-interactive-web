import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import PredictionGate from '@/components/PredictionGate';
import { Slider } from '@/components/ui/slider';
import { bestValidationEpoch, earlyStoppingEpoch, syntheticLearningCurves } from '@/lib/math/learningCurves';

const W = 640;
const H = 300;
const P = { left: 55, right: 20, top: 20, bottom: 42 };

export default function LearningCurvesLab() {
  const [overfitRate, setOverfitRate] = useState(0.0002);
  const [patience, setPatience] = useState(6);
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const curve = useMemo(() => syntheticLearningCurves(100, overfitRate), [overfitRate]);
  const best = bestValidationEpoch(curve);
  const stopEpoch = earlyStoppingEpoch(curve, patience);
  const maxY = Math.max(...curve.map((point) => Math.max(point.train, point.validation))) * 1.05;
  const x = (epoch: number) => P.left + epoch / 100 * (W - P.left - P.right);
  const y = (error: number) => H - P.bottom - error / maxY * (H - P.top - P.bottom);
  const path = (key: 'train' | 'validation') => curve.map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(point.epoch)} ${y(point[key])}`).join(' ');

  return (
    <InteractiveDemo title="学习曲线实验：早停应保存哪个 checkpoint？">
      <div className="space-y-6">
        <PredictionGate
          resetKey="chapter06-early-stopping"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="训练误差仍在下降，但验证误差已经回升：最终应恢复哪个模型？"
          hint="区分触发停止的 epoch 与泛化表现最好的 epoch。"
          options={[
            { value: 'best', label: '验证误差最低时的 checkpoint' },
            { value: 'last', label: '停止触发时的最后一个 checkpoint' },
            { value: 'train', label: '训练误差最低时的 checkpoint' },
          ]}
          evaluatePrediction={(answer) => ({
            correct: answer === 'best',
            category: '早停',
            feedback: answer === 'best' ? '正确。patience 只决定何时停止，最终应恢复验证误差最低时的参数。' : '触发停止时模型通常已经过了最佳验证点，应保存并恢复 best checkpoint。',
          })}
          revealContent={<p className="text-sm text-gray-700">验证集参与模型选择；测试集应保留到所有选择完成后的最终一次评估。</p>}
        />

        {submitted && (
          <div className="space-y-5" aria-label="学习曲线与早停实验控制区">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm text-gray-700">过拟合增长率：{overfitRate.toFixed(5)}<Slider value={[overfitRate]} min={0.00005} max={0.0005} step={0.00005} onValueChange={([value]) => setOverfitRate(value)} /></label>
              <label className="text-sm text-gray-700">patience：{patience} epochs<Slider value={[patience]} min={0} max={20} step={1} onValueChange={([value]) => setPatience(value)} /></label>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border bg-gray-50">
              <rect x={P.left} y={P.top} width={W-P.left-P.right} height={H-P.top-P.bottom} fill="white" />
              <line x1={P.left} x2={P.left} y1={P.top} y2={H-P.bottom} stroke="#374151" />
              <line x1={P.left} x2={W-P.right} y1={H-P.bottom} y2={H-P.bottom} stroke="#374151" />
              <path d={path('train')} fill="none" stroke="#2563eb" strokeWidth="3" />
              <path d={path('validation')} fill="none" stroke="#dc2626" strokeWidth="3" />
              <line x1={x(best.epoch)} x2={x(best.epoch)} y1={P.top} y2={H-P.bottom} stroke="#059669" strokeWidth="2" strokeDasharray="5 4" />
              <text x={x(best.epoch)+5} y={P.top+15} fontSize="11" fill="#047857">best = {best.epoch}</text>
              <text x={W-160} y={35} fontSize="12" fill="#2563eb">训练误差</text>
              <text x={W-160} y={53} fontSize="12" fill="#dc2626">验证误差</text>
              <text x={W/2} y={H-10} textAnchor="middle" fontSize="12">epoch</text>
            </svg>
            <div className="grid gap-3 sm:grid-cols-3 text-center text-sm">
              <div className="rounded-lg bg-emerald-50 p-3"><span className="block text-gray-600">最佳 checkpoint</span><strong>{best.epoch}</strong></div>
              <div className="rounded-lg bg-amber-50 p-3"><span className="block text-gray-600">patience 触发后恢复</span><strong>{stopEpoch}</strong></div>
              <div className="rounded-lg bg-blue-50 p-3"><span className="block text-gray-600">最佳验证误差</span><strong>{best.validation.toFixed(3)}</strong></div>
            </div>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
