import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import PredictionGate from '@/components/PredictionGate';
import KaTeX from '@/components/KaTeX';
import { filterHiddenStates } from '@/lib/math/sequenceModels';

const OBSERVATION_LABELS = ['无伞', '有伞'];

export default function SequenceModelsLab() {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [persistence, setPersistence] = useState(0.8);
  const [accuracy, setAccuracy] = useState(0.85);
  const [observations, setObservations] = useState([0, 1, 1]);

  const transition = useMemo(
    () => [[persistence, 1 - persistence], [1 - persistence, persistence]],
    [persistence],
  );
  const emission = useMemo(
    () => [[accuracy, 1 - accuracy], [1 - accuracy, accuracy]],
    [accuracy],
  );
  const posteriors = useMemo(
    () => filterHiddenStates([0.5, 0.5], transition, emission, observations),
    [transition, emission, observations],
  );

  const toggleObservation = (index: number) => {
    setObservations((current) =>
      current.map((value, itemIndex) => (itemIndex === index ? 1 - value : value)),
    );
  };

  return (
    <InteractiveDemo title="序列模型实验：谁满足马尔可夫性质？">
      <div className="space-y-6">
        <PredictionGate
          resetKey="chapter08-hidden-markov"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="在一阶隐状态空间模型中，哪条序列由模型直接保证满足一阶马尔可夫性质？"
          hint="教材把条件独立 z(n+1) ⟂ z(n−1) | z(n) 写在哪一层节点上？"
          options={[
            { value: 'hidden', label: '隐状态序列 z₁,z₂,…' },
            { value: 'observed', label: '观测序列 x₁,x₂,…' },
            { value: 'both', label: '两条序列都满足' },
          ]}
          evaluatePrediction={(answer) => ({
            correct: answer === 'hidden',
            category: '隐状态马尔可夫性质',
            feedback: answer === 'hidden'
              ? '正确。模型把一阶马尔可夫假设施加在 z 链上；观测历史则通过 z 的过滤后验持续影响未来。'
              : '观测 x 只在给定对应隐状态 z 时条件独立；边缘化 z 后，最后一次观测通常不能概括全部历史。',
          })}
          revealContent={(
            <div className="space-y-2 text-sm text-gray-700">
              <KaTeX math={String.raw`z_{n+1}\perp z_{n-1}\mid z_n`} display />
              <p>“状态”之所以有用，正因为它把预测未来所需的历史信息压缩到了当前隐变量中。</p>
            </div>
          )}
        />

        {submitted && (
          <div aria-label="隐状态序列过滤实验控制区" className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="rounded-xl border bg-white p-4 text-sm text-gray-700">
                天气持续概率：{persistence.toFixed(2)}
                <input className="mt-3 w-full accent-blue-600" type="range" min="0.5" max="0.95" step="0.05" value={persistence} onChange={(event) => setPersistence(Number(event.target.value))} />
              </label>
              <label className="rounded-xl border bg-white p-4 text-sm text-gray-700">
                雨伞观测准确率：{accuracy.toFixed(2)}
                <input className="mt-3 w-full accent-blue-600" type="range" min="0.55" max="0.95" step="0.05" value={accuracy} onChange={(event) => setAccuracy(Number(event.target.value))} />
              </label>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-bold text-blue-950">点击切换三天的观测</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {observations.map((observation, index) => (
                  <button key={index} type="button" onClick={() => toggleObservation(index)} className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-100">
                    第 {index + 1} 天：{OBSERVATION_LABELS[observation]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {posteriors.map((posterior, index) => (
                <div key={index} className="rounded-xl border bg-white p-4 text-center">
                  <span className="text-xs text-gray-500">看到“{OBSERVATION_LABELS[observations[index]]}”后</span>
                  <strong className="mt-2 block text-2xl text-blue-800">P(雨天)={(posterior[1] * 100).toFixed(1)}%</strong>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-amber-100"><div className="h-full bg-blue-600" style={{ width: `${posterior[1] * 100}%` }} /></div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
              即使最后一天同样看到“有伞”，前两天的观测仍会改变当前雨天后验。预测未来所需的是
              <KaTeX math={String.raw`p(z_n\mid x_{1:n})`} />，而不只是最后一个 <KaTeX math="x_n" />；这正是观测序列一般并非有限阶马尔可夫链的数值证据。
            </div>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
