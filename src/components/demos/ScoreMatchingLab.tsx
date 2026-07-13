import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import KaTeX from '@/components/KaTeX';
import PredictionGate, { type Evaluation } from '@/components/PredictionGate';
import {
  conditionalScore,
  monteCarloMarginalScore,
  scoreFromPredictedEpsilon,
  predictEpsilon,
  corrupt,
  generateCleanSamples,
  l2Distance,
  getAlphaBar,
  type ScheduleType,
} from '@/lib/math/scoreMatching';
import { boxMuller, mulberry32 } from '@/lib/math/diffusion';

const T = 50;
const N_SAMPLES = 300;
const DATA_SEED = 42;

export default function ScoreMatchingLab() {
  const [schedule, setSchedule] = useState<ScheduleType>('linear');
  const [t, setT] = useState(15);
  const [sampleIdx, setSampleIdx] = useState(0);
  const [weight, setWeight] = useState(0.5);
  const [useSingleEpsilon, setUseSingleEpsilon] = useState(false);
  const [numMonteCarlo, setNumMonteCarlo] = useState(200);
  const [noiseSeed, setNoiseSeed] = useState(7);

  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const data = useMemo(() => generateCleanSamples(N_SAMPLES, DATA_SEED), []);
  const alphaBarT = useMemo(() => getAlphaBar(schedule, T)(t), [schedule, t]);

  const x0 = data[sampleIdx]!;
  const epsilon0 = useMemo(() => {
    const rng = mulberry32(noiseSeed + sampleIdx);
    return [boxMuller(rng), boxMuller(rng)];
  }, [noiseSeed, sampleIdx]);

  const zt = useMemo(
    () => corrupt(x0, epsilon0, alphaBarT),
    [x0, epsilon0, alphaBarT],
  );

  const conditionalScoreVal = useMemo(
    () => conditionalScore(x0, epsilon0, t, alphaBarT),
    [x0, epsilon0, t, alphaBarT],
  );

  const marginalScoreVal = useMemo(
    () =>
      monteCarloMarginalScore(
        zt,
        t,
        alphaBarT,
        numMonteCarlo,
        data,
        noiseSeed + t * 31 + sampleIdx,
      ),
    [zt, t, alphaBarT, numMonteCarlo, noiseSeed, sampleIdx, data],
  );

  const predictedScoreVal = useMemo(() => {
    const epsHat = predictEpsilon(zt, t, alphaBarT, weight);
    return scoreFromPredictedEpsilon(epsHat, t, alphaBarT);
  }, [zt, t, alphaBarT, weight]);

  const activeScore = useSingleEpsilon ? conditionalScoreVal : marginalScoreVal;
  const l2Error = useMemo(
    () => l2Distance(predictedScoreVal, activeScore),
    [predictedScoreVal, activeScore],
  );

  const handleSampleChange = (idx: number) => {
    setSampleIdx(idx);
    setPrediction('');
    setSubmitted(false);
    setRevealed(false);
  };

  const handleScheduleChange = (value: string) => {
    setSchedule(value as ScheduleType);
  };

  const evaluatePrediction = (pred: string): Evaluation => {
    if (pred !== 'yes' && pred !== 'no') {
      return {
        correct: false,
        category: '无效选择',
        feedback: '请选择“是”或“否”。',
      };
    }
    if (pred === 'no') {
      return {
        correct: true,
        category: '正确',
        feedback:
          '单次采样的 ε 只是众多可能噪声中的一个实现；边缘分数需要对它取条件期望。',
      };
    }
    return {
      correct: false,
      category: '混淆了样本与期望',
      feedback:
        'ε 是随机噪声的一个样本，而 ∇ log q_t(z_t) 是对所有能生成同一 z_t 的 (x, ε) 取平均后的结果。两者一般不相等。',
    };
  };

  // SVG layout
  const domain = { xMin: -5, xMax: 5, yMin: -5, yMax: 5 };
  const W = 420;
  const H = 360;
  const MG = { t: 10, r: 10, b: 35, l: 45 };
  const PW = W - MG.l - MG.r;
  const PH = H - MG.t - MG.b;
  const toX = (v: number) =>
    MG.l + ((v - domain.xMin) / (domain.xMax - domain.xMin)) * PW;
  const toY = (v: number) =>
    MG.t + PH - ((v - domain.yMin) / (domain.yMax - domain.yMin)) * PH;

  const fmtVec = (v: number[]) => `(${v[0].toFixed(2)}, ${v[1].toFixed(2)})`;

  return (
    <InteractiveDemo title="Score Matching 实验：从单次噪声到边缘分数">
      <div className="space-y-5 text-sm text-gray-700">
        <div>
          前向扩散过程满足
          <KaTeX math="z_t=\sqrt{\bar\alpha_t}\,x+\sqrt{1-\bar\alpha_t}\,\varepsilon" />
          。给定同一个
          <KaTeX math="z_t" />，有很多
          <KaTeX math="(x,\varepsilon)" />对可以生成它。真实边缘分数是对应的条件期望：
          <KaTeX
            math="\nabla_{z_t}\log q_t(z_t)=-\frac{\mathbb{E}[\varepsilon\mid z_t]}{\sqrt{1-\bar\alpha_t}}"
            display
          />
        </div>

        {/* Schedule selector */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-medium">迁移挑战：噪声调度</span>
          <RadioGroup
            value={schedule}
            onValueChange={handleScheduleChange}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="linear" id="sched-linear" />
              <Label htmlFor="sched-linear">线性</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="cosine" id="sched-cosine" />
              <Label htmlFor="sched-cosine">余弦</Label>
            </div>
          </RadioGroup>
          <span className="text-xs text-gray-500">
            ᾱ_t = {alphaBarT.toFixed(4)}, 1−ᾱ_t = {(1 - alphaBarT).toFixed(4)}
          </span>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>时间步 t</span>
              <span>{t}</span>
            </div>
            <Slider
              value={[t]}
              min={1}
              max={T}
              step={1}
              onValueChange={([v]) => setT(v)}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>干净样本索引</span>
              <span>{sampleIdx}</span>
            </div>
            <Slider
              value={[sampleIdx]}
              min={0}
              max={N_SAMPLES - 1}
              step={1}
              onValueChange={([v]) => handleSampleChange(v)}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>网络权重 w（ε̂ = w·√(1−ᾱ_t)·z_t）</span>
              <span>{weight.toFixed(2)}</span>
            </div>
            <Slider
              value={[weight]}
              min={-2}
              max={2}
              step={0.05}
              onValueChange={([v]) => setWeight(v)}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Monte Carlo 样本数</span>
              <span>{numMonteCarlo}</span>
            </div>
            <Slider
              value={[numMonteCarlo]}
              min={10}
              max={1000}
              step={10}
              onValueChange={([v]) => setNumMonteCarlo(v)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={useSingleEpsilon ? 'destructive' : 'outline'}
            onClick={() => setUseSingleEpsilon((v) => !v)}
          >
            {useSingleEpsilon ? '✗ 使用单次 ε（反例模式）' : '切换到单次 ε 反例模式'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setNoiseSeed((s) => s + 1)}
          >
            🎲 重新采样噪声
          </Button>
        </div>

        {/* Linked views */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              style={{ maxHeight: 360 }}
            >
              <line
                x1={toX(0)}
                y1={toY(domain.yMin)}
                x2={toX(0)}
                y2={toY(domain.yMax)}
                stroke="#d1d5db"
                strokeWidth={1}
              />
              <line
                x1={toX(domain.xMin)}
                y1={toY(0)}
                x2={toX(domain.xMax)}
                y2={toY(0)}
                stroke="#d1d5db"
                strokeWidth={1}
              />
              {data.map((p, i) => (
                <circle
                  key={i}
                  cx={toX(p[0])}
                  cy={toY(p[1])}
                  r={i === sampleIdx ? 4 : 1.5}
                  fill={i === sampleIdx ? '#3b82f6' : '#9ca3af'}
                  opacity={i === sampleIdx ? 1 : 0.5}
                />
              ))}
              <circle
                cx={toX(zt[0])}
                cy={toY(zt[1])}
                r={6}
                fill="none"
                stroke="#ef4444"
                strokeWidth={2}
              />
              <text
                x={toX(zt[0]) + 8}
                y={toY(zt[1]) - 8}
                className="text-[10px] fill-red-600"
              >
                z_t
              </text>
              <rect
                x={MG.l}
                y={MG.t}
                width={PW}
                height={PH}
                fill="none"
                stroke="#9ca3af"
                strokeWidth={1}
              />
            </svg>
            <div className="text-[10px] text-center text-gray-500 pb-1">
              蓝色 = 选中的干净样本 x，红色 = 加噪后的 z_t
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-lg border p-3">
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-2 font-medium">z_t</td>
                    <td className="py-2 font-mono text-right">{fmtVec(zt)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-2 font-medium">单次噪声 ε</td>
                    <td className="py-2 font-mono text-right">
                      {fmtVec(epsilon0)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-2 font-medium">
                      条件分数
                      <KaTeX math="\nabla\log q(z_t\mid x)" />
                    </td>
                    <td className="py-2 font-mono text-right">
                      {fmtVec(conditionalScoreVal)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-2 font-medium">
                      Monte Carlo 边缘分数
                      <KaTeX math="\nabla\log q_t(z_t)" />
                    </td>
                    <td className="py-2 font-mono text-right">
                      {fmtVec(marginalScoreVal)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-2 font-medium">
                      网络预测分数
                      <KaTeX math="s_\theta(z_t)" />
                    </td>
                    <td className="py-2 font-mono text-right">
                      {fmtVec(predictedScoreVal)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-2 font-medium">
                      当前对照估计
                      {useSingleEpsilon ? '（单次 ε）' : '（Monte Carlo）'}
                    </td>
                    <td className="py-2 font-mono text-right">
                      {fmtVec(activeScore)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-2 font-medium">
                      L2 误差（预测 vs 当前估计）
                    </td>
                    <td className="py-2 font-mono text-right">
                      {l2Error.toFixed(3)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              className={`rounded-lg border p-3 text-xs ${
                useSingleEpsilon
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              {useSingleEpsilon
                ? '对照模式：仅使用单次 ε 估计分数。改变干净样本或重新采样噪声，该估计会大幅波动。'
                : 'Monte Carlo 模式：对大量能生成同一 z_t 的 (x, ε) 取平均，估计更稳定，是网络的真实学习目标。'}
            </div>
          </div>
        </div>

        <PredictionGate
          resetKey={`${sampleIdx}-${noiseSeed}-${t}`}
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((r) => !r)}
          canReveal={submitted}
          question="单次采样噪声 ε 是否等于真实边缘分数 ∇ log q_t(z_t)？"
          hint="想想：同一个 z_t 可以由多少不同的 (x, ε) 对生成？"
          evaluatePrediction={evaluatePrediction}
          revealContent={
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                不等于。单次采样的 ε 只是生成当前 z_t 的某一个具体噪声实现。
                真实边缘分数要求对同一 z_t 对应的所有可能 ε 取条件期望：
              </div>
              <KaTeX
                math="\nabla_{z_t}\log q_t(z_t)=-\frac{\mathbb{E}[\varepsilon\mid z_t]}{\sqrt{1-\bar\alpha_t}}"
                display
              />
              <div>
                神经网络的 MSE 目标
                <KaTeX math="\mathbb{E}[\|\varepsilon_\theta(z_t,t)-\varepsilon\|^2]" />
                因此最优预测是
                <KaTeX math="\varepsilon_\theta(z_t,t)=\mathbb{E}[\varepsilon\mid z_t]" />
                ，而不是某一次具体的 ε。
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded p-2">
                  单次 ε：{fmtVec(epsilon0)}
                </div>
                <div className="bg-gray-50 rounded p-2">
                  Monte Carlo E[ε|z_t] 缩放后：{fmtVec(marginalScoreVal)}
                </div>
              </div>
            </div>
          }
        >
          <div className="space-y-2">
            <div className="font-medium">选择你的判断：</div>
            <RadioGroup
              value={prediction}
              onValueChange={(v) => !submitted && setPrediction(v)}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="pred-yes" disabled={submitted} />
                <Label htmlFor="pred-yes">是</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="pred-no" disabled={submitted} />
                <Label htmlFor="pred-no">否</Label>
              </div>
            </RadioGroup>
          </div>
        </PredictionGate>
      </div>
    </InteractiveDemo>
  );
}
