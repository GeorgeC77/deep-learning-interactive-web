import { useCallback, useState } from 'react';
import PredictionGate, { type Evaluation } from '@/components/PredictionGate';
import { positiveTestPosterior } from '@/lib/math/prerequisiteProbability';

const posterior = positiveTestPosterior(0.01, 0.9, 0.03);

export default function MedicalScreeningPredictionLab({ onUnlock }: { onUnlock?: () => void }) {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const changePrediction = useCallback((value: string) => setPrediction(value), []);
  const toggleReveal = useCallback(() => setRevealed((value) => !value), []);

  const evaluatePrediction = (answer: string): Evaluation => ({
    correct: answer === '23',
    category: answer === '90' ? '混淆似然与后验' : answer === '97' ? '忽略基础概率' : '正确使用贝叶斯更新',
    feedback: answer === '23'
      ? '你同时考虑了低患病率、真阳性和假阳性。'
      : '检测的灵敏度不是阳性后的患病概率；还必须把数量更多的健康人产生的假阳性计入分母。',
  });

  return (
    <div className="space-y-4" aria-label="医学筛查预测实验">
      <PredictionGate
        resetKey="screening-1-90-3"
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
        question="某病患病率 1%，检测灵敏度 90%、假阳性率 3%。一个人检测阳性后，患病概率更接近多少？"
        hint="想象 10,000 人：分别数出患病者中的真阳性和健康者中的假阳性。"
        options={[
          { value: '23', label: '约 23%' },
          { value: '90', label: '约 90%' },
          { value: '97', label: '约 97%' },
        ]}
        evaluatePrediction={evaluatePrediction}
        revealContent={
          <div className="space-y-3 text-sm text-gray-700">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-emerald-50 p-3"><strong>真阳性：</strong>10,000×1%×90%=90 人</div>
              <div className="rounded-lg bg-amber-50 p-3"><strong>假阳性：</strong>10,000×99%×3%=297 人</div>
            </div>
            <p className="font-medium text-violet-900">
              因而 p(患病|阳性)=90/(90+297)={(posterior * 100).toFixed(1)}%。
            </p>
          </div>
        }
      />
    </div>
  );
}
