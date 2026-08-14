import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import PredictionGate, { type Evaluation } from '@/components/PredictionGate';
import { Slider } from '@/components/ui/slider';
import { cycleGanCandidates, rankCycleGanCandidates } from '@/lib/math/gan';

const INITIAL_WEIGHT = 4;

function evaluatePrediction(prediction: string): Evaluation {
  if (prediction === 'shortcut') {
    return {
      correct: true,
      category: '正确',
      feedback: '权重为 4 时，可逆捷径的总误差为 1.8，低于语义正确映射的 2.3。',
    };
  }
  return {
    correct: false,
    category: '需要同时计算两项',
    feedback: '分别代入 L_adv+ηL_cyc：语义映射为 2.3，可逆捷径为 1.8。',
  };
}

export default function CycleGANTradeoffLab() {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [cycleWeight, setCycleWeight] = useState(INITIAL_WEIGHT);
  const ranking = useMemo(() => rankCycleGanCandidates(cycleWeight), [cycleWeight]);
  const threshold = (
    (cycleGanCandidates[1].adversarial - cycleGanCandidates[0].adversarial)
    / (cycleGanCandidates[0].cycle - cycleGanCandidates[1].cycle)
  );

  return (
    <InteractiveDemo title="CycleGAN 权衡实验：语义映射还是可逆捷径">
      <div className="space-y-6 text-sm text-gray-700">
        <p>
          比较两个候选映射。语义正确映射更像目标域，但往返误差略大；可逆捷径更容易还原输入，
          却不一定表达正确语义。总目标为 <KaTeX math={String.raw`L=L_{\mathrm{adv}}+\eta L_{\mathrm{cyc}}`} />。
        </p>

        <PredictionGate
          resetKey="cycle-gan-candidate"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="当循环权重 η=4 时，优化器会偏好哪个候选映射？"
          hint="语义映射：0.9+4×0.35；可逆捷径：1.6+4×0.05。"
          evaluatePrediction={evaluatePrediction}
          options={[
            { value: 'semantic', label: '语义正确映射' },
            { value: 'shortcut', label: '可逆捷径映射' },
            { value: 'tie', label: '两者总误差相同' },
          ]}
          revealContent={(
            <div className="space-y-2">
              <p>较大的循环权重会强烈奖励低往返误差，所以目标函数可能选择可逆但语义错误的捷径。</p>
              <p className="font-medium text-rose-800">反例结论：循环一致性保证“能回来”，不保证“翻译对了”。</p>
            </div>
          )}
        />

        {revealed && (
          <div aria-label="CycleGAN 损失权衡实验区" className="rounded-xl border border-blue-200 bg-blue-50 p-5 space-y-5">
            <div className="space-y-2">
              <label className="font-medium text-gray-800">
                循环权重 <KaTeX math="\eta" /> = {cycleWeight.toFixed(1)}
              </label>
              <Slider
                value={[cycleWeight]}
                min={0}
                max={8}
                step={0.1}
                onValueChange={([value]) => setCycleWeight(value)}
              />
              <p className="text-xs text-gray-500">
                临界权重约为 η={threshold.toFixed(2)}；超过它后，可逆捷径的总误差更低。
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {ranking.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className={`rounded-lg border p-4 ${index === 0 ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-bold text-gray-900">{candidate.label}</h4>
                    {index === 0 && <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs font-bold text-white">当前更优</span>}
                  </div>
                  <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div><dt className="text-xs text-gray-500">对抗项</dt><dd className="font-mono font-bold">{candidate.adversarial.toFixed(2)}</dd></div>
                    <div><dt className="text-xs text-gray-500">循环项</dt><dd className="font-mono font-bold">{candidate.cycle.toFixed(2)}</dd></div>
                    <div><dt className="text-xs text-gray-500">总误差</dt><dd className="font-mono font-bold text-blue-700">{candidate.total.toFixed(2)}</dd></div>
                  </dl>
                </div>
              ))}
            </div>

            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
              迁移挑战：若新任务更重视结构保持，可提高 η；但必须额外检查语义、身份映射或任务指标，不能只看循环误差。
            </p>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
