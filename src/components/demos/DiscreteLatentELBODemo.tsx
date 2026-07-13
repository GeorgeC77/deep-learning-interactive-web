import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import PredictionGate, { type Evaluation } from '@/components/PredictionGate';
import {
  generateGMMData,
  truePosterior,
  computeELBO,
  identityResidual,
  constrainSimplex,
} from '@/lib/math/discreteElbo';

const K = 3;
const MEANS = [-2, 0, 2];
const WEIGHTS = [0.3, 0.4, 0.3];
const SIGMA = 1;
const SEED = 7;

export default function DiscreteLatentELBODemo() {
  const data = useMemo(() => generateGMMData(8, SEED, MEANS, WEIGHTS, SIGMA), []);
  const [sampleIdx, setSampleIdx] = useState(0);
  const [q12, setQ12] = useState<[number, number]>([1 / K, 1 / K]);
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const x = data[sampleIdx];
  const q = constrainSimplex(q12);
  const posterior = truePosterior(x, MEANS, WEIGHTS, SIGMA);
  const { elbo, logPx, kl } = computeELBO(x, q, MEANS, WEIGHTS, SIGMA);
  const residual = identityResidual(logPx, elbo, kl);

  const trueK = posterior.indexOf(Math.max(...posterior));

  const setToPosterior = () => {
    setQ12([posterior[0], posterior[1]]);
  };

  const handleSampleChange = (idx: number) => {
    setSampleIdx(idx);
    setQ12([1 / K, 1 / K]);
    setPrediction('');
    setSubmitted(false);
    setRevealed(false);
  };

  const evaluatePrediction = (pred: string): Evaluation => {
    const predictedK = parseInt(pred, 10);
    if (Number.isNaN(predictedK) || predictedK < 0 || predictedK >= K) {
      return {
        correct: false,
        category: '无效选择',
        feedback: '请从 z=0、z=1、z=2 中选择一个分量。',
      };
    }

    if (predictedK === trueK) {
      return {
        correct: true,
        category: '正确',
        feedback: '你选中的分量确实是当前后验概率最大的分量。',
      };
    }

    // Heuristic targeted feedback.
    const predictedLikelihoodRank = MEANS
      .map((mu, k) => ({ k, dist: Math.abs(x - mu) }))
      .sort((a, b) => a.dist - b.dist)
      .findIndex((item) => item.k === predictedK);

    const predictedPriorRank = WEIGHTS
      .map((w, k) => ({ k, w }))
      .sort((a, b) => b.w - a.w)
      .findIndex((item) => item.k === predictedK);

    if (predictedLikelihoodRank === 0 && predictedPriorRank > 0) {
      return {
        correct: false,
        category: '只看 likelihood 距离',
        feedback: '你选择的分量均值离 x 最近，但后验还要乘以先验权重 π_k。请比较 π_k · N(x|μ_k,σ²) 的相对大小。',
      };
    }

    if (predictedPriorRank === 0 && predictedLikelihoodRank > 0) {
      return {
        correct: false,
        category: '只看先验权重',
        feedback: '你选择的分量先验权重最大，但当前 x 可能离它的均值更远。后验是 likelihood 与先验的乘积。',
      };
    }

    return {
      correct: false,
      category: '其他错误',
      feedback: `正确答案是 z=${trueK}。请再次比较三个分量的 π_k · N(x|μ_k,σ²)。`,
    };
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold">ELBO</div>
        <h2 className="text-2xl font-bold text-gray-900">离散隐变量：GMM 后验与 ELBO 恒等式</h2>
      </div>

      <div className="text-sm text-gray-700 space-y-2">
        <p>
          这是一个可精确求出后验的玩具 GMM。下面的 q(z) 是一个<strong>试用的变分分布</strong>，用于演示 ELBO 分解恒等式，而不是训练一个神经网络变分自编码器。
        </p>
        <p className="font-mono text-blue-900 bg-blue-50 rounded-lg p-2 inline-block">
          ln p(x|θ) = ELBO(q) + KL(q || p(z|x,θ))
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
        <p className="font-medium text-gray-700">当前 GMM 参数</p>
        <div className="grid grid-cols-2 gap-2 text-gray-600">
          <span>均值 μ：{MEANS.join(', ')}</span>
          <span>权重 π：{WEIGHTS.map((w) => w.toFixed(1)).join(', ')}</span>
          <span>标准差 σ：{SIGMA}</span>
          <span>样本数 N：{data.length}</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">选择样本 x：{x.toFixed(2)}</label>
        <Slider
          value={[sampleIdx]}
          min={0}
          max={data.length - 1}
          step={1}
          onValueChange={([v]) => handleSampleChange(v)}
          className="mt-2"
        />
      </div>

      <PredictionGate
        resetKey={sampleIdx}
        prediction={prediction}
        onPredictionChange={setPrediction}
        submitted={submitted}
        onSubmit={() => setSubmitted(true)}
        revealed={revealed}
        onReveal={() => setRevealed((r) => !r)}
        canReveal={submitted}
        question={`观察当前样本 x = ${x.toFixed(2)}，你认为最可能来自哪个高斯分量 z？请选择并提交。`}
        hint="比较每个分量在该 x 处的相对高度：p(z=k|x,θ) ∝ π_k · N(x|μ_k,σ²)。"
        evaluatePrediction={evaluatePrediction}
        revealContent={
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-700 mb-2">真实后验 p(z=k | x, θ)</p>
              <ProbabilityBars values={posterior} highlight={trueK} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricBox label="ln p(x|θ)" value={logPx} />
              <MetricBox label="ELBO(q)" value={elbo} />
              <MetricBox label="KL(q||p)" value={kl} />
              <MetricBox label="残差 |恒等式|" value={residual} />
            </div>

            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <span className="font-medium">恒等式验证：</span>
                上表中的残差是 |ln p(x|θ) − ELBO(q) − KL(q||p)|。若 q 与真实后验完全一致，KL 会严格为 0，ELBO 会等于对数似然。
              </p>
              <p>
                <span className="font-medium">ELBO 的另一种写法：</span>
                <span className="font-mono">ELBO(q) = E_q[ln p(x,z|θ)] + H(q)</span>，其中 H(q) 是 q 的熵。KL 项量化了 q 与真实后验的差距。
              </p>
              <p className="text-gray-500">
                注意：这里我们直接计算了真实后验；在实际 VAE 中，后验通常不可解，因此才需要神经网络去近似它。
              </p>
            </div>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm text-gray-700 font-medium">1. 选择最可能的分量 z</p>
            <RadioGroup
              value={prediction}
              onValueChange={(v) => !submitted && setPrediction(v)}
              className="flex items-center gap-4"
            >
              {[0, 1, 2].map((k) => (
                <div key={k} className="flex items-center gap-2">
                  <RadioGroupItem value={String(k)} id={`pred-${k}`} disabled={submitted} />
                  <Label htmlFor={`pred-${k}`} className="text-sm text-gray-700">
                    z = {k} (μ={MEANS[k]})
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-700 font-medium">2. 设置你的试用分布 q(z)</p>
            <p className="text-xs text-gray-500">
              q₀ 与 q₁ 是实际概率，q₂ = 1 − q₀ − q₁ 自动保证三者之和为 1。
            </p>

            <div className="bg-indigo-50 rounded-lg p-4 space-y-5">
              <SimplexSlider
                label="q(z=0)"
                value={q[0]}
                max={1 - q12[1]}
                disabled={submitted}
                onChange={(v) => setQ12([v, q12[1]])}
              />
              <SimplexSlider
                label="q(z=1)"
                value={q[1]}
                max={1 - q12[0]}
                disabled={submitted}
                onChange={(v) => setQ12([q12[0], v])}
              />
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-16">q(z=2)</span>
                <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden">
                  <div className="h-full bg-indigo-400" style={{ width: `${q[2] * 100}%` }} />
                </div>
                <span className="w-16 text-right">{q[2].toFixed(3)}</span>
              </div>
              <p className="text-xs text-gray-500">q 求和：{q.reduce((a, b) => a + b, 0).toFixed(3)}</p>
            </div>

            {revealed && (
              <Button
                type="button"
                variant="outline"
                onClick={setToPosterior}
                disabled={false}
                className="text-sm"
              >
                令 q = 真实后验
              </Button>
            )}
          </div>
        </div>
      </PredictionGate>
    </section>
  );
}

function SimplexSlider({
  label,
  value,
  max,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  disabled: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span>{value.toFixed(3)}</span>
      </div>
      <Slider
        value={[value]}
        min={0}
        max={Math.max(0, max)}
        step={0.01}
        disabled={disabled}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

function ProbabilityBars({ values, highlight }: { values: number[]; highlight?: number }) {
  return (
    <div className="space-y-2">
      {values.map((g, k) => (
        <div key={k} className="flex items-center gap-2">
          <span className={`w-8 ${k === highlight ? 'font-bold text-emerald-700' : 'text-gray-600'}`}>k={k}</span>
          <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden">
            <div
              className={`h-full ${k === highlight ? 'bg-emerald-500' : 'bg-blue-500'}`}
              style={{ width: `${g * 100}%` }}
            />
          </div>
          <span className="w-16 text-right">{g.toFixed(3)}</span>
        </div>
      ))}
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 text-center">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-lg font-bold text-blue-700">{Number.isFinite(value) ? value.toFixed(3) : '—'}</div>
    </div>
  );
}
