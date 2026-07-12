import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import PredictionGate from '@/components/PredictionGate';
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
  const [locked, setLocked] = useState(false);

  const x = data[sampleIdx];
  const q = constrainSimplex(q12);
  const posterior = truePosterior(x, MEANS, WEIGHTS, SIGMA);
  const { elbo, logPx, kl } = computeELBO(x, q, MEANS, WEIGHTS, SIGMA);
  const residual = identityResidual(logPx, elbo, kl);

  const mostLikelyComponent = posterior.indexOf(Math.max(...posterior));

  const setUniform = () => {
    setQ12([1 / K, 1 / K]);
  };

  const setToPosterior = () => {
    setQ12([posterior[0], posterior[1]]);
  };

  const handleSampleChange = (idx: number) => {
    setSampleIdx(idx);
    setLocked(false);
    setUniform();
  };

  const resetDemo = () => {
    setLocked(false);
    setUniform();
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
        question={`观察当前样本 x = ${x.toFixed(2)}，你认为最可能来自哪个高斯分量 z？请在下方写下你的预测。`}
        hint={`比较每个分量在该 x 处的相对高度：p(z=k|x,θ) ∝ π_k · N(x|μ_k,σ²)。真实后验的最大值出现在 k = ${mostLikelyComponent}。`}
        revealContent={
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-700 mb-2">真实后验 p(z=k | x, θ)</p>
              <ProbabilityBars values={posterior} />
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
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            用下面两个滑块设置你的试用分布 q(z)。q₀ 与 q₁ 是实际概率，q₂ = 1 − q₀ − q₁ 自动保证三者之和为 1。
          </p>

          <div className="bg-indigo-50 rounded-lg p-4 space-y-5">
            <SimplexSlider
              label="q(z=0)"
              value={q[0]}
              max={1 - q12[1]}
              disabled={locked}
              onChange={(v) => setQ12([v, q12[1]])}
            />
            <SimplexSlider
              label="q(z=1)"
              value={q[1]}
              max={1 - q12[0]}
              disabled={locked}
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

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={setToPosterior}
              disabled={locked}
              className="text-sm"
            >
              令 q = 真实后验
            </Button>
            <Button
              type="button"
              onClick={() => setLocked(true)}
              disabled={locked}
              className="text-sm"
            >
              提交并锁定
            </Button>
            {locked && (
              <Button type="button" variant="ghost" onClick={resetDemo} className="text-sm">
                解锁 / 重置
              </Button>
            )}
          </div>

          {locked && (
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 text-sm text-violet-800">
              已锁定你的预测。点击上方“✨ 揭晓答案”查看真实后验、ELBO 分解与解释。
            </div>
          )}
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

function ProbabilityBars({ values }: { values: number[] }) {
  return (
    <div className="space-y-2">
      {values.map((g, k) => (
        <div key={k} className="flex items-center gap-2">
          <span className="w-8 text-gray-600">k={k}</span>
          <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${g * 100}%` }} />
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
